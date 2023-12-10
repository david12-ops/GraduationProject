// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-extra-boolean-cast */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-floating-promises */
import 'firebase/compat/storage';

import { Context } from '@apollo/client';
import axios from 'axios';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { firestore } from '../../firebase/firebase-admin-config';
// import { UserCreate } from '../components/types-user';
import { IndexItem } from '../components-of-home/cards/types';

const typeDefs = gql`
  type Query {
    users: [User!]!
    githubUsers: [GithubUser!]!
    cardValues: [CardValue]!
    userdata: [UserData!]!
    packageData: [QueryPackD!]!
    suplierData: [QuerySuppD!]!
  }

  type Mutation {
    ActualUsToFirestore(emailUS: String!): UserData
    ChangeActualUsEmToFirestore(
      ActualemailUser: String!
      Email: String!
    ): UserChangeEmData

    PackageToFirestore(
      weight: Int
      cost: Int
      Plength: Int
      height: Int
      width: Int
      name_package: String!
      supplier_id:String!
    ): PackageData

    updatePack(
      weight: Int!
      cost: Int!
      Plength: Int!
      height: Int!
      width: Int!
      name_package: String!
      packId: String!
      aNamePack:String!
    ): PackageDataUpdate

    SupplierToFirestore(
      supplierName: String!
      delivery: String!
      shippingLabel: String!
      pickUp: String!
      foil: String
      insurance: Int!
      sendCashDelivery: String!
      packInBox: String!
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
      packId: String
    ):Supplier

    deletePack(id: Int): Boolean
    deletePack2(id: [String]): Boolean
    deleteSupp(id: Int): Boolean
    deleteSupp2(id: [String]): Boolean
  }

  type User {
    name: String
  }

  type GithubUser {
    id: ID!
    login: String!
    avatarUrl: String!
  }

  type Supplier {
    sendCashDelivery: String!
    packInBox: String!
    packageId: String!
    supplierId: String!
    suppName: String!
    pickUp: String!
    delivery: String!
    insurance: Int!
    shippingLabel: String!
    foil: String!
  }

  type UserData {
    dataUs: String!
    email: String!
    historyId: Int!
    supplierId: Int!
  }

  type UserChangeEmData {
    email: String!
  }

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

  scalar JSON
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
    package:JSON
  }

  type PackageData {
    weight: Int!
    cost: Int!
    Plength: Int!
    height: Int!
    width: Int!
    name_package: String!
    packgeId: String!
    error:String
    supplier_id:String!
  }

  type PackageDataUpdate {
    weight:Int!
    cost:Int!
    Plength:Int!
    height:Int!
    width:Int!
    name_package:String!
    packId:String!
    aNamePack:String!
  }

  type CardValue {
    id: Int
    title: String!
    description: String!
    image: String!
  }
`;

// type DbUser = {
//   data: string;
//   email: string;
//   dataOfUS: FirebaseFirestore.DocumentReference<UserDada>;
// }

const db = firestore();

// validace
const NoHtmlSpecialChars = (ustring:any) =>{
  // zakladni - mozne pouziti cheerio or htmlparser2
  // const htmlRegex = /<[^>]*>$/;
  const option = /<[^>]*>/
 let error ="";
 if(option.test(ustring)){
  error = 'HTML code is not supported';
 }
 return error;
}

// Validace pro package
const Convert = (
  // kontrola na zaporne hodnoty - je
  stringToNum: any,
  stringToNum2: any,
  stringToNum3: any,
  stringToNum4: any,
  stringToNum5: any,
) => {
  let error = "";
  if (
    !Number.isSafeInteger(stringToNum) ||
    !Number.isSafeInteger(stringToNum2) ||
    !Number.isSafeInteger(stringToNum3) ||
    !Number.isSafeInteger(stringToNum4) ||
    !Number.isSafeInteger(stringToNum5)
  ) {
    error = 'Invalid number argument';
  }

  if (
    stringToNum < 0 ||
    stringToNum2 < 0 ||
    stringToNum3 < 0 ||
    stringToNum4 < 0 ||
    stringToNum5 < 0
  ) {
    error ='Invalid number, argument is less then 0';
  }

  return error;
};

