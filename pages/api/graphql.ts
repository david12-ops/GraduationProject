import 'firebase/compat/storage';

import { Context } from '@apollo/client';
import { DecodedIdToken } from 'firebase-admin/auth';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';
import _ from 'lodash';

import { firestore } from '../../firebase/firebase-admin-config';
import { verifyToken } from './verify_token';

type MyContext = { user?: DecodedIdToken };

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
      mistoZ: String!
      mistoDo: String!
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
      oldPricePack: Int
      newPricePersonal: Int
      oldPricePersonal: Int
      newPriceDepo: Int
      oldPriceDepo: Int
      suppId: String
      packName: String
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
      actNameSupp: String!
      depoCost: Int!
      personalCost: Int!
    ): Supplier

    deletePack(suppId: String!, key: String!): Delete
    deleteSupp(id: [String]): Delete
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

// eslint-disable-next-line consistent-return
const ConverDate = (dateU1: any, dateU2: any) => {
  console.log(dateU1);
  // eslint-disable-next-line unicorn/better-regex
  const option = /^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$/;
  if (!option.test(dateU1) || !option.test(dateU2)) {
    return new Error('Invalid argument of date');
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, unicorn/prefer-string-slice, @typescript-eslint/restrict-plus-operands
  const dateParts = dateU1.split('-');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

// eslint-disable-next-line complexity
const CostDif = (
  costOldDepo: number,
  costNewDepo: number,
  costOldPersonal: number,
  costNewPersonal: number,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  // spatne hodnory
  console.log('costOldDepo', costOldDepo);
  console.log('costNewDepo', costNewDepo);
  console.log('costOldPersonal', costOldPersonal);
  console.log('costNewPersonal', costNewPersonal);

  let costDifference = 0;
  const operationCost = { operation: '', cost: costDifference };

  if (costOldDepo === costNewDepo && costOldPersonal === costNewPersonal) {
    return operationCost;
  }

  if (costOldDepo > costNewDepo && costOldPersonal > costNewPersonal) {
    const costD = costOldDepo - costNewDepo;
    const costP = costOldPersonal - costNewPersonal;
    costDifference = costD + costP;
    console.log('zlevneni', costDifference);
    console.log('ceny nižší');
    operationCost.cost = costDifference;
    operationCost.operation = '-';
  }

  if (costOldDepo < costNewDepo && costOldPersonal < costNewPersonal) {
    const costD = costNewDepo - costOldDepo;
    const costP = costNewPersonal - costOldPersonal;
    costDifference = costD + costP;
    console.log('zdrazeni', costDifference);
    console.log('ceny vyšší');
    operationCost.cost = costDifference;
    operationCost.operation = '+';
  }

  if (costOldDepo > costNewDepo && costOldPersonal < costNewPersonal) {
    const costD = costOldDepo - costNewDepo;
    console.log('cenaD', costD);
    const costP = costNewPersonal - costOldPersonal;
    console.log('costP', costP);
    costDifference = costP - costD;
    console.log('zdrazeni/zlevneni', costDifference);
    console.log('zvyseni personal ceny a snizeni depa ceny');
    operationCost.cost = costDifference;
    operationCost.operation = '+';
  }

  if (costOldPersonal > costNewPersonal && costOldDepo < costNewDepo) {
    const costD = costNewDepo - costOldDepo;
    console.log('cenaD', costD);
    const costP = costOldPersonal - costNewPersonal;
    console.log('costP', costP);
    costDifference = costD - costP;
    console.log('zdrazeni/zlevneni', costDifference);
    console.log('zvyseni depo ceny a snizeni personal ceny');
    operationCost.cost = costDifference;
    operationCost.operation = '+';
  }

  if (costOldDepo > costNewDepo && costOldPersonal === costNewPersonal) {
    const costD = costOldDepo - costNewDepo;
    costDifference = costD;
    console.log('zlevneni', costDifference);
    console.log('cena depa nižší');
    operationCost.cost = costDifference;
    operationCost.operation = '-';
  }

  if (costOldDepo === costNewDepo && costOldPersonal > costNewPersonal) {
    const costP = costOldPersonal - costNewPersonal;
    costDifference = costP;
    console.log('zlevneni', costDifference);
    console.log('cena personal nižší');
    operationCost.cost = costDifference;
    operationCost.operation = '-';
  }

  if (costOldDepo < costNewDepo && costOldPersonal === costNewPersonal) {
    const costD = costNewDepo - costOldDepo;
    costDifference = costD;
    console.log('zdrazeni', costDifference);
    console.log('cena depa vyssi');
    operationCost.cost = costDifference;
    operationCost.operation = '+';
  }

  if (costOldDepo === costNewDepo && costOldPersonal < costNewPersonal) {
    const costP = costNewPersonal - costOldPersonal;
    costDifference = costP;
    console.log('zdrazeni', costDifference);
    console.log('cena personal vyssi');
    operationCost.cost = costDifference;
    operationCost.operation = '+';
  }

  console.log(
    'variables',
    costOldDepo,
    costNewDepo,
    costOldPersonal,
    costNewPersonal,
    operationCost,
  );
  return operationCost;
};

const doMathForPackage = async (
  data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  nPriceP: number,
  packageName: string,
  supplierId: string,
  historyDoc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
): Promise<string> => {
  let msg = '';

  let sum = 0;
  let historyId = '';

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

  historyDoc.forEach((doc) => {
    const itm = doc.data();
    if (
      itm.suppData.id === supplierId &&
      itm.suppData.packName === packageName
    ) {
      historyId = itm.historyId;
    }
  });

  const historyQuerySnapshot = await db
    .collection('History')
    .where('historyId', '==', historyId)
    .get();

  // eslint-disable-next-line unicorn/no-negated-condition
  if (!historyQuerySnapshot.empty) {
    const historyDocumentRef = historyQuerySnapshot.docs[0].ref;
    // pozor!!!
    await historyDocumentRef.update(
      new firestore.FieldPath('suppData', 'cost'),
      sum,
    );
    // eslint-disable-next-line prettier/prettier
  }
  else{
    msg = 'Nothing to update in history';
    return msg;
  }

  if (
    historyQuerySnapshot.docChanges() &&
    historyQuerySnapshot.docChanges().length > 0
  ) {
    msg = 'Users history updated successfully';
    return msg;
  }

  msg = 'Users history not updated successfully';
  return msg;
};

const doMatchForOptionsDelivery = async (
  data: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  nPriceDepo: number,
  nPriceP: number,
  historyDoc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
) => {
  // moznost filtrovat i insecure

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

  const namesPack: Array<string> = [];
  // let pack: Record<string, Package> = {};
  let pack: Array<Package> = [];
  const packInfo: Array<PackInfo> = [];
  const sum = nPriceDepo + nPriceP;
  const historyIds: Array<string> = [];
  const msg = '';

  historyDoc.forEach((doc) => {
    const item = doc.data();
    namesPack.push(item.suppData.packName);
  });

  console.log('pack names', namesPack);

  data.forEach((item) => {
    console.log('option delivery', item.data());
    const packages = item.data().package;
    pack = packages;
  });

  // balicky

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
    const item = doc.data();
    packInfo.forEach((itm: PackInfo) => {
      if (item.suppData.packName === itm.namePack) {
        historyIds.push(item.historyId);
      }
    });
  });

  // if (
  //   nPriceP &&
  //   oPriceP &&
  //   nPriceDepo &&
  //   oPriceDepo &&
  //   context.user?.email === Admin
  // ) {
  //   msg = await ChangePriceOptionsDelivery(context.user?.email ?? '');
  // }

  console.log('history id', historyIds);

  // const historyQuerySnapshot = await db
  //   .collection('History')
  //   .where('historyId', '==', historyId)
  //   .get();

  // if (!historyQuerySnapshot.empty) {
  //   const historyDocumentRef = historyQuerySnapshot.docs[0].ref;

  //   await historyDocumentRef.update(
  //     new firestore.FieldPath('suppData', 'cost'),
  //     Number(packInfo.cost) + sum,
  //   );
  //   // eslint-disable-next-line prettier/prettier
  // }
  // // update history
  // console.log(nPriceP);
  // console.log('locat sum', sum);

  // if (
  //   historyQuerySnapshot.docChanges() &&
  //   historyQuerySnapshot.docChanges().length > 0
  // ) {
  //   msg = 'Users history updated successfully';
  //   return msg;
  // }

  // msg = 'Users history not updated successfully';

  // console.log('message', msg);
  // return msg;
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
        console.error('Chyba při získání balíčku', error);
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
        console.error('Chyba při získání dodavatele', error);
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
        console.error('Chyba při zíkávání dat uživatele', error);
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
        mistoZ: string;
        mistoDo: string;
        cost: number;
      },
      // eslint-disable-next-line sonarjs/cognitive-complexity
    ) => {
      const {
        width: Width,
        weight: Weight,
        height: Height,
        Plength: pLength,
        mistoZ: Z,
        mistoDo: Do,
        cost: Pcost,
      } = args;
      const packages: any = [];
      const packData: [] = [];
      const rtrnItem: any = [];
      let location: any;

      const validargZ = ['personal', 'depo'].includes(Z);
      const validargDo = ['personal', 'depo'].includes(Do);

      const suppWithLocationFiled: any = [];

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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        SupplierDoc.docs.forEach((item) => {
          if (
            item._fieldsProto &&
            item._fieldsProto.package &&
            item._fieldsProto.package.arrayValue
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            item._fieldsProto.package.arrayValue.values.map((packItem: any) =>
              packages.push(packItem.mapValue.fields),
            );
          }
          if (item._fieldsProto?.location) {
            location = item._fieldsProto.location.mapValue.fields;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
            suppWithLocationFiled.push({
              loc: location,
              suppId: item._fieldsProto.supplierId.stringValue,
            });
            console.log('itm with location', suppWithLocationFiled);
          }
        });

        packages.forEach((packageObj) => {
          // Extracting the values from each package object
          const [packageDetails] = Object.values(packageObj);
          packData.push(packageDetails.mapValue.fields);
        });

        // vedet cenu
        const costSupp = suppWithLocationFiled.map(
          (i: {
            loc: {
              depoDelivery: { mapValue: { fields: { delivery: any } } };
              personalDelivery: { mapValue: { fields: { delivery: any } } };
            };
            suppId: string;
          }) => {
            // dd
            const depo = i.loc.depoDelivery.mapValue.fields;
            const personal = i.loc.personalDelivery.mapValue.fields;
            if (
              depo.delivery.stringValue === Z &&
              depo.delivery.stringValue === Do
            ) {
              return {
                idS: i.suppId,
                cost: 2 * Number(depo.cost.integerValue),
              };
            }
            // pd
            if (
              personal.delivery.stringValue === Z &&
              depo.delivery.stringValue === Do
            ) {
              return {
                idS: i.suppId,
                cost:
                  Number(personal.cost.integerValue) +
                  Number(depo.cost.integerValue),
              };
            }

            // dp
            if (
              depo.delivery.stringValue === Z &&
              personal.delivery.stringValue === Do
            ) {
              return {
                idS: i.suppId,
                cost:
                  Number(depo.cost.integerValue) +
                  Number(personal.cost.integerValue),
              };
            }
            // pp
            return {
              idS: i.suppId,
              cost: 2 * Number(personal.cost.integerValue),
            };
          },
        );

        const IsItSuppWithLoc = (loc: [], sId: string) => {
          return loc.find((itm: any) => {
            return itm.suppId === sId;
          });
        };

        const CostOfPack = (costSup: any, pack: any) => {
          let sumCost = 0;
          for (const e of costSup) {
            if (pack.supplier_id.stringValue === e.idS) {
              sumCost = Number(e.cost) + Number(pack.cost.integerValue);
              console.log('tak cooo tam je', sumCost, e.idS);
              return sumCost;
            }
          }
        };

        // prilepim cenu
        const packCost = packData.map(
          (item: {
            Plength: number;
            width: number;
            weight: number;
            height: number;
            supplier_id: string;
            cost: number;
            name_package: string;
          }) => {
            if (
              IsItSuppWithLoc(
                suppWithLocationFiled,
                item.supplier_id.stringValue,
              )
            ) {
              const cost = CostOfPack(costSupp, item);
              return {
                supplierId: item.supplier_id.stringValue,
                Cost: cost,
                Name: item.name_package.stringValue,
                param: {
                  width: Number(item.weight.integerValue),
                  length: Number(item.Plength.integerValue),
                  weight: Number(item.weight.integerValue),
                  height: Number(item.height.integerValue),
                },
              };
            }
            return {
              supplierId: item.supplier_id.stringValue,
              Cost: Number(item.cost.integerValue),
              Name: item.name_package.stringValue,
              param: {
                width: Number(item.weight.integerValue),
                length: Number(item.Plength.integerValue),
                weight: Number(item.weight.integerValue),
                height: Number(item.height.integerValue),
              },
            };
          },
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, array-callback-return, consistent-return
        const suitableByCost = packCost.map((item: any) => {
          if (Pcost >= Number(item.Cost)) {
            return item;
          }
        });
        console.log('filter by cost', JSON.stringify(suitableByCost));

        const cleared = suitableByCost.filter((itm) => itm !== undefined);

        const groupedById = _.groupBy(cleared, 'supplierId');

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
          item.forEach(
            (itm: {
              supplierId: string;
              Cost: number;
              Name: string;
              param: {
                width: number;
                length: number;
                weight: number;
                height: number;
              };
            }) => {
              if (
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
            },
          );
        });

        Object.entries(packagesDictionary).forEach(([key, item]) => {
          console.log('noooo ITMMMMMM', key);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          rtrnItem.push({
            suppId: item.supplierId,
            cost: item.Cost,
            name: item.Name,
          });
        });

        // mozna zmena
        if (rtrnItem.length > 0) {
          console.log('suitable item', rtrnItem);
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
        console.error('Chyba při vyběru vhodného balíčku:', error);
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
        // eslint-disable-next-line prefer-destructuring
        const packName = data.data.packName;
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

        // eslint-disable-next-line array-callback-return, consistent-return
        const duplicateByParam = dataInColl.docs.map((item: any) => {
          const byForm = item._fieldsProto.dataForm.mapValue.fields;
          const byCost: number =
            item._fieldsProto.suppData.mapValue.fields.cost.integerValue;
          const userId = item._fieldsProto.uId.stringValue;
          if (
            item._fieldsProto.suppData.mapValue.fields.id.stringValue ===
              sData.supplierId &&
            userId === id
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return byForm.width.stringValue ===
              data.formData.dataFrForm.width &&
              byForm.height.stringValue === data.formData.dataFrForm.height &&
              byForm.weight.stringValue === data.formData.dataFrForm.weight &&
              byForm.plength.stringValue === data.formData.dataFrForm.plength &&
              byForm.placeTo.stringValue === data.formData.dataFrForm.placeTo &&
              byForm.placeFrom.stringValue ===
                data.formData.dataFrForm.placeFrom &&
              Number(byCost) === Number(sPrice)
              ? item
              : undefined;
          }
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
        console.error('Chyba při vytváření historie:', error);
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
        weight: hmotnost,
        Plength: delka,
        height: vyska,
        cost: costPackage,
        width: sirka,
        name_package: packName,
        supplier_id: supplierId,
        packId: ID,
      } = args;
      // Refactorizace kodu, mozne if zbytecné

      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      console.log('databaze user', context.user);
      if (context.user?.email !== Admin) {
        return {
          __typename: 'PackageError',
          message: 'Only admin can use this function',
        };
      }

      if (
        hmotnost < 0 ||
        delka < 0 ||
        vyska < 0 ||
        costPackage < 0 ||
        sirka < 0
      ) {
        return {
          __typename: 'PackageError',
          message:
            'Any of parameter that expect number dont support negative number',
        };
      }

      if (
        hmotnost === 0 ||
        delka === 0 ||
        vyska === 0 ||
        costPackage === 0 ||
        sirka === 0
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
            message: 'Supplier not found',
          };
        }

        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages = supplierDoc.data().package || [];
        const dupPackages: any = [];
        let dupName = '';

        const newPackage = {
          weight: hmotnost,
          cost: costPackage,
          Plength: delka,
          height: vyska,
          width: sirka,
          name_package: packName,
          supplier_id: supplierDoc.id,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const keyPack = existingPackages.map((item: any) => {
          const keys = Object.keys(item)[0];
          console.log(keys);
          return keys.includes(ID);
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        existingPackages.forEach(
          (item: {
            [name: string]: {
              weight: number;
              height: number;
              width: number;
              Plength: number;
              name_package: string;
            };
          }) => {
            // jmeno balicku
            const nameItm = Object.keys(item)[0];
            const itm = item[nameItm];
            console.log('itm', itm);
            // kontrola jmén
            if (itm.name_package === packName) {
              dupName = itm.name_package;
            }
            // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
            if (
              itm.weight === newPackage.weight &&
              itm.height === newPackage.height &&
              itm.width === newPackage.width &&
              itm.Plength === newPackage.Plength
            ) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              dupPackages.push(itm);
              console.log('selected', itm);
            }
          },
        );
        console.log('keypack', keyPack);
        console.log('duplicate pack', dupPackages);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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

        const objectPack: { [key: string]: any } = {};
        // eslint-disable-next-line react-hooks/rules-of-hooks
        objectPack[ID] = {
          weight: hmotnost,
          cost: costPackage,
          Plength: delka,
          height: vyska,
          width: sirka,
          name_package: packName,
          supplier_id: supplierDoc.id,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        existingPackages.push(objectPack);

        console.log(existingPackages);
        await supplierDoc.ref.update({ package: existingPackages });

        console.log('ssdsds', JSON.stringify(newPackage));

        return {
          __typename: 'Pack',
          data: newPackage,
        };
      } catch (error) {
        console.error('Chyba při vytváření balíčku', error);
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

      try {
        const namesOfSup: Array<string> = [];
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        if (context.user?.email !== Admin) {
          return {
            __typename: 'SupplierError',
            message: 'Only admin can use this function',
          };
        }

        const SuppDocument = await db.collection('Supplier').get();

        SuppDocument.forEach((data: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
          namesOfSup.push(data._fieldsProto.suppName.stringValue);
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
        console.error('Chyba při vytváření dovozce', error);
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
        weight: hmotnost,
        Plength: delka,
        height: vyska,
        cost: costPackage,
        width: sirka,
        name_package: packName,
        supplier_id: supplierId,
      } = args;
      try {
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        if (context.user?.email !== Admin) {
          return {
            __typename: 'PackageUpdateError',
            message: 'Only admin can use this function',
          };
        }
        if (
          hmotnost < 0 ||
          delka < 0 ||
          vyska < 0 ||
          costPackage < 0 ||
          sirka < 0
        ) {
          return {
            __typename: 'PackageUpdateError',
            message:
              'Any of parameter that expect number dont support negative number',
          };
        }

        if (
          hmotnost === 0 ||
          delka === 0 ||
          vyska === 0 ||
          costPackage === 0 ||
          sirka === 0
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
            message: 'Supplier not found',
          };
        }

        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages = supplierDoc.data().package || [];
        const dupPackages: any = [];
        let dupName = '';

        const UpdatePackage = {
          weight: hmotnost,
          cost: costPackage,
          Plength: delka,
          height: vyska,
          width: sirka,
          name_package: packName,
          supplier_id: supplierDoc.id,
        };

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        existingPackages
          .filter((item: any) => {
            return !item[id];
          })
          .forEach(
            (item: {
              [name: string]: {
                weight: number;
                height: number;
                width: number;
                Plength: number;
                name_package: string;
              };
            }) => {
              // Vybrat vsechny,Ignorovat updated
              // jmeno balicku
              const nameItm = Object.keys(item)[0];
              const itm = item[nameItm];
              console.log('itm', itm);
              // kontrola jmén
              if (itm.name_package === packName) {
                dupName = itm.name_package;
              }
              // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
              if (
                itm.weight === UpdatePackage.weight &&
                itm.height === UpdatePackage.height &&
                itm.width === UpdatePackage.width &&
                itm.Plength === UpdatePackage.Plength
              ) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                dupPackages.push(itm);
                console.log('selected', itm);
              }
            },
          );

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

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        existingPackages.forEach(
          (item: {
            [name: string]: {
              weight: number;
              height: number;
              width: number;
              Plength: number;
              cost: number;
              name_package: string;
            };
          }) => {
            // najdi update item
            const updatetedItem = item;

            // eslint-disable-next-line sonarjs/no-collapsible-if, unicorn/no-lonely-if
            if (updatetedItem[id]) {
              // eslint-disable-next-line unicorn/no-lonely-if, max-depth
              console.log('name itm', id);
              updatetedItem[id].weight = hmotnost;
              updatetedItem[id].cost = costPackage;
              updatetedItem[id].Plength = delka;
              updatetedItem[id].height = vyska;
              updatetedItem[id].width = sirka;
              updatetedItem[id].name_package = packName;
              console.log('update with same name', updatetedItem[id]);
            }
          },
        );

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
        console.error('Chyba při update balíčku', error);
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
        actNameSupp: string;
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
        actNameSupp: ActName,
        depoCost: dCost,
        personalCost: pCost,
      } = args;

      try {
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        if (context.user?.email !== Admin) {
          return {
            __typename: 'SupplierError',
            message: 'Only admin can use this function',
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
            message: 'Supplier not found',
          };
        }

        const SupplierDoc = await db.collection('Supplier').get();

        const docs = SupplierDoc.docs.map((doc) => doc.data());

        const docsWithoutCurrentSupp = docs.filter(
          (doc) => doc.suppName !== ActName,
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const duplicateSupp = docsWithoutCurrentSupp.find(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
        console.error('Chyba při update dovozce', error);
        throw error;
      }
    },
    updateHistory: async (
      parent_: any,
      args: {
        newPricePack: number;
        oldPricePack: number;
        newPricePersonal: number;
        oldPricePersonal: number;
        newPriceDepo: number;
        oldPriceDepo: number;
        suppId: string;
        packName: string;
      },
      context: MyContext,
      // eslint-disable-next-line sonarjs/cognitive-complexity, consistent-return
    ) => {
      const {
        newPricePack: nPricrePack,
        oldPricePack: oPricePack,
        newPricePersonal: nPriceP,
        oldPricePersonal: oPriceP,
        newPriceDepo: nPriceDepo,
        oldPriceDepo: oPriceDepo,
        suppId: sId,
        packName: nameOfpack,
      } = args;
      // dodelat resolver
      // udelat filtry na frontendu
      // zmena hesla

      try {
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        let msg = '';
        if (context.user?.email !== Admin) {
          return {
            __typename: 'HistoryMessage',
            message: 'Only admin can use this function',
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

        // update celeho dokumentu histore
        // kontrola aby nebyli u sera dva stejny dodavatele se stejnum balickem

        const ChangePriceOptionsDelivery = async (userEmail: string) => {
          const SuppDocuments = await db
            .collection('History')
            .where('suppData.id', '==', sId)
            .get();

          console.log('vybrany document', SuppDocuments);
          let updated = false;

          console.log('id', sId);
          console.log(
            'cstDiff',
            CostDif(oPriceDepo, nPriceDepo, oPriceP, nPriceP).cost,
          );

          const differenceCost = CostDif(
            oPriceDepo,
            nPriceDepo,
            oPriceP,
            nPriceP,
          );

          if (differenceCost.cost === 0) {
            console.log('nema smysl pocitat');
          }

          if (userEmail === Admin && differenceCost.cost !== 0) {
            SuppDocuments.forEach(async (doc) => {
              console.log('document', doc);
              let cost = Number(
                doc._fieldsProto.suppData.mapValue.fields.cost.integerValue,
              );
              console.log('cost total');

              if (differenceCost.operation === '-') {
                cost -= differenceCost.cost;
                console.log(`total: ${cost}`);
              }

              if (differenceCost.operation === '+') {
                cost += differenceCost.cost;
                console.log(`total: ${cost}`);
              }

              await doc.ref.update({ 'suppData.cost': cost });

              // new firestore.FieldPath('suppData', 'cost'),
              //   cost
            });

            updated = !!(
              SuppDocuments.docChanges() &&
              SuppDocuments.docChanges().length > 0
            );
          }

          console.log('updated', updated);
          if (updated) {
            return 'Users history updated successfully';
          }
          return 'Users history not updated successfully';
        };

        if (
          nPriceP &&
          oPriceP &&
          nPriceDepo &&
          oPriceDepo &&
          context.user?.email === Admin
        ) {
          msg = await doMatchForOptionsDelivery(
            SuppDocuments,
            nPriceDepo,
            nPriceP,
            historyDocuments,
          );
        }
        // msg = await doMatchForOptionsDelivery(SuppDocuments, nPriceDepo, nPriceP, historyDocuments)

        if (nPricrePack && nameOfpack && sId && context.user?.email === Admin) {
          msg = await doMathForPackage(
            SuppDocuments,
            nPricrePack,
            nameOfpack,
            sId,
            historyDocuments,
          );
        }

        // msg = 'Only admin can use this functionality';

        return { message: msg };
      } catch (error) {
        console.error('Chyba při úpravě historie uživatele', error);
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
      let newArray = [];
      console.log('id', Pack);
      console.log('id', Sid);

      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      if (context.user?.email !== Admin) {
        err = 'Only admin can use this function';
        deleted = false;
        return { deletion: deleted, error: err };
      }

      try {
        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', Sid)
          .get();
        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages = supplierDoc.data().package || [];

        if (supplierDoc.exists) {
          // eslint-disable-next-line max-depth
          if (existingPackages) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            newArray = existingPackages.filter((item: any) => !item[Pack]);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            find = Boolean(existingPackages.filter((item: any) => !item[Pack]));
            console.log('newARR', newArray);
            console.log('ffffind', find);
          } else {
            err = 'Nothing to delete';
          }
          // eslint-disable-next-line max-depth
          if (find) {
            await supplierDoc.ref.update({ package: newArray });
            deleted = true;
          } else {
            err = 'Package not found';
          }
        } else {
          err = 'Supplier not found';
        }
        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Chyba při mazání emailu uživatele', error);
        throw error;
      }
    },
    deleteSupp: (parent_: any, args: { id: [string] }, context: MyContext) => {
      let deleted = false;
      let err = '';
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      if (context.user?.email !== Admin) {
        err = 'Only admin can use this function';
        deleted = false;
        return { deletion: deleted, error: err };
      }
      const { id: SupIdar } = args;

      try {
        console.log('pole', SupIdar);
        const collection = db.collection('Supplier');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        SupIdar.forEach(async function (Idsup) {
          const snapshot = await collection
            .where('supplierId', '==', Idsup)
            .get();
          if (snapshot.empty) {
            err = 'Dodavatel není v databázi';
          }
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await snapshot.docs[0].ref.delete();
        });
        deleted = true;
        return { deletion: deleted, error: err };
      } catch (error) {
        console.error('Chyba při mazání emailu uživatele', error);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      user: auth ? await verifyToken(auth) : undefined,
    } as Context;
  },
});
