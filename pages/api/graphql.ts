// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'firebase/compat/storage';

import { Context } from '@apollo/client';
import { isValid } from 'date-fns';
import { DecodedIdToken } from 'firebase-admin/auth';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';
import _ from 'lodash';

import { firestore } from '../../firebase/firebase-admin-config';
import { verifyToken } from './verify-token';

type MyContext = { user?: DecodedIdToken };
const admMessage = 'Tuto funkci může používat pouze správce';
const constant = 'Zásilková služba';
const NotFoundMsg = (headerOfMsg: string) => {
  return headerOfMsg === constant
    ? `${headerOfMsg} nenalezena.`
    : `${headerOfMsg} nenalezen. `;
};

const typeDefs = gql`
  type Query {
    suplierData: [QuerySuppD!]!
    historyUserData: [QueryHistoryData!]!
  }

  type Mutation {
    BingoSupPac(
      width: Int!
      weight: Int!
      height: Int!
      Plength: Int!
      where: String!
      fromWhere: String!
      cost: Int!
    ): SuitValue
    AddHistory(uId: String!, data: String!): HistoryMessage

    PackageToFirestore(
      weight: Int!
      cost: Int!
      Plength: Int!
      height: Int!
      width: Int!
      name_package: String!
      supplier_id: String!
      packId: String!
    ): CreatedPack

    updateHistory(
      newPricePack: Int
      newPricePersonal: Int
      newPriceDepo: Int
      suppId: String
      packName: String
      oldPackName: String
      suppData: DataUpdateSupp
      oldSuppName: String
    ): HistoryMessage

    updatePack(
      weight: Int!
      cost: Int!
      Plength: Int!
      height: Int!
      width: Int!
      name_package: String!
      PackKey: String!
      supplier_id: String!
    ): UpdatedPack

    SupplierToFirestore(
      supplierName: String!
      delivery: String!
      shippingLabel: String!
      pickUp: String!
      foil: String
      insurance: Int!
      sendCashDelivery: String!
      packInBox: String!
      depoCost: Int!
      personalCost: Int!
    ): Supplier

    updateSup(
      supplierName: String!
      delivery: String!
      shippingLabel: String!
      pickUp: String!
      foil: String!
      insurance: Int!
      sendCashDelivery: String!
      packInBox: String!
      suppId: String!
      oldNameSupp: String!
      depoCost: Int!
      personalCost: Int!
    ): Supplier

    deletePack(suppId: String!, key: String!): Delete
    deleteSupp(id: [String]): Delete
    deleteHistoryItem(id: String!): Delete
  }

  input DataUpdateSupp {
    sendCashDelivery: String
    packInBox: String
    suppName: String
    pickUp: String
    delivery: String
    insurance: Int
    shippingLabel: String
    foil: String
    supplierId: String
  }

  scalar JSON

  type Suitable {
    suitable: String!
  }

  type ErrorMessage {
    message: String!
  }

  union SuitValue = Suitable | ErrorMessage

  type Delete {
    error: String
    deletion: Boolean!
  }

  type SupplierData {
    sendCashDelivery: String!
    packInBox: String!
    supplierId: String!
    suppName: String!
    pickUp: String!
    delivery: String!
    insurance: Int!
    shippingLabel: String!
    foil: String!
  }

  type SupplierError {
    message: String!
  }

  type Supp {
    data: SupplierData!
  }

  union Supplier = Supp | SupplierError

  type QuerySuppD {
    sendCashDelivery: String!
    packInBox: String!
    supplierId: String!
    suppName: String!
    pickUp: String!
    delivery: String!
    insurance: Int!
    shippingLabel: String!
    foil: String!
    package: JSON
    location: JSON
  }

  type QueryHistoryData {
    dataForm: FormData!
    historyId: String!
    suppData: historySupplierData!
  }

  type historySupplierData {
    insurance: Int!
    delivery: String!
    packInBox: String!
    name: String!
    pickup: String!
    shippingLabel: String!
    id: String!
    sendCashDelivery: String!
    foil: String!
    packName: String!
    cost: Int!
  }

  type FormData {
    width: Int!
    placeTo: String!
    weight: Int!
    placeFrom: String!
    plength: Int!
    height: Int!
  }

  type PackageError {
    message: String!
  }

  type PackageDataCreate {
    weight: Int!
    cost: Int!
    Plength: Int!
    height: Int!
    width: Int!
    name_package: String!
    packgeId: String!
    supplier_id: String!
  }

  type Pack {
    data: PackageDataCreate!
  }

  union CreatedPack = Pack | PackageError

  type PackageDataUpdate {
    weight: Int!
    cost: Int!
    Plength: Int!
    height: Int!
    width: Int!
    name_package: String!
    supplier_id: String!
  }

  type UPack {
    data: PackageDataUpdate!
  }

  type PackageUpdateError {
    message: String!
  }

  union UpdatedPack = UPack | PackageUpdateError

  type HistoryMessage {
    message: String!
  }
`;

const db = firestore();

const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
const responseSuccess = 'Úprava historie uživatelům byla úspěšná';
const responseFail = 'Úprava v historii neproběhla úspěšně';
const responseInfo = 'Žádná úprava v historii neproběhla';

// validace pro supplier
const ConverBool = (
  stringnU1: string,
  stringnU2: string,
  stringnU3: string,
  stringnU4: string,
) => {
  if (!['Yes', 'No'].includes(stringnU1)) {
    return true;
  }
  if (!['Yes', 'No'].includes(stringnU2)) {
    return true;
  }
  if (!['Yes', 'No'].includes(stringnU3)) {
    return true;
  }
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (!['Yes', 'No'].includes(stringnU4)) {
    return true;
  }
  return false;
};