// validace psc - je
// validace adresy - neni
// string v resolveru
const PSCVal = (psc: string, psc2: string) => {
  NoHtmlSpecialChars(psc);
  NoHtmlSpecialChars(psc2);
  // kontrola psc aby nebyli === - je
  // eslint-disable-next-line unicorn/better-regex
  const option = /^[0-9]{3} ?[0-9]{2}$/;
  if (!option.test(psc) || !option.test(psc2)) {
    throw new Error('Invalid psc argument');
  }
  if (psc === psc2) {
    throw new Error(
      'Invalid psc, argument of first psc doesnt be same like second',
    );
  }
};

// funkcni
const AddressVal = (address: string, address2: string) => {
  NoHtmlSpecialChars(address);
  NoHtmlSpecialChars(address2);
  // nepodporuje diakritiku!!
  // nemetchuje Mechov 521, Hradec Kralove
  // eslint-disable-next-line unicorn/better-regex
  const option = /^[A-Z][a-z]+ [0-9]{1,3}, [A-Z][a-z]+$/;
  if (!option.test(address) || !option.test(address2)) {
    throw new Error('Invalid address argument');
  }
  if (address === address2) {
    throw new Error(
      'Invalid address, argument of first address doesnt be same like second',
    );
  }
};

// validace pro supplier
const ConverBool = (
  stringnU1: string,
  stringanU2: string,
  stringnU3: string,
  stringnU4: string,
) => {
  const mess = 'Invalid argument of boolean';
  NoHtmlSpecialChars(stringnU1);
  NoHtmlSpecialChars(stringanU2);
  NoHtmlSpecialChars(stringnU3);
  NoHtmlSpecialChars(stringnU4);
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-constant-condition
  // eslint-disable-next-line no-constant-condition, sonarjs/no-redundant-boolean, @typescript-eslint/no-unsafe-call
  if (!['true', 'false'].includes(stringnU1.toLowerCase())) {
    throw new Error(mess);
  }
  if (!['true', 'false'].includes(stringanU2.toLowerCase())) {
    throw new Error(mess);
  }
  if (!['true', 'false'].includes(stringnU3.toLowerCase())) {
    throw new Error(mess);
  }
  if (!['true', 'false'].includes(stringnU4.toLowerCase())) {
    throw new Error(mess);
  }
};

const ConverNumb = (numberU: any) => {
  if (!Number.isSafeInteger(numberU) || numberU < 0) {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error('Invalid argument of number');
  }
};

// funkcni
const ConverDate = (dateU1: any, dateU2: any) => {
   // eslint-disable-next-line unicorn/better-regex
   NoHtmlSpecialChars(dateU1);
   NoHtmlSpecialChars(dateU2);
   console.log(dateU1)
   // eslint-disable-next-line unicorn/better-regex
   const option = /^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$/
    if (!option.test(dateU1) || !option.test(dateU2)
    ) {
      throw new TypeError('Invalid argument of date');
    }
    else{
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, unicorn/prefer-string-slice, @typescript-eslint/restrict-plus-operands
      const dateParts = dateU1.split('-');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const DateParts2 = dateU2.split('-');
      const middleNumber = Number.parseInt(dateParts[1], 10);
      const middleNumber2 = Number.parseInt(DateParts2[1], 10);
      if(middleNumber > 12 || middleNumber2 > 12 || Number.parseInt(dateParts[2], 10) > 32 || Number.parseInt(DateParts2[2], 10) > 32 ){
        throw new TypeError('Invalid argument of month in date or day');
      }
    }
};

