// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-duplicate-string */
import 'firebase/compat/storage';

import { Context } from '@apollo/client';
import { isValid } from 'date-fns';
import { DecodedIdToken } from 'firebase-admin/auth';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import {
  DataChoosedSupp,
  DataUpdateSupp,
  HistoryDocument,
  Location,
  Package,
  PackageType,
  Response,
  SupplierInformation,
} from '@/copmonents/types/types';
import {
  CheckIfisThereDoc,
  FindSameParamsPack,
  GetCost,
  GetDocsPack,
  GetDocSupp,
  GetPackName,
  IsInGoodForm,
} from '@/utility/uthils';
import {
  LookWhichIsBetter,
  ResultSuitable,
  ServeData,
} from '@/utility/uthils-main-func';

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

const MathForPackage = async (
  data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  nPriceP: number,
  historyDoc: Array<
    FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  >,
  nameOfPack: string,
): Promise<string> => {
  let msg = '';

  let sum = 0;

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

const MathForOptionsDelivery = async (
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
) => {
  const sum = nPriceDepo + nPriceP;
  const response: Array<Response> = [];

  if (historyDoc.length > 0) {
    const promises = historyDoc.map(async (document) => {
      const dataDoc = document.data() as HistoryDocument;
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
              GetCost(
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

const resolvers = {
  Query: {
    suplierData: async (
      _parent: unknown,
      _args: unknown,
      _context: MyContext,
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
      _args: unknown,
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

      try {
        if (Width < 0 || Weight < 0 || Height < 0 || pLength < 0 || Pcost < 0) {
          return {
            __typename: 'ErrorMessage',
            message: 'Neplatný argument, žádné z čísel nemůže být záporná',
          };
        }

        if (
          !['personal', 'depo'].includes(Where) ||
          !['personal', 'depo'].includes(FromWhere)
        ) {
          return {
            __typename: 'ErrorMessage',
            message:
              'Neplatný argument, předpokládaná hodnota (personal/depo) ',
          };
        }

        const groupedById = ServeData(
          await db.collection('Supplier').get(),
          {
            where: Where,
            fromWhere: FromWhere,
          },
          Pcost,
          { weight: Weight, width: Width, height: Height, pLength },
        );

        // pocud pripravit data a v připadě max package vyhodit error
        if (groupedById.msg) {
          return groupedById.msg;
        }

        const packagesDictionary: Record<string, PackageType> = {};

        groupedById.data.forEach(([, item]) => {
          item.forEach((itm) => {
            if (
              itm &&
              itm.param?.width >= Width &&
              itm.param?.weight >= Weight &&
              itm.param?.length >= pLength &&
              itm.param?.height >= Height
            ) {
              const prev = packagesDictionary[itm.supplierId] ?? undefined;

              packagesDictionary[itm.supplierId] = prev
                ? LookWhichIsBetter(itm, prev)
                : {
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
            }
          });
        });

        return ResultSuitable(packagesDictionary, constant);
      } catch (error) {
        console.error(
          'Chyba při výběru vhodné zásilkové služby s vhodným balíkem',
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

      try {
        if (context.user?.uid !== id) {
          return {
            message: 'Tuto funkci může používat pouze přihlášený uživatel',
          };
        }

        const newHistoryDoc = db.collection('History').doc();
        const data = JSON.parse(dataS) as DataChoosedSupp;

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
          const itm = item.data() as HistoryDocument;
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
          CheckIfisThereDoc(
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

      if (context.user?.uid !== adminId) {
        return {
          __typename: 'PackageError',
          message: admMessage,
        };
      }

      if (
        weightPack <= 0 ||
        lengthPack <= 0 ||
        heightPack <= 0 ||
        costPackage <= 0 ||
        widthPack <= 0
      ) {
        return {
          __typename: 'PackageError',
          message: 'Žádný z parametrů nesmí být záporné číslo nebo rovné nule',
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

        const existingPackages: Array<Package> =
          SupplierDoc.docs[0].data().package || [];

        const newPackage = {
          weight: weightPack,
          cost: costPackage,
          Plength: lengthPack,
          height: heightPack,
          width: widthPack,
          name_package: packName,
          supplier_id: SupplierDoc.docs[0].id,
        };

        const keyPack = existingPackages.map((item) => {
          const keys = Object.keys(item)[0];
          return keys.includes(ID);
        });

        const duplicateData = FindSameParamsPack(
          existingPackages.filter((item) => {
            return !item[ID];
          }),
          {
            weight: newPackage.weight,
            width: newPackage.width,
            length: newPackage.Plength,
            height: newPackage.height,
            packName: newPackage.name_package,
          },
        );

        if (duplicateData.name) {
          return {
            __typename: 'PackageError',
            message: 'Toto označení pužívá jíny balík',
          };
        }

        if (duplicateData.params) {
          return {
            __typename: 'PackageError',
            message: 'Tyto parametry má též jiný balík',
          };
        }

        if (keyPack.includes(true)) {
          return {
            __typename: 'PackageError',
            message: 'Duplicitní id balíku',
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
          supplier_id: SupplierDoc.docs[0].id,
        };

        existingPackages.push(objectPack);

        await SupplierDoc.docs[0].ref.update({ package: existingPackages });

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
          const item = data.data() as SupplierInformation;
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
          !IsInGoodForm(
            hasFoil,
            hasShippingLabel,
            SendCashOnDelivery,
            PackageInABox,
          )
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

      try {
        if (context.user?.uid !== adminId) {
          return {
            __typename: 'PackageUpdateError',
            message: admMessage,
          };
        }
        if (
          weightPack <= 0 ||
          lengthPack <= 0 ||
          heightPack <= 0 ||
          costPackage <= 0 ||
          widthPack <= 0
        ) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Žádný z parametrů nesmí být záporné číslo ne rovné nule',
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

        const existingPackages: Array<Package> =
          SupplierDoc.docs[0].data().package || [];

        const UpdatePackage = {
          weight: weightPack,
          cost: costPackage,
          Plength: lengthPack,
          height: heightPack,
          width: widthPack,
          name_package: packName,
          supplier_id: SupplierDoc.docs[0].id,
        };

        const duplicateData = FindSameParamsPack(
          existingPackages.filter((item) => {
            return !item[id];
          }),
          {
            weight: UpdatePackage.weight,
            width: UpdatePackage.width,
            length: UpdatePackage.Plength,
            height: UpdatePackage.height,
            packName: UpdatePackage.name_package,
          },
        );

        if (duplicateData.name) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Toto označení pužívá jíny balík',
          };
        }

        if (duplicateData.params) {
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

        await SupplierDoc.docs[0].ref.update({ package: existingPackages });
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

      try {
        if (context.user?.uid !== adminId) {
          return {
            __typename: 'SupplierError',
            message: admMessage,
          };
        }

        if (InsuranceValue < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Pojištění nesmí být menší než nula',
          };
        }

        if (dCost < 0 || pCost < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Ceny za doručení/vyzvednutí nesmí být záporná čísla',
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

        if (new Date(PickuUp) < new Date(Delivery)) {
          return {
            __typename: 'SupplierError',
            message: 'Datum vyzvednutí nemůže být dřívější než datum doručení',
          };
        }

        if (
          !IsInGoodForm(
            hasFoil,
            hasShippingLabel,
            SendCashOnDelivery,
            PackageInABox,
          )
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

        const docs = SupplierDoc.docs.map(
          (doc) => doc.data() as SupplierInformation,
        );

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
    ) => {
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
          .where('suppData.id', '==', sId)
          .get();

        if (
          nPriceP !== undefined &&
          nPriceDepo !== undefined &&
          dataS &&
          sId &&
          oldSName
        ) {
          const historyDoc = GetDocSupp(historyDocuments, sId, oldSName);
          const packages: Array<{
            cost: number;
            namePack: string;
            suppName: string;
          }> = [];

          SuppDocuments.forEach((doc) => {
            const document = doc.data() as SupplierInformation;
            if (document.package) {
              const pack = document.package;
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

          response = await MathForOptionsDelivery(
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

        if (
          nPricrePack !== undefined &&
          nameOfpack !== undefined &&
          sId &&
          oldNameOfpack
        ) {
          const historyDoc = GetDocsPack(historyDocuments, sId, oldNameOfpack);

          msg = await MathForPackage(
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
    ) => {
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
    ) => {
      let deleted = false;
      let err = '';
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