type DataUpdateSupp = {
  sendCashDelivery: string;
  packInBox: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
  supplierId: string;
};

const doMathForPackage = async (
  data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  nPriceP: number,
  historyDoc: Array<
    FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  >,
  nameOfPack: string,
): Promise<string> => {
  let msg = '';

  let sum = 0;

  type Location = {
    depoDelivery: {
      delivery: string;
      cost: number;
    };
    personalDelivery: {
      delivery: string;
      cost: number;
    };
  };

  if (historyDoc.length > 0) {
    data.forEach((item) => {
      const loc: Location = item.data().location;
      sum =
        nPriceP +
        Number(loc.depoDelivery.cost) +
        Number(loc.personalDelivery.cost);
    });

    const promises = historyDoc.map(async (doc) => {
      const historyDocumentRef = doc.ref;
      if (nameOfPack === doc.data().suppData.packName) {
        try {
          await historyDocumentRef.update(
            new firestore.FieldPath('suppData', 'cost'),
            sum,
          );
          msg = responseSuccess;
        } catch {
          msg = responseFail;
        }
      }
      try {
        await historyDocumentRef.update(
          new firestore.FieldPath('suppData', 'cost'),
          sum,
          new firestore.FieldPath('suppData', 'packName'),
          nameOfPack,
        );
        msg = responseSuccess;
      } catch {
        msg = responseFail;
      }
    });
    await Promise.allSettled(promises);
  } else {
    msg = responseInfo;
  }

  return msg;
};

const doMathForOptionsDelivery = async (
  dataPackage: Array<{
    cost: number;
    namePack: string;
    suppName: string;
  }>,
  nPriceDepo: number,
  nPriceP: number,
  historyDoc: Array<
    FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  >,
  supplierData: DataUpdateSupp,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  type HistoryDoc = {
    uId: string;
    dataForm: {
      width: string;
      placeTo: string;
      weight: string;
      placeFrom: string;
      plength: string;
      height: string;
    };
    historyId: string;
    suppData: {
      insurance: number;
      delivery: string;
      packInBox: string;
      name: string;
      pickup: string;
      shippingLabel: string;
      id: string;
      sendCashDelivery: string;
      foil: string;
      packName: string;
      cost: number;
    };
  };

  type Response = {
    docID?: string;
    message: string;
  };

  const getCost = (
    dataOfPacks: Array<{
      cost: number;
      namePack: string;
      suppName: string;
    }>,
    nameSupp: string,
    namePack: string,
  ) => {
    for (const pack of dataOfPacks) {
      if (pack.namePack === namePack && pack.suppName === nameSupp) {
        return pack.cost;
      }
    }
    return 0;
  };

  const sum = nPriceDepo + nPriceP;
  const response: Array<Response> = [];

  if (historyDoc.length > 0) {
    const promises = historyDoc.map(async (document) => {
      const dataDoc = document.data() as HistoryDoc;
      const summaryCost = sum + dataPackage[0].cost;

      try {
        await document.ref.update({
          'suppData.delivery': supplierData.delivery,
          'suppData.pickup': supplierData.pickUp,
          'suppData.foil': supplierData.foil,
          'suppData.insurance': supplierData.insurance,
          'suppData.packInBox': supplierData.packInBox,
          'suppData.sendCashDelivery': supplierData.sendCashDelivery,
          'suppData.shippingLabel': supplierData.shippingLabel,
          'suppData.name': supplierData.suppName,
        });
        response.push({ docID: document.id, message: responseSuccess });
      } catch {
        response.push({ docID: document.id, message: responseFail });
      }

      if (
        dataPackage.some(
          (pack) =>
            pack.suppName === dataDoc.suppData.name &&
            pack.namePack === dataDoc.suppData.packName,
        ) &&
        summaryCost !== dataDoc.suppData.cost
      ) {
        try {
          await document.ref.update(
            new firestore.FieldPath('suppData', 'cost'),
            sum +
              getCost(
                dataPackage,
                dataDoc.suppData.name,
                dataDoc.suppData.packName,
              ),
          );
          response.push({
            docID: document.id,
            message: `${responseSuccess} (cena)`,
          });
        } catch {
          response.push({ docID: document.id, message: responseFail });
        }
      }
    });
    await Promise.allSettled(promises);
  } else {
    response.push({ message: responseInfo });
  }

  return response;
};

const checkIfisThereDoc = (
  idDoc: string,
  collection: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  userId: string,
) => {
  let doc:
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | undefined;
  for (const document of collection.docs) {
    if (document.id === idDoc && userId && document.data().uId === userId) {
      doc = document;
    }
  }
  return doc;
};