const resolvers = {
  Query: {
    // eslint-disable-next-line @typescript-eslint/require-await
    users: async () => {
      // vybrat users
      // z db postgres
      return [{ name: 'Nextjs' }];
    },
    // stejne par v v type jako mutation
    // usDb: async () => {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   const usersRef = db.collection(
    //     'dataOfUS',
    //   ) as FirebaseFirestore.CollectionReference<DbUser>;
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //   const docsRefs = await usersRef.listDocuments();
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    //   const docsSnapshotPromises = docsRefs.map((doc) => doc.get());
    //   const docsSnapshots = await Promise.all(docsSnapshotPromises);
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    //   const docs = docsSnapshots.map((doc) => doc.data()!);
    //   console.log(docs);
    // },
    githubUsers: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const users = await axios.get('https://api.github.com/users');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return users.data.map(({ id, login, avatar_url: avatarUrl }) => ({
          id,
          login,
          avatarUrl,
        }));
        // eslint-disable-next-line sonarjs/no-useless-catch
      } catch (error) {
        throw error;
      }
    },
    userdata: async (_context: Context) => {
      const result = await db.collection('UserData').get();
      // funguje
      const data: Array<{
        dataUs: any;
        email: any;
        historyId: any;
        supplierId: any;
      }> = [];

      result.forEach((doc) => {
        const docData = doc.data();

        data.push({
          email: docData.email,
          dataUs: docData.dataUs,
          historyId: docData.historyId,
          supplierId: docData.supplierId,
        });
      });
      console.log(data);
      return data;
    },
    packageData: async (_context: Context) => {
      const result = await db.collection('Package').get();
      // funguje
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
    },
    // packages podle id supp
    suplierData: async (_context: Context) => {
      const result = await db.collection('Supplier').get();
      // funguje
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
        package:[any]
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
          package:docData.package
        });
        console.log('data supplier package', data.map((item) => JSON.stringify(item.package)));
      });

      return data;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    cardValues: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const indexItems: Array<IndexItem> = [
          {
            id: 1,
            image:
              'https://cdnuploads.aa.com.tr/uploads/Contents/2021/11/06/thumbs_b_c_c0f3083541183d22ac6e9ff1e20963bf.jpg?v=023244',
            title: 'Živé zápasy',
            description:
              'Nabízíme přehled odehrávajících se zápasu jako např. týmy, které spolu hrají, skore zápasu a čas hrací doby.',
          },
          {
            id: 2,
            image:
              'https://www.sportszion.com/wp-content/uploads/2020/08/Messi-Camp-Nou-compressed.jpg',
            title: 'Info o hráčích',
            description:
              'Nabízíme informace o hráčích jako jejich počet golu a assistencí v zápasech, které odehrály a za celou sezonu, v jakém týmu hrají, kolik jim je let, jméno a kde působili.',
          },
          {
            id: 3,
            image:
              'https://i2-prod.manchestereveningnews.co.uk/incoming/article18829527.ece/ALTERNATES/s615b/0_false-9PNG.png',
            title: 'Info o zápasu',
            description:
              'Nabízíme informace, které obsahahují držení míče hrajících týmů, počet střel mimo a na bránu, počet ne/úspěšných nahrávek, počet golu, hráči, ktteří hrají v základní sestavě i na lavičce i v rezervách a zraněné.',
          },
          {
            id: 4,
            image: 'https://pbs.twimg.com/media/FmcHmGlWYAIk9V0.jpg',
            title: 'Info o týmech',
            description:
              'Naleznete zde tabulku týmů hrajících v dané soutěži. Budou tam informace typu počet vítězství, remíz a proher, počet bodů a celkový součet podle, kterého se týmy umisťují na daných příčkách.',
          },
        ];

        const values = indexItems; // get(odkaz na api)
        return values.map(({ id, image, title, description }) => ({
          id,
          image,
          title,
          description,
        }));
        // eslint-disable-next-line sonarjs/no-useless-catch
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    // web mutation
    ActualUsToFirestore: async (parent_: any, args: { emailUS: string }) => {
      // console.log(`abcd`, args.emailUS);
      const { emailUS: email } = args;

      // validace email kvuli duplicite
      // Nefunguje return emailu
      if (!email) {
        throw new Error('email is not valid');
      }

      try {
        const newUserDoc = db.collection('UserData').doc();

        const newUser = {
          email,
          dataUs: 'dataUser',
          historyId: 0,
          supplierId: 0,
        };

        await newUserDoc.set(newUser);

        return newUser;
      } catch (error) {
        console.error('Chyba při vytváření uživatele:', error);
        throw error;
      }
    },
    // mutation for admin/supplier, prace se errory + prizpusoben ke create
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
      },
    ) => {
      const {
        weight: hmotnost,
        Plength: delka,
        height: vyska,
        cost: costPackage,
        width: sirka,
        name_package: packName,
        supplier_id: supplierId,
      } = args;
      // prideleni k dodavateli - je
      // pridelovani id_jmeno - je
      // validace parametru na duplicitní zaznamy - neni
      // valiadce na duplicitni balik - neni

      try {
        const UserDoc = await db
        .collection('Supplier')
        .where('supplierId', '==', supplierId).get();
        const supplierDoc = UserDoc.docs[0];
        const existingPackages = supplierDoc.data().package || [];
       
        // if (existingPackages.hasOwnProperty(packName)) {
        //   throw new Error('Package name is not unique');
        // }

        const newPackage = {
          weight: hmotnost,
          cost: costPackage,
          Plength: delka,
          height: vyska,
          width: sirka,
          name_package: packName,
          supplier_id: supplierDoc.id,
          packgeId: `id_${packName}`,
          error: ""
        };

        if(Convert(hmotnost, costPackage, delka, vyska, sirka) && !NoHtmlSpecialChars(packName)){
          newPackage.error = "";
          newPackage.error = Convert(hmotnost, costPackage, delka, vyska, sirka);
        }
        else if(NoHtmlSpecialChars(packName) && !Convert(hmotnost, costPackage, delka, vyska, sirka)){
          newPackage.error = "";
          newPackage.error = NoHtmlSpecialChars(packName)
        }
        else if(NoHtmlSpecialChars(packName) && Convert(hmotnost, costPackage, delka, vyska, sirka)){
          newPackage.error = "";
          newPackage.error = (`${NoHtmlSpecialChars(packName)  }\n${  Convert(hmotnost, costPackage, delka, vyska, sirka)}`)
        }
        else{
          const objectPack: { [key: string]: any } = {};
          objectPack[packName] = {
            weight: hmotnost,
            cost: costPackage,
            Plength: delka,
            height: vyska,
            width: sirka,
            name_package: packName,
            supplier_id: supplierDoc.id,
            packgeId: `id_${packName}`,
          };

          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          existingPackages.push(objectPack);
  
          console.log(existingPackages)
          await supplierDoc.ref.update({package:existingPackages});

          return newPackage;
        }     

        console.log('errors', newPackage.error);
        console.log('ssdsds', JSON.stringify(newPackage));
        return newPackage;
      } catch (error) {
        console.error('Chyba při vytváření balíčku:', error);
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
      },
    ) => {
      // parametry v resolveru stejne jako v type mutation
      const {
        supplierName: SuppName,
        delivery: isDelivered,
        shippingLabel: hasShippingLabel,
        pickUp: PickupPoint,
        foil: hasFoil,
        insurance: InsuranceValue,
        sendCashDelivery: SendCashOnDelivery,
        packInBox: PackageInABox,
      } = args;


      // multi select + kontrola id
      // console.log('foil', typeof hasFoil);
      // console.log('foil', hasFoil === 'true' ? 'Ano' : 'Ne');
      // console.log('foil', hasFoil === 'false' ? 'Ano' : 'Ne');
      // console.log('has', Boolean(hasFoil));

      try {
        // validace jmena - castecne
        // validace datumu - je
        // pridelovani id_jmeno - je

        NoHtmlSpecialChars(SuppName);
        ConverNumb(InsuranceValue);
        ConverBool(
          hasFoil,
          hasShippingLabel,
          SendCashOnDelivery,
          PackageInABox,
        );
        ConverDate(PickupPoint, isDelivered);

        const Supd = await db
          .collection('Supplier')
          .where('suppName', '==', SuppName)
          .get();

        console.log('size', Supd.size);

        if (PickupPoint < isDelivered) {
          throw new Error('Pickup cant be longer then delivery');
        }

        if (Supd.size > 0) {
          // eslint-disable-next-line no-alert
          throw new Error('Supplier name is not unique');
        }

        const newSuppDoc = db.collection('Supplier').doc();

        const newSupp = {
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          packageId: 'any',
          supplierId: newSuppDoc.id,
          suppName: SuppName,
          pickUp: PickupPoint,
          delivery: isDelivered,
          insurance: InsuranceValue,
          shippingLabel: hasShippingLabel,
          foil: hasFoil,
        };

        await newSuppDoc.set(newSupp);
        return newSupp;
      } catch (error) {
        console.error('Chyba při vytváření dovozce', error);
        throw error;
      }
    },
    // update
    ChangeActualUsEmToFirestore: async (
      parent_: any,
      args: { ActualemailUser: string; Email: string },
    ) => {
      // kontrola na duplicitni emaily - je 
      console.log(`abcd`, args.ActualemailUser);
      console.log(`sss`, args.Email);
      const { Email: Newmail } = args;
      const { ActualemailUser: actEm } = args;
      console.log("ememem",Newmail)
      if (!actEm) {
        throw new Error('You must be logged!');
      }
      
     const ValidEmail = (email:string) =>{
      // zakladni validace
        NoHtmlSpecialChars(email);
        // eslint-disable-next-line unicorn/better-regex
        const option = /^[a-z0-9-]+@[a-z]+\.[a-z]+$/
        if(!option.test(email)){
          throw new Error('Ivalid email');
        }
     }
      try {
        const UserDocEm = await db
        .collection('UserData')
        .where('email', '==', Newmail)
        .get();

        const UserDoc = await db
          .collection('UserData')
          .where('email', '==', actEm)
          .get();

        if (UserDoc.empty) {
          throw new Error('User not found');
        }
        ValidEmail(Newmail);
        if(actEm === Newmail){
          throw new Error('The same email as before');
        }
        if(!UserDocEm.empty){
          throw new Error('Alredy taken email');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        UserDoc.forEach(async (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          // zjistit chybu update
          await doc.ref.update({ email: Newmail});
        });

        return {email:Newmail};
      } catch (error) {
        console.error('Chyba při update emailu uživatele', error);
        throw error;
      }
    },
    updatePack: async (
      parent_: any,
      args: {
        weight: number;
        cost: number;
        Plength: number;
        height: number;
        width: number;
        // fromWhere_address: string;
        // fromWhere_PSC: string;
        // where_address: string;
        // where_PSC: string;
        name_package: string;
        // supplier_id: string;
        packId: string
        aNamePack:string,
        // lastSuppId: string
      },
    ) =>{
      // update i u supplier - nebude potřeba
      // refres musi byt i u tabulky po dalsim update
      // kdyz upravim package a jeho supplier je třeba to upravit i u toho starého ? - nebude potřeba
      // porovantavat stare supp id kvuli moznemu update u jineho - nebude potřeba
      const {
        aNamePack:actNamePack,
        packId: id,
        weight: hmotnost,
        Plength: delka,
        // fromWhere_PSC: Podkud,
        height: vyska,
        cost: costPackage,
        // where_PSC: Pkam,
        // where_address: kam,
        // fromWhere_address: odkud,
        width: sirka,
        name_package: packName,
        // supplier_id: supplierId,
        // lastSuppId: lastId,
      } = args;
      try{

        Convert(hmotnost, costPackage, delka, vyska, sirka);
        // PSCVal(Podkud, Pkam);
        // AddressVal(kam, odkud);
        NoHtmlSpecialChars(packName);
        NoHtmlSpecialChars(id);
        NoHtmlSpecialChars(actNamePack);

        console.log("name", packName)
        console.log("name2", actNamePack)

        console.log(id)

        const PackageUp = await db
        .collection('Package')
        .where('packgeId', '==', id)
        .get();

        // const SupUp = await db
        // .collection('Supplier')
        // .where('packageId', '==', `id_${actNamePack}`)
        // .get();

        // validace
        const Pacd = await db
        .collection('Package')
        .where('name_package', '==', packName)
        .get();

          // const Suppd = await db
          // .collection('Supplier')
          // .where('supplierId', '==', supplierId)
          // .get();

          // console.log("ozuzutzutzuz", Suppd.size)
          // // eslint-disable-next-line max-depth
          // if(Suppd.size === 0){
          //   throw new Error('Supplier not found');
          // }
        
        // nefunkcni
      const PackageDuplicate = await db
        .collection('Package')
        .where('height', '==', vyska)
        .where('Plength', '==', delka)
        .where('width', '==', sirka).where('weight', "==", hmotnost).where("name_package", "!=", packName)
        .get();

        console.log(PackageUp.size)
        if (PackageUp.size === 0) {
          throw new Error('Package not found');
        }
        // console.log("id",supplierId)
       
      if (Pacd.size > 0 && packName !== actNamePack) {
        throw new Error('Package name is not unique');
      }
      // kontrola ne plne funkcni
      console.log("duplicate?", PackageDuplicate.size);

      if (PackageDuplicate.size > 1) {
        throw new Error('Duplicate param of package');
      }

      console.log("packgId", id)

      // neapdetuje u supplier!! id

      // SupUp.forEach(async (doc) => {
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      //   await doc.ref.update({  
      //     packageId:`id_${packName}`
      //   });
      // });

      PackageUp.forEach(async (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await doc.ref.update({  
            weight: hmotnost,
            cost: costPackage,
            Plength: delka,
            height: vyska,
            width: sirka,
            // fromWhere_address: odkud,
            // fromWhere_PSC: Podkud,
            // where_address: kam,
            // where_PSC: Pkam,
            // supplier_id: supplierId,
            name_package:packName,
            packgeId: `id_${packName}`
          });
        });

        // pro funkcnost udelat update id u suppliera
        // const idSupp = await db.collection('Supplier').where("packageId", "==", `id_${packName}`).get()
        
        // const sId = idSupp.docs.map((item) => {return item.data().supplierId})

        // Suppd.forEach(async (doc) => {
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        //   await doc.ref.update({  
        //     packageId: id,
        //   });
        // });
        // console.log("isdss", idSupp.size)
        return { 
          weight: hmotnost,
          cost: costPackage,
          Plength: delka,
          height: vyska,
          width: sirka,
          // fromWhere_address: odkud,
          // fromWhere_PSC: Podkud,
          // where_address: kam,
          // where_PSC: Pkam,
          name_package: packName,
          aNamePack:actNamePack,
          // supplier_id: supplierId,
          packId: `id_${packName}`,
        }

      }catch(error){
        console.error('Chyba při update balíčku', error);
        throw error;
      }
    },
    updateSup: async (parent_: any,  args: {
      supplierName: string;
      delivery: string;
      shippingLabel: string;
      pickUp: string;
      foil: string;
      insurance: number;
      sendCashDelivery: string;
      packInBox: string;
      suppId:string,
      packId:string,
    },) =>{
      // Update i u balicků
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
        packId: packgId,
      } = args;

      // console.log('foil', typeof hasFoil);
      // console.log('foil', hasFoil === 'true' ? 'Ano' : 'Ne');
      // console.log('foil', hasFoil === 'false' ? 'Ano' : 'Ne');
      // console.log('has', Boolean(hasFoil));

      try {
        // validace jmena - castecne
        // validace datumu - je
        // pridelovani id_jmeno - je

        NoHtmlSpecialChars(SuppName);
        ConverNumb(InsuranceValue);
        ConverBool(
          hasFoil,
          hasShippingLabel,
          SendCashOnDelivery,
          PackageInABox,
        );
        ConverDate(PickupPoint, isDelivered);

        const Supd = await db
          .collection('Supplier')
          .where('supplierId', '==', id)
          .get();

          const SupdName = await db
          .collection('Supplier')
          .where('suppName', '==', SuppName)
          .get();

          const Package = await db
          .collection('Package')
          .where('packgeId', '==', packgId)
          .get();

        console.log('size', Supd.size);

        if (Supd.size === 0) {
          throw new Error('Supplier not found');
        }

        if (PickupPoint < isDelivered) {
          throw new Error('Pickup cant be longer then delivery');
        }

        if (SupdName.size > 0) {
          throw new Error('Supplier name is not unique');
        }

        if(Package.size === 0){
          throw new Error('Package not found');
        }
       
        Supd.forEach(async (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await doc.ref.update({  
            sendCashDelivery: SendCashOnDelivery,
            packInBox: PackageInABox,
            supplierId: `id_${SuppName}`,
            suppName: SuppName,
            pickUp: PickupPoint,
            delivery: isDelivered,
            insurance: InsuranceValue,
            shippingLabel: hasShippingLabel,
            foil: hasFoil,
          });
        });

        Package.forEach(async (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          // zjistit chybu update
          await doc.ref.update({  
            supplier_id: id,
          });
        });

        return{
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          packageId: packgId,
          supplierId: id,
          suppName: SuppName,
          pickUp: PickupPoint,
          delivery: isDelivered,
          insurance: InsuranceValue,
          shippingLabel: hasShippingLabel,
          foil: hasFoil
        }

      } catch (error) {
        console.error('Chyba při update dovozce', error);
        throw error;
      }
    },
    // Delete
    deletePack: async (parent_: any, args: { id: number }) => {
      // Mazaní vice pack najednou neni mozne
      const { id: PackId } = args;
      let deleted = false;
      console.log('id', PackId);
      const collection = db.collection('Package');
      const snapshot = await collection.where('packgeId', '==', PackId).get();
      // lepsi kontrola
      if (
        !PackId &&
        Number.isSafeInteger(PackId) &&
        PackId &&
        !Number.isSafeInteger(PackId)
      ) {
        throw new Error('Nevalidní id balíčku');
      }
      if (snapshot.empty) {
        throw new Error('Balíček v databázi není'); // ?
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      snapshot.docs[0].ref.delete();
      deleted = true;
      return deleted;
    },
    deletePack2: async (parent_: any, args: { id: [string] }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      // Mazaní vice supp najednou mozne
      const { id: PackIdar } = args;
      console.log('pole', PackIdar);
      const collection = db.collection('Package');
      let deleted = false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      PackIdar.forEach(async function (IdPac) {
        const snapshot = await collection.where('packgeId', '==', IdPac).get();
        // lepsi kontrola
        if (snapshot.empty) {
          throw new Error('Balíček není v databázi');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        snapshot.docs[0].ref.delete();
      });
      deleted = true;
      return deleted;
    },
    deleteSupp: async (parent_: any, args: { id: number }) => {
      // Mazaní vice supp najednou neni mozne
      const { id: PackId } = args;
      let deleted = false;
      const collection = db.collection('Supplier');
      const snapshot = await collection.where('supplierId', '==', PackId).get();
      // lepsi kontrola
      if (
        !PackId &&
        Number.isSafeInteger(PackId) &&
        PackId &&
        !Number.isSafeInteger(PackId)
      ) {
        throw new Error('Nevalidní id dodavatele');
      }
      if (snapshot.empty) {
        throw new Error('Dodavatel není v databázi');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      snapshot.docs[0].ref.delete();
      deleted = true;
      return deleted;
    },
    deleteSupp2: async (parent_: any, args: { id: [string] }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const { id: SupIdar } = args;
      console.log('pole', SupIdar);
      const collection = db.collection('Supplier');
      let deleted = false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      SupIdar.forEach(async function (Idsup) {
        const snapshot = await collection
          .where('supplierId', '==', Idsup)
          .get();
        // lepsi kontrola
        if (snapshot.empty) {
          throw new Error('Dodavatel není v databázi');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        snapshot.docs[0].ref.delete();
      });
      deleted = true;
      return deleted;
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
    console.log(auth);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      // eslint-disable-next-line @typescript-eslint/await-thenable
      user: auth ? await verifyToken(auth) : undefined,
    } as Context;
  },
});
function verifyToken(_auth: string) {
  throw new Error('Function not implemented.');
}

