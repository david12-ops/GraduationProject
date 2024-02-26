import 'firebase/compat/storage';

import { Context } from '@apollo/client';
import { DecodedIdToken } from 'firebase-admin/auth';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';
import _ from 'lodash';

import { firestore } from '../../firebase/firebase-admin-config';
import { verifyToken } from './verify_token';

type MyContext = { user?: DecodedIdToken };
const admMessage = 'Only admin can use this function';
const NotFoundMsg = (headerOfMsg: string) => {
  return `${headerOfMsg} not found.`;
};

const typeDefs = gql`
  type Query {
    packageData: [QueryPackD!]!
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

  type QueryPackD {
    Pkam: String!
    Podkud: String!
    costPackage: Int!
    delka: Int!
    hmotnost: Int!
    kam: String!
    odkud: String!
    packName: String!
    packgeId: String!
    sirka: Int!
    vyska: Int!
    supplierId: String!
  }

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

// validave jako uthils
// const NoHtmlSpecialChars = (ustring: any) => {
//   // zakladni - mozne pouziti cheerio or htmlparser2
//   // const htmlRegex = /<[^>]*>$/;
//   const option = /<[^>]*>/
//   let error = "";
//   if (option.test(ustring)) {
//     error = 'HTML code is not supported';
//   }
//   return error;
// }

// validace pro supplier
const ConverBool = (
  stringnU1: string,
  stringnU2: string,
  stringnU3: string,
  stringnU4: string,
) => {
  console.log(stringnU1);
  console.log(stringnU2);
  console.log(stringnU3);
  console.log(stringnU4);

  if (!['Ano', 'Ne'].includes(stringnU1)) {
    console.log('co kontroliujeme1?', stringnU1);
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU2)) {
    console.log('co kontroliujeme2?', stringnU2);
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU3)) {
    console.log('co kontroliujeme3?', stringnU3);
    return true;
  }
  if (!['Ano', 'Ne'].includes(stringnU4)) {
    console.log('co kontroliujeme4?', stringnU4);
    return true;
  }
  return false;
};

const ConverDate = (dateU1: string, dateU2: string) => {
  console.log(dateU1);
  // eslint-disable-next-line unicorn/better-regex
  const option = /^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$/;
  if (!option.test(dateU1) || !option.test(dateU2)) {
    return new Error('Invalid argument of date');
  }

  const dateParts = dateU1.split('-');
  const DateParts2 = dateU2.split('-');
  const middleNumber = Number.parseInt(dateParts[1], 10);
  const middleNumber2 = Number.parseInt(DateParts2[1], 10);
  if (
    middleNumber > 12 ||
    middleNumber2 > 12 ||
    Number.parseInt(dateParts[2], 10) > 32 ||
    Number.parseInt(DateParts2[2], 10) > 32
  ) {
    return new Error('Invalid argument of month in date or day');
  }
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
  historyDoc:
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | undefined,
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

  data.forEach((item) => {
    const loc: Location = item.data().location;
    console.log('loc', loc.depoDelivery.cost, loc.personalDelivery.cost);
    console.log('metida', sum);
    sum =
      nPriceP +
      Number(loc.depoDelivery.cost) +
      Number(loc.personalDelivery.cost);
    console.log('cena i s zpusobem dopravy', sum);
  });

  if (historyDoc) {
    const historyDocumentRef = historyDoc.ref;
    // pozor!!!
    if (nameOfPack === historyDoc.data().suppData.packName) {
      await historyDocumentRef.update(
        new firestore.FieldPath('suppData', 'cost'),
        sum,
      );
    }
    await historyDocumentRef.update(
      new firestore.FieldPath('suppData', 'cost'),
      sum,
      new firestore.FieldPath('suppData', 'packName'),
      nameOfPack,
    );
    msg = 'Update in history';
  } else {
    msg = 'Nothing to update';
    return msg;
  }

  return msg;
};

const doMatchForOptionsDelivery = async (
  data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  nPriceDepo: number,
  nPriceP: number,
  historyDoc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
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

  type PackInfo = {
    cost: number;
    namePack: string;
  };

  type DifferentData = {
    delivery: string | null;
    foil: string | null;
    insurance: number | null;
    packInBox: string | null;
    pickUp: string | null;
    sendCashDelivery: string | null;
    shippingLabel: string | null;
    suppName: string | null;
  };

  const namesPack: Array<string> = [];
  let pack: Array<Package> = [];
  const packInfo: Array<PackInfo> = [];
  const sum = nPriceDepo + nPriceP;
  const historyIds: Array<string> = [];
  let msg = '';

  const getCostByName = (
    dataPack: Array<PackInfo>,
    namePack: string,
  ): number | undefined => {
    let cost: number | undefined;
    dataPack.forEach((pacInf: PackInfo) => {
      if (pacInf.namePack === namePack) {
        cost = pacInf.cost;
      }
    });

    return cost;
  };

  const diffData = (
    newDataSupp: DataUpdateSupp,
    docDataSupp: DataUpdateSupp,
  ): DifferentData => {
    return {
      delivery:
        newDataSupp.delivery === docDataSupp.delivery
          ? null
          : newDataSupp.delivery,
      foil: newDataSupp.foil === docDataSupp.foil ? null : newDataSupp.foil,
      insurance:
        newDataSupp.insurance === docDataSupp.insurance
          ? null
          : newDataSupp.insurance,
      packInBox:
        newDataSupp.packInBox === docDataSupp.packInBox
          ? null
          : newDataSupp.packInBox,
      pickUp:
        newDataSupp.pickUp === docDataSupp.pickUp ? null : newDataSupp.pickUp,
      sendCashDelivery:
        newDataSupp.sendCashDelivery === docDataSupp.sendCashDelivery
          ? null
          : newDataSupp.sendCashDelivery,
      shippingLabel:
        newDataSupp.shippingLabel === docDataSupp.shippingLabel
          ? null
          : newDataSupp.shippingLabel,
      suppName:
        newDataSupp.suppName === docDataSupp.suppName
          ? null
          : newDataSupp.suppName,
    };
  };

  const updateDataSupp = async (
    document: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
    dataSupp: DifferentData,
  ) => {
    const dataS = dataSupp;
    if (dataS.delivery !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'delivery'),
        dataS.delivery,
      );
    }
    if (dataS.pickUp !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'pickup'),
        dataS.pickUp,
      );
    }
    if (dataS.foil !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'foil'),
        dataS.foil,
      );
    }
    if (dataS.insurance !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'insurance'),
        dataS.insurance,
      );
    }
    if (dataS.packInBox !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'packInBox'),
        dataS.packInBox,
      );
    }
    if (dataS.sendCashDelivery !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'sendCashDelivery'),
        dataS.sendCashDelivery,
      );
    }
    if (dataS.shippingLabel !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'shippingLabel'),
        dataS.shippingLabel,
      );
    }
    if (dataS.suppName !== null) {
      await document.ref.update(
        new firestore.FieldPath('suppData', 'name'),
        dataS.suppName,
      );
    }
  };

  const isNameInArr = (
    name: string,
    packInf: Array<PackInfo>,
  ): PackInfo | undefined => {
    const isThere = packInf.find((pck) => pck.namePack === name);
    if (isThere) {
      return isThere;
    }

    return undefined;
  };

  historyDoc.forEach((doc) => {
    const item = doc.data() as HistoryDoc;
    namesPack.push(item.suppData.packName);
  });

  console.log('pack names', namesPack);

  data.forEach((item) => {
    console.log('option delivery', item.data());
    const packages = item.data().package;
    pack = packages;
  });

  // balicky

  pack.forEach((itmPack: Package) => {
    const key = Object.keys(itmPack)[0];
    const packItm = itmPack[key];
    if (namesPack.includes(packItm.name_package)) {
      packInfo.push({ cost: packItm.cost, namePack: packItm.name_package });
    }
  });

  console.log('packinfo', packInfo);
  console.log('pack', pack);

  // Dokument

  historyDoc.forEach((doc) => {
    const item = doc.data() as HistoryDoc;
    packInfo.forEach((itm: PackInfo) => {
      if (item.suppData.packName === itm.namePack) {
        historyIds.push(item.historyId);
      }
    });
  });

  console.log('history id', historyIds);

  const historyQuerySnapshot = await db.collection('History').get();

  if (historyQuerySnapshot) {
    historyQuerySnapshot.forEach((document) => {
      const dataDoc = document.data() as HistoryDoc;
      historyIds.forEach(async (id) => {
        if (
          document.id === id &&
          isNameInArr(dataDoc.suppData.packName, packInfo)
        ) {
          const costPack = getCostByName(packInfo, dataDoc.suppData.packName);

          if (costPack) {
            await document.ref.update(
              new firestore.FieldPath('suppData', 'cost'),
              sum + costPack,
            );
          }
          if (supplierData) {
            await updateDataSupp(
              document,
              diffData(supplierData, {
                delivery: dataDoc.suppData.delivery,
                foil: dataDoc.suppData.foil,
                insurance: dataDoc.suppData.insurance,
                packInBox: dataDoc.suppData.packInBox,
                pickUp: dataDoc.suppData.pickup,
                sendCashDelivery: dataDoc.suppData.sendCashDelivery,
                shippingLabel: dataDoc.suppData.shippingLabel,
                suppName: dataDoc.suppData.name,
                supplierId: '',
              }),
            );
          }
        }
      });
    });
  }

  if (
    historyQuerySnapshot.docChanges() &&
    historyQuerySnapshot.docChanges().length > 0
  ) {
    msg = 'Users history updated successfully';
    return msg;
  }

  // msg = 'Users history not updated successfully';

  console.log('message', msg);
  return msg;
};

const resolvers = {
  Query: {
    packageData: async (_context: Context) => {
      try {
        const result = await db.collection('Package').get();

        const data: Array<{
          Pkam: any;
          Podkud: any;
          costPackage: any;
          delka: any;
          hmotnost: any;
          kam: any;
          odkud: any;
          packName: any;
          packgeId: any;
          sirka: any;
          vyska: any;
          supplierId: any;
        }> = [];

        result.forEach((doc) => {
          const docData = doc.data();

          data.push({
            Pkam: docData.where_PSC,
            Podkud: docData.fromWhere_PSC,
            costPackage: docData.cost,
            delka: docData.Plength,
            hmotnost: docData.weight,
            kam: docData.where_address,
            odkud: docData.fromWhere_address,
            packName: docData.name_package,
            packgeId: docData.packgeId,
            sirka: docData.width,
            vyska: docData.weight,
            supplierId: docData.supplier_id,
          });
        });
        console.log('package data', data.values());
        return data;
      } catch (error) {
        console.error('Error while getting package data', error);
        throw error;
      }
    },
    suplierData: async (_context: Context) => {
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

        console.log(
          'data supplier package',
          data.map((item) => JSON.stringify(item.package)),
        );

        return data;
      } catch (error) {
        console.error('Error while getting supplier data', error);
        throw error;
      }
    },
    historyUserData: async (
      parent_: unknown,
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
        console.error('Error while getting history data', error);
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

        console.log('id?', Width, Weight, Height, pLength);

        if (Width === 0 || Weight === 0 || Height === 0 || pLength === 0) {
          return {
            __typename: 'ErrorMessage',
            message: 'Ivalid argument, any argument cant be 0',
          };
        }

        if (Width < 0 || Weight < 0 || Height < 0 || pLength < 0 || Pcost < 0) {
          return {
            __typename: 'ErrorMessage',
            message: 'Ivalid argument, any argument cant be less then 0',
          };
        }

        if (!validargZ || !validargDo) {
          return {
            __typename: 'ErrorMessage',
            message: 'Ivalid argument, expexted (personal/depo)',
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
            console.log('itm with location', suppWithLocationFiled);
          }
        });

        packages.forEach((packageObj) => {
          // Extracting the values from each package object
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
                width: item.weight,
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
              width: item.weight,
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
            item.param.width > item2.param.width ||
            item.param.weight > item2.param.weight ||
            item.param.length > item2.param.length ||
            item.param.height > item2.param.height
          ) {
            bettterPack = item2;
          }

          if (
            item.param.width < item2.param.width ||
            item.param.weight < item2.param.weight ||
            item.param.length < item2.param.length ||
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
              itm.param?.width >= Width &&
              itm.param?.weight >= Weight &&
              itm.param?.length >= pLength &&
              itm.param?.height >= Height
            ) {
              const prev = packagesDictionary[itm.supplierId] ?? undefined;
              // eslint-disable-next-line unicorn/prefer-ternary, unicorn/no-negated-condition
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
          message: 'Any suitable supplier',
        };
      } catch (error) {
        console.error('Error while selecting suitable package', error);
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
        console.log('databaze user', context.user);

        if (context.user?.uid !== id) {
          return {
            message: 'Only user with account can use this function',
          };
        }

        const newHistoryDoc = db.collection('History').doc();
        const data = JSON.parse(dataS);

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
          dataForm: data.formData.dataFrForm,
          historyId: newHistoryDoc.id,
          suppData: toFirestore,
        };

        const dataInColl = await db.collection('History').get();

        const duplicateByParam = dataInColl.docs.map((item) => {
          // return ?
          // spise kontrola dle jmena
          const itm = item.data() as HistoryDoc;
          const byForm = itm.dataForm;
          const byCost = itm.suppData.cost;
          const userId = itm.uId;
          if (itm.suppData.id === sData.supplierId && userId === id) {
            return itm.suppData.packName === data.formData.dataFrForm.width &&
              byForm.height === data.formData.dataFrForm.height &&
              byForm.weight === data.formData.dataFrForm.weight &&
              byForm.plength === data.formData.dataFrForm.plength &&
              byForm.placeTo === data.formData.dataFrForm.placeTo &&
              byForm.placeFrom === data.formData.dataFrForm.placeFrom &&
              Number(byCost) === Number(sPrice)
              ? item
              : undefined;
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
            message: 'Already saved',
          };
        }

        await newHistoryDoc.set(newHistory);

        if (dataInColl.docChanges() && dataInColl.docChanges().length > 0) {
          return { message: 'Save successful' };
        }
        return { message: 'Save error, please try again later' };
      } catch (error) {
        console.error('Error while saving document to your history', error);
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
      // Refactorizace kodu, mozne if zbytecné
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
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      console.log('databaze user', context.user);
      if (context.user?.email !== Admin) {
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
          message:
            'Any of parameter that expect number dont support negative number',
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
          message: 'Any of parameter that expect number dont support 0',
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
            message: NotFoundMsg('Supplier'),
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
          console.log(keys);
          return keys.includes(ID);
        });

        existingPackages.forEach((item) => {
          // jmeno balicku
          const nameItm = Object.keys(item)[0];
          const itm = item[nameItm];
          console.log('itm', itm);
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
            console.log('selected', itm);
          }
        });
        console.log('keypack', keyPack);
        console.log('duplicate pack', dupPackages);

        if (keyPack.includes(true)) {
          return {
            __typename: 'PackageError',
            message: 'Duplicate id',
          };
        }

        if (dupName.length > 0) {
          return {
            __typename: 'PackageError',
            message: 'Name is already in use',
          };
        }

        if (dupPackages.length > 0) {
          return {
            __typename: 'PackageError',
            message: 'This params have alerady another package',
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

        console.log(existingPackages);
        await supplierDoc.ref.update({ package: existingPackages });

        console.log('ssdsds', JSON.stringify(newPackage));

        return {
          __typename: 'Pack',
          data: newPackage,
        };
      } catch (error) {
        console.error('Error while creating package', error);
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
        delivery: isDelivered,
        shippingLabel: hasShippingLabel,
        pickUp: PickupPoint,
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
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        if (context.user?.email !== Admin) {
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

        console.log(
          'names',
          namesOfSup.find(
            (name: string) => name.toLowerCase() === SuppName.toLowerCase(),
          ),
        );

        if (
          namesOfSup.some(
            (name: string) => name.toLowerCase() === SuppName.toLowerCase(),
          )
        ) {
          return {
            __typename: 'SupplierError',
            message: 'Supplier name is already in use',
          };
        }

        if (ConverDate(PickupPoint, isDelivered)?.message) {
          return {
            __typename: 'SupplierError',
            message: 'Provided date is not valid',
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
            message: 'Provided data is not in valid format (Ano/Ne)',
          };
        }

        if (InsuranceValue < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Insurance cant be less then zero',
          };
        }

        if (dCost < 0 || pCost < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Delivery costs cannot be less than zero',
          };
        }

        if (PickupPoint < isDelivered) {
          return {
            __typename: 'SupplierError',
            message: 'Pickup cant be longer then delivery',
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
          pickUp: PickupPoint,
          delivery: isDelivered,
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
        console.error('Error while creating supplier', error);
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
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        if (context.user?.email !== Admin) {
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
            message:
              'Any of parameter that expect number dont support negative number',
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
            message: 'Any of parameter that expect number dont support 0',
          };
        }

        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', supplierId)
          .get();

        if (SupplierDoc.size === 0) {
          return {
            __typename: 'PackageUpdateError',
            message: NotFoundMsg('Supplier'),
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
            console.log('itm', itm);
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
              console.log('selected', itm);
            }
          });

        if (dupName.length > 0) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Name is already in use',
          };
        }

        if (dupPackages.length > 0) {
          return {
            __typename: 'PackageUpdateError',
            message: 'This params have alerady another package',
          };
        }

        for (const pack of existingPackages) {
          // eslint-disable-next-line max-depth
          if (pack[id]) {
            console.log('name itm', id);
            pack[id].weight = weightPack;
            pack[id].cost = costPackage;
            pack[id].Plength = lengthPack;
            pack[id].height = heightPack;
            pack[id].width = widthPack;
            pack[id].name_package = packName;
            console.log('update', pack[id]);
          }
        }

        console.log(existingPackages);

        await supplierDoc.ref.update({ package: existingPackages });
        console.log('ssdsds', JSON.stringify(UpdatePackage));
        if (SupplierDoc.docChanges() && SupplierDoc.docChanges().length > 0) {
          return {
            __typename: 'UPack',
            data: UpdatePackage,
          };
        }

        return {
          __typename: 'PackageUpdateError',
          message: 'Update not succesfull',
        };
      } catch (error) {
        console.error('Error while updating package', error);
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
        delivery: isDelivered,
        shippingLabel: hasShippingLabel,
        pickUp: PickupPoint,
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
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        if (context.user?.email !== Admin) {
          return {
            __typename: 'SupplierError',
            message: admMessage,
          };
        }
        if (ConverDate(PickupPoint, isDelivered)?.message) {
          return {
            __typename: 'SupplierError',
            message: 'Provided date is not valid',
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
            message: 'Provided data is not in valid format (Ano/Ne)',
          };
        }

        const Supd = await db
          .collection('Supplier')
          .where('supplierId', '==', id)
          .get();

        if (Supd.size === 0) {
          return {
            __typename: 'SupplierError',
            message: NotFoundMsg('Supplier'),
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
            message: 'Supplier name is already in use',
          };
        }

        if (PickupPoint < isDelivered) {
          return {
            __typename: 'SupplierError',
            message: 'Pickup cant be longer then delivery',
          };
        }

        if (InsuranceValue < 0) {
          return {
            __typename: 'SupplierError',
            message: 'Insurance cant be less then zero',
          };
        }

        const location = {
          depoDelivery: { cost: dCost, delivery: 'depo' },
          personalDelivery: { cost: pCost, delivery: 'personal' },
        };

        Supd.forEach(async (doc) => {
          await doc.ref.update({
            sendCashDelivery: SendCashOnDelivery,
            packInBox: PackageInABox,
            suppName: SuppName,
            pickUp: PickupPoint,
            delivery: isDelivered,
            insurance: InsuranceValue,
            shippingLabel: hasShippingLabel,
            foil: hasFoil,
            location,
          });
        });

        const newSupp = {
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          suppName: SuppName,
          pickUp: PickupPoint,
          delivery: isDelivered,
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
          message: 'Update not succesfull',
        };
      } catch (error) {
        console.error('Error while updating supplier', error);
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
      },
      context: MyContext,
      // eslint-disable-next-line sonarjs/cognitive-complexity, consistent-return
    ) => {
      // update nejen ceny ale i dodavatele
      // pri mazani baliku a dodavatele i mazani historie
      const {
        newPricePack: nPricrePack,
        newPricePersonal: nPriceP,
        newPriceDepo: nPriceDepo,
        suppId: sId,
        packName: nameOfpack,
        oldPackName: oldNameOfpack,
        suppData: dataS,
      } = args;
      // dodelat resolver
      // udelat filtry na frontendu
      // zmena hesla

      try {
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        let msg = '';
        console.log('proces env', Admin === context.user?.email);
        console.log(
          'context user',
          context.user?.email_verified,
          context.user?.email,
        );
        console.log('named', oldNameOfpack, nameOfpack);
        const getDoc = (
          doc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
          sID: string,
          packageName: string,
        ) => {
          for (const document of doc.docs) {
            const item = document.data();
            if (
              item.suppData.id === sID &&
              item.suppData.packName === packageName
            ) {
              return document;
            }
          }
          return undefined;
        };

        if (context.user?.email !== Admin) {
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

        console.log('data', nPriceDepo, nPriceP, dataS);

        if (nPriceP && nPriceDepo && dataS) {
          console.log('data', nPriceDepo, nPriceP, dataS);
          msg = await doMatchForOptionsDelivery(
            SuppDocuments,
            nPriceDepo,
            nPriceP,
            historyDocuments,
            dataS,
          );
        }

        if (nPricrePack && nameOfpack && sId && oldNameOfpack) {
          const historyDoc = getDoc(historyDocuments, sId, oldNameOfpack);
          msg = await doMathForPackage(
            SuppDocuments,
            nPricrePack,
            historyDoc,
            oldNameOfpack === nameOfpack ? oldNameOfpack : nameOfpack,
          );
        }

        return { message: msg };
      } catch (error) {
        console.error('Error while updating history', error);
        throw error;
      }
    },
    // delete
    deletePack: async (
      parent_: any,
      args: { key: string; suppId: string },
      context: MyContext,
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

      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      if (context.user?.email !== Admin) {
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

        if (supplierDoc.exists) {
          // eslint-disable-next-line max-depth
          if (existingPackages) {
            newArray = existingPackages.filter((item) => !item[Pack]);
            find = Boolean(existingPackages.filter((item) => !item[Pack]));
          } else {
            err = 'Nothing to delete';
          }
          // eslint-disable-next-line max-depth
          if (find) {
            await supplierDoc.ref.update({ package: newArray });
            deleted = true;
          } else {
            err = NotFoundMsg('Package');
          }
        } else {
          err = NotFoundMsg('Supplier');
        }
        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Error while deleting package', error);
        throw error;
      }
    },
    deleteSupp: (
      parent_: any,
      args: { id: Array<string> },
      context: MyContext,
    ) => {
      let deleted = false;
      let err = '';
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      if (context.user?.email !== Admin) {
        err = admMessage;
        deleted = false;
        return { deletion: deleted, error: err };
      }
      const { id: SupIdar } = args;

      try {
        console.log('pole', SupIdar);
        const collection = db.collection('Supplier');
        SupIdar.forEach(async (Idsup) => {
          const snapshot = await collection
            .where('supplierId', '==', Idsup)
            .get();
          if (snapshot) {
            await snapshot.docs[0].ref.delete();
          }
        });
        deleted = true;
        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Error while deleting supplier', error);
        throw error;
      }
    },
    // deleteHistoryItem: async (parent_:any, args:{}, context:MyContext) =>{},
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
    console.log(auth);
    return {
      user: auth ? await verifyToken(auth) : undefined,
    } as Context;
  },
});