const resolvers = {
  Query: {
    suplierData: async (
      _parent: unknown,
      args: unknown,
      context: MyContext,
    ) => {
      try {
        const result = await db.collection('Supplier').get();

        const data: Array<{
          sendCashDelivery: any;
          packInBox: any;
          supplierId: any;
          suppName: any;
          pickUp: any;
          delivery: any;
          insurance: any;
          shippingLabel: any;
          foil: any;
          package: [any];
          location: any;
        }> = [];

        result.forEach((doc) => {
          const docData = doc.data();

          data.push({
            sendCashDelivery: docData.sendCashDelivery,
            packInBox: docData.packInBox,
            supplierId: docData.supplierId,
            suppName: docData.suppName,
            pickUp: docData.pickUp,
            delivery: docData.delivery,
            insurance: docData.insurance,
            shippingLabel: docData.shippingLabel,
            foil: docData.foil,
            package: docData.package,
            location: docData.location,
          });
        });

        return data;
      } catch (error) {
        console.error('Chyba při získávání dat zásilkové služby', error);
        throw error;
      }
    },
    historyUserData: async (
      _parent: unknown,
      args: unknown,
      context: MyContext,
    ) => {
      const data: Array<{
        dataForm: any;
        historyId: string;
        suppData: any;
        userId: string;
      }> = [];
      try {
        const userData = await db
          .collection('History')
          .where('uId', '==', context.user?.uid)
          .get();

        userData.forEach((doc) => {
          const docData = doc.data();

          data.push({
            dataForm: docData.dataForm,
            historyId: docData.historyId,
            suppData: docData.suppData,
            userId: docData.uId,
          });
        });

        return data;
      } catch (error) {
        console.error('Chyba při získávání dat historie', error);
        throw error;
      }
    },
  },
  Mutation: {
    // vhodny balik resolver
    BingoSupPac: async (
      parent_: any,
      args: {
        width: number;
        weight: number;
        height: number;
        Plength: number;
        where: string;
        fromWhere: string;
        cost: number;
      },
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      const {
        width: Width,
        weight: Weight,
        height: Height,
        Plength: pLength,
        where: Where,
        fromWhere: FromWhere,
        cost: Pcost,
      } = args;

      type PackageData = {
        weight: number;
        height: number;
        width: number;
        Plength: number;
        name_package: string;
        cost: number;
        supplier_id: string;
      };

      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
          supplier_id: string;
        };
      };

      type Location = {
        depoDelivery: { delivery: string; cost: number };
        personalDelivery: { delivery: string; cost: number };
      };

      type Supplier = {
        supplierId: string;
        packInBox: string;
        shippingLabel: string;
        sendCashDelivery: string;
        foil: string;
        delivery: string;
        suppName: string;
        pickUp: string;
        insurance: number;
        package: Array<Package>;
        location: Location;
      };

      type SuppWithLocation = {
        suppId: string;
        loc: Location;
      };

      type PackageType = {
        supplierId: string;
        Cost: number;
        Name: string;
        param: {
          width: number;
          length: number;
          weight: number;
          height: number;
        };
      };

      type CostSup = {
        idS: string;
        cost: number;
      };

      type ReturnItem = {
        suppId: string;
        cost: number;
        name: string;
      };

      const packages: Array<Package> = [];
      const packData: Array<PackageData> = [];
      const rtrnItem: Array<ReturnItem> = [];

      const validargZ = ['personal', 'depo'].includes(Where);
      const validargDo = ['personal', 'depo'].includes(FromWhere);

      const suppWithLocationFiled: Array<SuppWithLocation> = [];

      try {
        const SupplierDoc = await db.collection('Supplier').get();

        if (Width === 0 || Weight === 0 || Height === 0 || pLength === 0) {
          return {
            __typename: 'ErrorMessage',
            message: 'Neplatný argument, žádné z čísel nemůže být rovno 0',
          };
        }

        if (Width < 0 || Weight < 0 || Height < 0 || pLength < 0 || Pcost < 0) {
          return {
            __typename: 'ErrorMessage',
            message:
              'Neplatný argument, žádné z čísel nemůže být záporná hodnota',
          };
        }

        if (!validargZ || !validargDo) {
          return {
            __typename: 'ErrorMessage',
            message:
              'Neplatný argument, předpokládaná hodnota (personal/depo) ',
          };
        }

        SupplierDoc.forEach((item) => {
          const suppItem = item.data() as Supplier;

          if (suppItem && suppItem.package) {
            suppItem.package.forEach((packItem: Package) => {
              packages.push(packItem);
            });
          }
          if (suppItem.location) {
            suppWithLocationFiled.push({
              suppId: suppItem.supplierId,
              loc: suppItem.location,
            });
          }
        });

        packages.forEach((packageObj) => {
          // ziskani dat z kazdeho objektu baliku
          const [packageDetails] = Object.values(packageObj);
          packData.push(packageDetails);
        });

        // vedet cenu
        const costSupp = suppWithLocationFiled.map((i) => {
          // dd
          const depo = i.loc.depoDelivery;
          const personal = i.loc.personalDelivery;
          if (depo.delivery === Where && depo.delivery === FromWhere) {
            return {
              idS: i.suppId,
              cost: 2 * depo.cost,
            };
          }
          // pd
          if (personal.delivery === Where && depo.delivery === FromWhere) {
            return {
              idS: i.suppId,
              cost: personal.cost + depo.cost,
            };
          }

          // dp
          if (depo.delivery === Where && personal.delivery === FromWhere) {
            return {
              idS: i.suppId,
              cost: depo.cost + personal.cost,
            };
          }
          // pp
          return {
            idS: i.suppId,
            cost: 2 * personal.cost,
          };
        });

        const CostOfPack = (costSup: Array<CostSup>, pack: PackageData) => {
          let sumCost = 0;
          for (const e of costSup) {
            if (pack.supplier_id === e.idS) {
              const sCost = e.cost + pack.cost;
              sumCost = sCost;
            }
          }
          return sumCost;
        };

        const IsItSuppWithLoc = (loc: Array<SuppWithLocation>, sId: string) => {
          return loc.find((itm) => {
            return itm.suppId === sId;
          });
        };

        // prilepim cenu
        const packCost = packData.map((item: PackageData) => {
          const cost = CostOfPack(costSupp, item);
          if (IsItSuppWithLoc(suppWithLocationFiled, item.supplier_id)) {
            return {
              supplierId: item.supplier_id,
              Cost: cost,
              Name: item.name_package,
              param: {
                width: item.width,
                length: item.Plength,
                weight: item.weight,
                height: item.height,
              },
            };
          }
          return {
            supplierId: item.supplier_id,
            Cost: item.cost,
            Name: item.name_package,
            param: {
              width: item.width,
              length: item.Plength,
              weight: item.weight,
              height: item.height,
            },
          };
        });

        const suitableByCost = packCost.map((item) => {
          if (Pcost >= Number(item.Cost)) {
            return item;
          }
          return undefined;
        });

        const cleared = suitableByCost.filter((itm) => itm !== undefined);

        const groupedById = _.groupBy(cleared, 'supplierId');

        const packagesDictionary: Record<string, PackageType> = {};

        const lookWhichIsBetter = (item: PackageType, item2: PackageType) => {
          let bettterPack: PackageType = {
            supplierId: '',
            Cost: 0,
            Name: '',
            param: {
              width: 0,
              length: 0,
              weight: 0,
              height: 0,
            },
          };

          if (
            item.param.width > item2.param.width &&
            item.param.weight > item2.param.weight &&
            item.param.length > item2.param.length &&
            item.param.height > item2.param.height
          ) {
            bettterPack = item2;
          }

          if (
            item.param.width < item2.param.width &&
            item.param.weight < item2.param.weight &&
            item.param.length < item2.param.length &&
            item.param.height < item2.param.height
          ) {
            bettterPack = item;
          }

          return bettterPack;
        };

        Object.entries(groupedById).forEach(([key, item]) => {
          item.forEach((itm) => {
            if (
              itm &&
              itm.param?.width <= Width &&
              itm.param?.weight <= Weight &&
              itm.param?.length <= pLength &&
              itm.param?.height <= Height
            ) {
              const prev = packagesDictionary[itm.supplierId] ?? undefined;
              // eslint-disable-next-line unicorn/prefer-ternary, unicorn/no-negated-condition

              // eslint-disable-next-line unicorn/no-negated-condition, unicorn/prefer-ternary
              if (!prev) {
                packagesDictionary[itm.supplierId] = {
                  supplierId: itm.supplierId,
                  Cost: itm.Cost,
                  Name: itm.Name,
                  param: {
                    width: itm.param.width,
                    weight: itm.param.weight,
                    height: itm.param.height,
                    length: itm.param.length,
                  },
                };
              } else {
                packagesDictionary[itm.supplierId] = lookWhichIsBetter(
                  itm,
                  prev,
                );
              }
            }
          });
        });

        Object.entries(packagesDictionary).forEach(([key, item]) => {
          rtrnItem.push({
            suppId: item.supplierId,
            cost: item.Cost,
            name: item.Name,
          });
        });

        if (rtrnItem.length > 0) {
          return {
            __typename: 'Suitable',
            suitable: JSON.stringify(rtrnItem),
          };
        }
        return {
          __typename: 'ErrorMessage',
          message: `Žádná vhodná ${constant.toLowerCase()} s vhodným balíkem`,
        };
      } catch (error) {
        console.error(
          'Chyba při výběru vhodnéhé zásilkové služby s vhodným balíkem',
          error,
        );
        throw error;
      }
    },
    // web mutation
    // create
    AddHistory: async (
      parent_: any,
      args: { uId: string; data: string },
      context: MyContext,
    ) => {
      const { uId: id, data: dataS } = args;
      type Data = {
        formData: {
          width: string;
          height: string;
          weight: string;
          plength: string;
          placeFrom: string;
          placeTo: string;
        };
        data: {
          suppData: {
            __typename: string;
            sendCashDelivery: string;
            packInBox: string;
            supplierId: string;
            suppName: string;
            pickUp: string;
            delivery: string;
            insurance: number;
            shippingLabel: string;
            foil: string;
            package: any;
            location: any;
          };
          priceS: number;
          packName: string;
        };
      };

      type HistoryDoc = {
        uId: string;
        dataForm: {
          width: string;
          placeTo: string;
          weight: string;
          placeFrom: string;
          plength: string;
          height: string;
        };
        historyId: string;
        suppData: {
          insurance: number;
          delivery: string;
          packInBox: string;
          name: string;
          pickup: string;
          shippingLabel: string;
          id: string;
          sendCashDelivery: string;
          foil: string;
          packName: string;
          cost: number;
        };
      };
      try {
        if (context.user?.uid !== id) {
          return {
            message: 'Tuto funkci může používat pouze přihlášený uživatel',
          };
        }

        const newHistoryDoc = db.collection('History').doc();
        const data = JSON.parse(dataS) as Data;

        const sData = data.data.suppData;
        const sPrice = data.data.priceS;
        const { packName } = data.data;

        const toFirestore = {
          id: sData.supplierId,
          name: sData.suppName,
          pickup: sData.pickUp,
          delivery: sData.delivery,
          insurance: sData.insurance,
          shippingLabel: sData.shippingLabel,
          sendCashDelivery: sData.sendCashDelivery,
          packInBox: sData.packInBox,
          foil: sData.foil,
          cost: sPrice,
          packName,
        };

        const newHistory = {
          uId: id,
          dataForm: data.formData,
          historyId: newHistoryDoc.id,
          suppData: toFirestore,
        };

        const dataInColl = await db.collection('History').get();

        const duplicateByParam = dataInColl.docs.map((item) => {
          const itm = item.data() as HistoryDoc;
          const userId = itm.uId;
          if (itm.suppData.id === sData.supplierId && userId === id) {
            return itm.suppData.packName === packName ? item : undefined;
          }
          return undefined;
        });

        if (
          duplicateByParam
            .map((e) => {
              return !!e;
            })
            .includes(true)
        ) {
          return {
            message: 'Bylo už uloženo do historie',
          };
        }

        await newHistoryDoc.set(newHistory);

        if (
          checkIfisThereDoc(
            newHistory.historyId,
            await db.collection('History').get(),
            id,
          )?.data()
        ) {
          return { message: 'Úspěšně uloženo' };
        }
        return {
          message: 'Při ukládání došlo k chybě, zkuste to znovu později',
        };
      } catch (error) {
        console.error('Při ukládání došlo k chybě', error);
        throw error;
      }
    },
    // eslint-disable-next-line complexity
    PackageToFirestore: async (
      parent_: any,
      args: {
        weight: number;
        cost: number;
        Plength: number;
        height: number;
        width: number;
        name_package: string;
        supplier_id: string;
        packId: string;
      },
      context: MyContext,
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      const {
        weight: weightPack,
        Plength: lengthPack,
        height: heightPack,
        cost: costPackage,
        width: widthPack,
        name_package: packName,
        supplier_id: supplierId,
        packId: ID,
      } = args;
      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
          supplier_id: string;
        };
      };

      type PackageData = {
        weight: number;
        height: number;
        width: number;
        Plength: number;
        name_package: string;
        cost: number;
      };
      if (context.user?.uid !== adminId) {
        return {
          __typename: 'PackageError',
          message: admMessage,
        };
      }

      if (
        weightPack < 0 ||
        lengthPack < 0 ||
        heightPack < 0 ||
        costPackage < 0 ||
        widthPack < 0
      ) {
        return {
          __typename: 'PackageError',
          message: 'Žádný z parametrů nesmí být záporné číslo',
        };
      }

      if (
        weightPack === 0 ||
        lengthPack === 0 ||
        heightPack === 0 ||
        costPackage === 0 ||
        widthPack === 0
      ) {
        return {
          __typename: 'PackageError',
          message: 'Žádný z parametrů nesmí být rovno 0',
        };
      }
      try {
        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', supplierId)
          .get();

        if (SupplierDoc.size === 0) {
          return {
            __typename: 'PackageError',
            message: NotFoundMsg('Balík'),
          };
        }

        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages: Array<Package> =
          supplierDoc.data().package || [];
        const dupPackages: Array<PackageData> = [];
        let dupName = '';

        const newPackage = {
          weight: weightPack,
          cost: costPackage,
          Plength: lengthPack,
          height: heightPack,
          width: widthPack,
          name_package: packName,
          supplier_id: supplierDoc.id,
        };

        const keyPack = existingPackages.map((item) => {
          const keys = Object.keys(item)[0];
          return keys.includes(ID);
        });

        existingPackages.forEach((item) => {
          // jmeno balicku
          const nameItm = Object.keys(item)[0];
          const itm = item[nameItm];
          // kontrola jmén
          if (itm.name_package === packName) {
            dupName = itm.name_package;
          }
          if (
            itm.weight === newPackage.weight &&
            itm.height === newPackage.height &&
            itm.width === newPackage.width &&
            itm.Plength === newPackage.Plength
          ) {
            dupPackages.push(itm);
          }
        });

        if (keyPack.includes(true)) {
          return {
            __typename: 'PackageError',
            message: 'Duplicitní id balíku',
          };
        }

        if (dupName.length > 0) {
          return {
            __typename: 'PackageError',
            message: 'Toto označení pužívá jíny balík',
          };
        }

        if (dupPackages.length > 0) {
          return {
            __typename: 'PackageError',
            message: 'Tyto parametry má též jiný balík',
          };
        }

        const objectPack: Package = {};

        objectPack[ID] = {
          weight: weightPack,
          cost: costPackage,
          Plength: lengthPack,
          height: heightPack,
          width: widthPack,
          name_package: packName,
          supplier_id: supplierDoc.id,
        };

        existingPackages.push(objectPack);

        await supplierDoc.ref.update({ package: existingPackages });

        return {
          __typename: 'Pack',
          data: newPackage,
        };
      } catch (error) {
        console.error('Chyba při vytváření nového balíku', error);
        throw error;
      }
    },
    SupplierToFirestore: async (
      parent_: any,
      args: {
        supplierName: string;
        delivery: string;
        shippingLabel: string;
        pickUp: string;
        foil: string;
        insurance: number;
        sendCashDelivery: string;
        packInBox: string;
        depoCost: number;
        personalCost: number;
      },
      context: MyContext,
    ) => {
      const {
        supplierName: SuppName,
        delivery: Delivery,
        shippingLabel: hasShippingLabel,
        pickUp: PickuUp,
        foil: hasFoil,
        insurance: InsuranceValue,
        sendCashDelivery: SendCashOnDelivery,
        packInBox: PackageInABox,
        depoCost: dCost,
        personalCost: pCost,
      } = args;

      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
        };
      };

      type Supplier = {
        supplierId: string;
        packInBox: string;
        shippingLabel: string;
        sendCashDelivery: string;
        foil: string;
        delivery: string;
        suppName: string;
        pickUp: string;
        insurance: number;
        package: Array<Package>;
        location: Location;
      };

      try {
        const namesOfSup: Array<string> = [];
        if (context.user?.uid !== adminId) {
          return {
            __typename: 'SupplierError',
            message: admMessage,
          };
        }

        const SuppDocument = await db.collection('Supplier').get();

        SuppDocument.forEach((data) => {
          const item = data.data() as Supplier;
          namesOfSup.push(item.suppName);
        });

        if (
          namesOfSup.some(
            (name: string) => name.toLowerCase() === SuppName.toLowerCase(),
          )
        ) {
          return {
            __typename: 'SupplierError',
            message: `Toto jméno používá jiná ${constant.toLowerCase()}`,
          };
        }

        if (!isValid(new Date(Delivery))) {
          return {
            __typename: 'SupplierError',
            message: 'Datum dodání není platné',
          };
        }

        if (!isValid(new Date(PickuUp))) {
          return {
            __typename: 'SupplierError',
            message: 'Datum vyzvednutí není platné',
          };
        }

        if (
          ConverBool(
            hasFoil,
            hasShippingLabel,
            SendCashOnDelivery,
            PackageInABox,
          ) === true
        ) {
          return {
            __typename: 'SupplierError',
            message: 'Poskytnutá data nejsou v platném formátu (Ano/Ne)',
          };
        }

        if (InsuranceValue < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Pojištění nesmí být záporné číslo',
          };
        }

        if (dCost < 0 || pCost < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Ceny za doručení/vyzvednutí nesmí být záporná čísla',
          };
        }

        if (new Date(PickuUp) < new Date(Delivery)) {
          return {
            __typename: 'SupplierError',
            message: 'Datum vyzvednutí nemůže být dřív než datum doručení',
          };
        }

        const newSuppDoc = db.collection('Supplier').doc();

        const location = {
          depoDelivery: { cost: dCost, delivery: 'depo' },
          personalDelivery: { cost: pCost, delivery: 'personal' },
        };

        const newSupp = {
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          supplierId: newSuppDoc.id,
          suppName: SuppName,
          pickUp: PickuUp,
          delivery: Delivery,
          insurance: InsuranceValue,
          shippingLabel: hasShippingLabel,
          foil: hasFoil,
          location,
        };

        await newSuppDoc.set(newSupp);

        return {
          __typename: 'Supp',
          data: newSupp,
        };
      } catch (error) {
        console.error('Chyba při vytváření zásilkové služby', error);
        throw error;
      }
    },
    // update
    // eslint-disable-next-line complexity
    updatePack: async (
      parent_: any,
      args: {
        weight: number;
        cost: number;
        Plength: number;
        height: number;
        width: number;
        name_package: string;
        supplier_id: string;
        PackKey: string;
      },
      context: MyContext,
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      const {
        PackKey: id,
        weight: weightPack,
        Plength: lengthPack,
        height: heightPack,
        cost: costPackage,
        width: widthPack,
        name_package: packName,
        supplier_id: supplierId,
      } = args;

      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
          supplier_id: string;
        };
      };

      type PackageData = {
        weight: number;
        height: number;
        width: number;
        Plength: number;
        name_package: string;
        cost: number;
      };

      try {
        if (context.user?.uid !== adminId) {
          return {
            __typename: 'PackageUpdateError',
            message: admMessage,
          };
        }
        if (
          weightPack < 0 ||
          lengthPack < 0 ||
          heightPack < 0 ||
          costPackage < 0 ||
          widthPack < 0
        ) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Žádný z parametrů nesmí být záporné číslo',
          };
        }

        if (
          weightPack === 0 ||
          lengthPack === 0 ||
          heightPack === 0 ||
          costPackage === 0 ||
          widthPack === 0
        ) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Žádný z parametrů nesmí být rovno 0',
          };
        }

        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', supplierId)
          .get();

        if (SupplierDoc.size === 0) {
          return {
            __typename: 'PackageUpdateError',
            message: NotFoundMsg('Balík'),
          };
        }

        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages: Array<Package> | [] =
          supplierDoc.data().package || [];
        const dupPackages: Array<PackageData> = [];
        let dupName = '';

        const UpdatePackage = {
          weight: weightPack,
          cost: costPackage,
          Plength: lengthPack,
          height: heightPack,
          width: widthPack,
          name_package: packName,
          supplier_id: supplierDoc.id,
        };

        existingPackages
          .filter((item) => {
            return !item[id];
          })
          .forEach((item) => {
            // jmeno balicku
            const nameItm = Object.keys(item)[0];
            const itm = item[nameItm];
            // kontrola jmén
            if (itm.name_package === packName) {
              dupName = itm.name_package;
            }
            if (
              itm.weight === UpdatePackage.weight &&
              itm.height === UpdatePackage.height &&
              itm.width === UpdatePackage.width &&
              itm.Plength === UpdatePackage.Plength
            ) {
              dupPackages.push(itm);
            }
          });

        if (dupName.length > 0) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Toto označení pužívá jíny balík',
          };
        }

        if (dupPackages.length > 0) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Tyto parametry má též jiný balík',
          };
        }

        for (const pack of existingPackages) {
          // eslint-disable-next-line max-depth
          if (pack[id]) {
            pack[id].weight = weightPack;
            pack[id].cost = costPackage;
            pack[id].Plength = lengthPack;
            pack[id].height = heightPack;
            pack[id].width = widthPack;
            pack[id].name_package = packName;
          }
        }

        await supplierDoc.ref.update({ package: existingPackages });
        if (SupplierDoc.docChanges() && SupplierDoc.docChanges().length > 0) {
          return {
            __typename: 'UPack',
            data: UpdatePackage,
          };
        }

        return {
          __typename: 'PackageUpdateError',
          message: 'Úprava blíku nebyla úspěšná',
        };
      } catch (error) {
        console.error('Chyba při úpravě balíku', error);
        throw error;
      }
    },
    updateSup: async (
      parent_: any,
      args: {
        supplierName: string;
        delivery: string;
        shippingLabel: string;
        pickUp: string;
        foil: string;
        insurance: number;
        sendCashDelivery: string;
        packInBox: string;
        suppId: string;
        oldNameSupp: string;
        depoCost: number;
        personalCost: number;
      },
      context: MyContext,
    ) => {
      const {
        supplierName: SuppName,
        delivery: Delivery,
        shippingLabel: hasShippingLabel,
        pickUp: PickuUp,
        foil: hasFoil,
        insurance: InsuranceValue,
        sendCashDelivery: SendCashOnDelivery,
        packInBox: PackageInABox,
        suppId: id,
        oldNameSupp: oldName,
        depoCost: dCost,
        personalCost: pCost,
      } = args;

      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
          supplier_id: string;
        };
      };

      type Supplier = {
        supplierId: string;
        packInBox: string;
        shippingLabel: string;
        sendCashDelivery: string;
        foil: string;
        delivery: string;
        suppName: string;
        pickUp: string;
        insurance: number;
        package: Array<Package>;
        location: Location;
      };

      try {
        if (context.user?.uid !== adminId) {
          return {
            __typename: 'SupplierError',
            message: admMessage,
          };
        }

        if (!isValid(new Date(Delivery))) {
          return {
            __typename: 'SupplierError',
            message: 'Datum dodání není platné',
          };
        }

        if (!isValid(new Date(PickuUp))) {
          return {
            __typename: 'SupplierError',
            message: 'Datum vyzvednutí není platné',
          };
        }

        if (
          ConverBool(
            hasFoil,
            hasShippingLabel,
            SendCashOnDelivery,
            PackageInABox,
          ) === true
        ) {
          return {
            __typename: 'SupplierError',
            message: 'Poskytnutá data nejsou v platném formátu (Ano/Ne)',
          };
        }

        const Supd = await db
          .collection('Supplier')
          .where('supplierId', '==', id)
          .get();

        if (Supd.size === 0) {
          return {
            __typename: 'SupplierError',
            message: NotFoundMsg(constant),
          };
        }

        const SupplierDoc = await db.collection('Supplier').get();

        const docs = SupplierDoc.docs.map((doc) => doc.data() as Supplier);

        const docsWithoutCurrentSupp = docs.filter(
          (doc) => doc.suppName !== oldName,
        );

        const duplicateSupp = docsWithoutCurrentSupp.find(
          (item) => item.suppName.toLowerCase() === SuppName.toLowerCase(),
        );

        if (duplicateSupp) {
          return {
            __typename: 'SupplierError',
            message: `Toto jméno používá jiná ${constant.toLowerCase()}`,
          };
        }

        if (new Date(PickuUp) < new Date(Delivery)) {
          return {
            __typename: 'SupplierError',
            message: 'Datum vyzvednutí nemůže být dřívější než datum doručení',
          };
        }

        if (InsuranceValue < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Pojištění nesmí být menší než nula',
          };
        }

        const location = {
          depoDelivery: { cost: dCost, delivery: 'depo' },
          personalDelivery: { cost: pCost, delivery: 'personal' },
        };

        await Supd.docs[0].ref.update({
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          suppName: SuppName,
          pickUp: PickuUp,
          delivery: Delivery,
          insurance: InsuranceValue,
          shippingLabel: hasShippingLabel,
          foil: hasFoil,
          location,
        });

        const newSupp = {
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          suppName: SuppName,
          pickUp: PickuUp,
          delivery: Delivery,
          insurance: InsuranceValue,
          shippingLabel: hasShippingLabel,
          foil: hasFoil,
          supplierId: id,
        };

        if (Supd.docChanges() && Supd.docChanges().length > 0) {
          return {
            __typename: 'Supp',
            data: newSupp,
          };
        }

        return {
          __typename: 'SupplierError',
          message: 'Úprava nebyla úspěšná',
        };
      } catch (error) {
        console.error('Chyba při úpravě zásilkové služby', error);
        throw error;
      }
    },
    updateHistory: async (
      parent_: any,
      args: {
        newPricePack: number;
        newPricePersonal: number;
        newPriceDepo: number;
        suppId: string;
        packName: string;
        oldPackName: string;
        suppData: DataUpdateSupp;
        oldSuppName: string;
      },
      context: MyContext,
      // eslint-disable-next-line sonarjs/cognitive-complexity, consistent-return
    ) => {
      type Supplier = {
        sendCashDelivery: string;
        packInBox: string;
        supplierId: string;
        suppName: string;
        pickUp: string;
        delivery: string;
        insurance: number;
        shippingLabel: string;
        foil: string;
        package?: any | undefined;
        location?: any | undefined;
      };

      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
        };
      };

      const {
        newPricePack: nPricrePack,
        newPricePersonal: nPriceP,
        newPriceDepo: nPriceDepo,
        suppId: sId,
        packName: nameOfpack,
        oldPackName: oldNameOfpack,
        suppData: dataS,
        oldSuppName: oldSName,
      } = args;
      type Response = {
        docID?: string;
        message: string;
      };

      try {
        let response: Array<Response> = [];
        let msg = '';
        const getDocsPack = (
          doc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
          sID: string,
          packageName: string,
        ) => {
          const docs: Array<
            FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
          > = [];
          for (const document of doc.docs) {
            const item = document.data();
            if (
              item.suppData.id === sID &&
              item.suppData.packName === packageName
            ) {
              docs.push(document);
            }
          }
          return docs;
        };

        const getDocSupp = (
          doc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
          sID: string,
          suppName: string,
        ) => {
          const docs: Array<
            FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
          > = [];
          for (const document of doc.docs) {
            const item = document.data();
            if (item.suppData.id === sID && item.suppData.name === suppName) {
              docs.push(document);
            }
          }
          return docs;
        };

        if (context.user?.uid !== adminId) {
          return {
            __typename: 'HistoryMessage',
            message: admMessage,
          };
        }

        const SuppDocuments = await db
          .collection('Supplier')
          .where('supplierId', '==', sId)
          .get();

        const historyDocuments = await db
          .collection('History')
          // eslint-disable-next-line sonarjs/no-duplicate-string
          .where('suppData.id', '==', sId)
          .get();

        if (nPriceP && nPriceDepo && dataS && sId && oldSName) {
          const historyDoc = getDocSupp(historyDocuments, sId, oldSName);
          const packages: Array<{
            cost: number;
            namePack: string;
            suppName: string;
          }> = [];

          SuppDocuments.forEach((doc) => {
            const document = doc.data() as Supplier;
            if (document.package) {
              const pack = document.package as Array<Package>;
              pack.forEach((packData) => {
                Object.keys(packData).forEach((key) => {
                  packages.push({
                    cost: packData[key].cost,
                    namePack: packData[key].name_package,
                    suppName: document.suppName,
                  });
                });
              });
            }
          });

          response = await doMathForOptionsDelivery(
            packages,
            nPriceDepo,
            nPriceP,
            historyDoc,
            dataS,
          );
          msg =
            response.length === 2 && /(cena)/.test(response[1].message)
              ? 'Úprava historie a cen v historii uživatelům byla úspěšná'
              : response.map((msgr) => msgr.message)[0].toString();
        }

        if (nPricrePack && nameOfpack && sId && oldNameOfpack) {
          const historyDoc = getDocsPack(historyDocuments, sId, oldNameOfpack);

          msg = await doMathForPackage(
            SuppDocuments,
            nPricrePack,
            historyDoc,
            nameOfpack,
          );
        }

        return { message: msg };
      } catch (error) {
        console.error('Chyba při úpravě historie', error);
        throw error;
      }
    },
    // delete
    deletePack: async (
      parent_: any,
      args: { key: string; suppId: string },
      context: MyContext,
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      type Package = {
        [name: string]: {
          weight: number;
          height: number;
          width: number;
          Plength: number;
          name_package: string;
          cost: number;
          supplier_id: string;
        };
      };
      const { key: Pack, suppId: Sid } = args;
      let deleted = false;
      let err = '';
      let find = false;
      let newArray: Array<Package> = [];

      if (context.user?.uid !== adminId) {
        err = admMessage;
        deleted = false;
        return { deletion: deleted, error: err };
      }

      try {
        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', Sid)
          .get();
        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages: Array<Package> =
          supplierDoc.data().package || [];

        const GetPackName = (
          id: string,
          packages: Array<Package>,
        ): string | undefined => {
          for (const pack of packages) {
            if (pack[id]) {
              return pack[id].name_package;
            }
          }
          return undefined;
        };

        const HistoryDoc = await db
          .collection('History')
          .where('suppData.id', '==', Sid)
          .where('suppData.packName', '==', GetPackName(Pack, existingPackages))
          .get();

        const historyDoc = HistoryDoc.docs[0];

        if (SupplierDoc.empty) {
          err = NotFoundMsg(constant);
        } else {
          // eslint-disable-next-line max-depth
          if (existingPackages) {
            newArray = existingPackages.filter((item) => !item[Pack]);
            find = Boolean(existingPackages.filter((item) => !item[Pack]));
          } else {
            err = 'Nic k mazání';
          }
          // eslint-disable-next-line max-depth
          if (find) {
            await supplierDoc.ref.update({ package: newArray });
            deleted = true;
          } else {
            err = NotFoundMsg('Balík');
          }
          // eslint-disable-next-line max-depth
          if (historyDoc) {
            await historyDoc.ref.delete();
          }
        }
        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Chyba při mazání balíku', error);
        throw error;
      }
    },
    deleteSupp: async (
      parent_: any,
      args: { id: Array<string> },
      context: MyContext,
      // eslint-disable-next-line @typescript-eslint/require-await
    ) => {
      let deleted = false;
      let err = '';
      let docId = '';
      if (context.user?.uid !== adminId) {
        err = admMessage;
        deleted = false;
        return { deletion: deleted, error: err };
      }
      const { id: SupIdar } = args;

      try {
        const collection = db.collection('Supplier');
        const collectionHistory = db.collection('History');
        const promises = SupIdar.map(async (Idsup) => {
          const snapshot = await collection
            .where('supplierId', '==', Idsup)
            .get();
          const snapshotHistory = await collectionHistory
            .where('suppData.id', '==', Idsup)
            .get();

          if (!snapshot.empty) {
            await snapshot.docs[0].ref.delete();
            deleted = true;
            docId = snapshot.docs[0].id;
          }
          if (!snapshotHistory.empty) {
            await snapshotHistory.docs[0].ref.delete();
          }
        });

        await Promise.allSettled(promises);
        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Chyba při mazání zásilkové služby', error);
        throw error;
      }
    },
    deleteHistoryItem: async (
      parent_: any,
      args: { id: string },
      context: MyContext,
    ) => {
      const { id: historyId } = args;
      let deleted = false;
      let err = '';
      if (!context.user?.uid) {
        err = admMessage;
        deleted = false;
        return { deletion: deleted, error: context.user?.uid };
      }

      try {
        const collection = db.collection('History');
        const snapshot = await collection
          .where('uId', '==', context.user?.uid)
          .where('historyId', '==', historyId)
          .get();
        if (snapshot.empty) {
          return { deletion: false, error: 'Nebyl nalezen' };
        }
        await snapshot.docs[0].ref.delete();
        deleted = true;

        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Chyba při mazání záznamu z historie', error);
        throw error;
      }
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};
// eslint-disable-next-line import/no-default-export
export default createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  context: async (context) => {
    const auth = context.request.headers.get('authorization');
    return {
      user: auth ? await verifyToken(auth) : undefined,
    } as Context;
  },
});
