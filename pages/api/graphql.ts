/* eslint-disable max-depth */
/* eslint-disable complexity */
/* eslint-disable sonarjs/no-ignored-return */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-extra-boolean-cast */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-floating-promises */
import 'firebase/compat/storage';

import { Context } from '@apollo/client';
import axios from 'axios';
import { DecodedIdToken } from 'firebase-admin/auth';
import { gql } from 'graphql-tag';
import { createSchema, createYoga } from 'graphql-yoga';

import { firestore } from '../../firebase/firebase-admin-config';
// import { UserCreate } from '../components/types-user';
import { IndexItem } from '../components-of-home/cards/types';

type MyContext = { user?: DecodedIdToken };

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
    Predict(value:String!, intVal:Int!):Value
    BingoSupPac(width:Int!, weight:Int!, height:Int!, Plength:Int!,  mistoZ:String!, mistoDo:String!, cost:Int!):SuitValue
    ActualUsToFirestore(emailUS: String!): UserData
    AddHistory(userEmail:String!, data:String!):Boolean
    ChangeActualUsEmToFirestore(
      ActualemailUser: String!
      Email: String!
    ): UserChangeEmData

    PackageToFirestore(
      weight: Int!
      cost: Int!
      Plength: Int!
      height: Int!
      width: Int!
      name_package: String!
      supplier_id:String!
      packId:String!
    ): CreatedPack

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
      actNameSupp:String!
    ):Supplier

    deletePack(suppId: String!, key:String!): Delete
    deletePack2(id: [String]): Delete
    deleteSupp(id: Int): Delete
    deleteSupp2(id: [String]): Delete
  }

  scalar JSON

  type Val{
    value:String!
    intVal:Int!
  }

  type ValError{
    message:String!
  }

  union Value = Val | ValError

  type Suitable{
    suitable: String!
  }

  type ErrorMessage{
    message:String!
  }

  union SuitValue = Suitable | ErrorMessage

  type Delete {
    error: String
    deletion:Boolean!
  }

  type SupplierData {
    sendCashDelivery:String!,
    packInBox:String!,
    supplierId:String!,
    suppName:String!,
    pickUp:String!,
    delivery:String!,
    insurance:Int!,
    shippingLabel:String!,
    foil:String!
  }

  type SupplierError{
    message:String!
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
    package:JSON
  }

  type PackageError{
    message:String!
  }

  type PackageDataCreate {
    weight: Int!
    cost: Int!
    Plength: Int!
    height: Int!
    width: Int!
    name_package: String!
    packgeId: String!
    supplier_id:String!
  }

  type Pack{
    data:PackageDataCreate!
  }

  union CreatedPack = Pack | PackageError

  type PackageDataUpdate {
    weight:Int!
    cost:Int!
    Plength:Int!
    height:Int!
    width:Int!
    name_package:String!
    supplier_id:String!
  }

  type UPack{
    data: PackageDataUpdate!
  }

  type PackageUpdateError{
    message:String!
  }

  union UpdatedPack = UPack | PackageUpdateError

  type User {
    name: String
  }

  type GithubUser {
    id: ID!
    login: String!
    avatarUrl: String!
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

// Validace pro package
// const Convert = (
//   // kontrola na zaporne hodnoty - je
//   stringToNum: any,
//   stringToNum2: any,
//   stringToNum3: any,
//   stringToNum4: any,
//   stringToNum5: any,
// ) => {
//   let error = "";
//   if (
//     !Number.isSafeInteger(stringToNum) ||
//     !Number.isSafeInteger(stringToNum2) ||
//     !Number.isSafeInteger(stringToNum3) ||
//     !Number.isSafeInteger(stringToNum4) ||
//     !Number.isSafeInteger(stringToNum5)
//   ) {
//     error = 'Invalid number argument';
//   }

//   if (
//     stringToNum < 0 ||
//     stringToNum2 < 0 ||
//     stringToNum3 < 0 ||
//     stringToNum4 < 0 ||
//     stringToNum5 < 0
//   ) {
//     error = 'Invalid number, argument is less then 0';
//   }

//   return error;
// };

// validace psc - je
// validace adresy - neni
// const PSCVal = (psc: string, psc2: string) => {
//   NoHtmlSpecialChars(psc);
//   NoHtmlSpecialChars(psc2);
//   // kontrola psc aby nebyli === - je
//   // eslint-disable-next-line unicorn/better-regex
//   const option = /^[0-9]{3} ?[0-9]{2}$/;
//   if (!option.test(psc) || !option.test(psc2)) {
//     throw new Error('Invalid psc argument');
//   }
//   if (psc === psc2) {
//     throw new Error(
//       'Invalid psc, argument of first psc doesnt be same like second',
//     );
//   }
// };

// funkcni
// const AddressVal = (address: string, address2: string) => {
//   NoHtmlSpecialChars(address);
//   NoHtmlSpecialChars(address2);
//   // nepodporuje diakritiku!!
//   // nemetchuje Mechov 521, Hradec Kralove
//   // eslint-disable-next-line unicorn/better-regex
//   const option = /^[A-Z][a-z]+ [0-9]{1,3}, [A-Z][a-z]+$/;
//   if (!option.test(address) || !option.test(address2)) {
//     throw new Error('Invalid address argument');
//   }
//   if (address === address2) {
//     throw new Error(
//       'Invalid address, argument of first address doesnt be same like second',
//     );
//   }
// };

// validace pro supplier
const ConverBool = (
  stringnU1: string,
  stringnU2: string,
  stringnU3: string,
  stringnU4: string,
) => {
  console.log(stringnU1)
  console.log(stringnU2)
  console.log(stringnU3)
  console.log(stringnU4)

  if (!["Ano", "Ne"].includes(stringnU1)) {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    console.log("co kontroliujeme?", stringnU1)
    return true;
  }
  if (!["Ano", "Ne"].includes(stringnU2)) {
    console.log("co kontroliujeme?", stringnU2)
    return true;
  }
  if (!["Ano", "Ne"].includes(stringnU3)) {
    console.log("co kontroliujeme?", stringnU3)
    return true;
  }
  if (!["Ano", "Ne"].includes(stringnU4)) {
    console.log("co kontroliujeme?", stringnU4)
    return true;
  }
  return false
};

// funkcni
const ConverDate = (dateU1: any, dateU2: any) => {
  console.log(dateU1)
  // eslint-disable-next-line unicorn/better-regex
  const option = /^[0-9]{4}[-][0-9]{1,2}[-][0-9]{1,2}$/
  if (!option.test(dateU1) || !option.test(dateU2)
  ) {
    return new Error('Invalid argument of date');
  }
  
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, unicorn/prefer-string-slice, @typescript-eslint/restrict-plus-operands
    const dateParts = dateU1.split('-');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const DateParts2 = dateU2.split('-');
    const middleNumber = Number.parseInt(dateParts[1], 10);
    const middleNumber2 = Number.parseInt(DateParts2[1], 10);
    if (middleNumber > 12 || middleNumber2 > 12 || Number.parseInt(dateParts[2], 10) > 32 || Number.parseInt(DateParts2[2], 10) > 32) {
      return new Error('Invalid argument of month in date or day');
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
        package: [any]
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
          package: docData.package
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
     Predict: async (parent_:any, args:{value:string, intVal:number}) => {
      const {value:val, intVal:Num} = args
       if(val === "value"){
        return {
          __typename: "Val",
          value: "Bingoooo!!!!!",
          intVal:Num
        };
      }
      return {
          __typename: "ValError",
          message: "Error! Bad prediction",
      };
    },
    // vhodny balik resolver
    BingoSupPac: async (parent_: any, args: { width: number, weight: number, height: number, Plength: number, mistoZ:string, mistoDo:string, cost:number }) => {
      const { width: Width, weight: Weight, height: Height, Plength: pLength, mistoZ: Z, mistoDo:Do, cost: Pcost } = args
      // Natahnout data
      const packages:any = [];
      const packData:[] = [];
      const rtrnItem:any = [];
      let location:any;

      // 19.12 - omluvenka
      const validargZ = ['personal','depo'].includes(Z)
      const validargDo = ['personal','depo'].includes(Do)

      const suppWithLocationFiled:any = []
      const SupplierDoc = await db
        .collection('Supplier').get();
      
        console.log("id?",Width,Weight,Height,pLength)

      if(Width === 0 || Weight === 0 || Height === 0 || pLength === 0){
        return {
          __typename: "ErrorMessage",
          message:"Ivalid argument, any argument cant be 0"
        }
      }

      if(Width < 0 || Weight < 0 || Height < 0 || pLength < 0 || Pcost < 0){
        return {
          __typename: "ErrorMessage",
          message:"Ivalid argument, any argument cant be less then 0"
        }
      }

      if(!validargZ || !validargDo){
        return {
          __typename: "ErrorMessage",
          message:"Ivalid argument, expexted (personal/depo)"
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      SupplierDoc.docs.map((item:any)=>{
        console.log("iiitm",item)
        if(item._fieldsProto && item._fieldsProto.package && item._fieldsProto.package.arrayValue)
        {// eslint-disable-next-line @typescript-eslint/no-unsafe-return
          console.log(item._fieldsProto.package.arrayValue.values.map((packItem:any) => packages.push(packItem.mapValue.fields)));
        }
        if(item._fieldsProto.location){
          location = item._fieldsProto.location.mapValue.fields
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
          suppWithLocationFiled.push({loc:location, suppId: item._fieldsProto.supplierId.stringValue})
          console.log("itm with location", suppWithLocationFiled)
        }
      })

      // scalar Date - je ten typ!!!!!
      // scalar DateTime - je ten typ!!!!!


      packages.map(packageObj => {
        // Extracting the values from each package object
        const [packageDetails] = Object.values(packageObj);
        packData.push(packageDetails.mapValue.fields)
      })

      // vedet cenu 
      const costSupp = suppWithLocationFiled.map((i:{loc:{depoDelivery:{mapValue:{fields:{delivery:any}}}, personalDelivery:{mapValue:{fields:{delivery:any}}}},suppId:string}) =>{
        // dd
        const depo = i.loc.depoDelivery.mapValue.fields
        const personal = i.loc.personalDelivery.mapValue.fields
        if(depo.delivery.stringValue === Z && depo.delivery.stringValue === Do){
          return {idS:i.suppId, cost: 2 * Number(depo.cost.integerValue)}
        }
        // pd
        if(personal.delivery.stringValue === Z && depo.delivery.stringValue === Do){
          return {idS:i.suppId, cost: Number(personal.cost.integerValue) + Number(depo.cost.integerValue)}
        }
        
        // dp
        if(depo.delivery.stringValue === Z && personal.delivery.stringValue === Do ){
          return {idS:i.suppId, cost: Number(depo.cost.integerValue) + Number(personal.cost.integerValue)}
        }
        // pp
       return {idS:i.suppId, cost: 2 * Number(personal.cost.integerValue)}
      })

      const IsItSuppWithLoc = (loc:[], sId:string) => {
        // console.log("loc",loc)
        // console.log("true", loc.find((itm:any) => {return itm.suppId === sId}))
        return loc.find((itm:any) => {return itm.suppId === sId})
      }

      const CostOfPack = (costSup:any, pack:any) =>{
        let sumCost = 0;
        for (const e of costSup) {
          if(pack.supplier_id.stringValue === e.idS){
            sumCost = Number(e.cost) + Number(pack.cost.integerValue)
            console.log("tak cooo tam je",sumCost, e.idS)
            return sumCost
          }        
        }
      }

      // prilepim cenu
      const packCost = packData.map((item:{Plength:number, width:number, weight:number, height:number, supplier_id:string, cost:number, name_package:string})=>{
        if(IsItSuppWithLoc(suppWithLocationFiled, item.supplier_id.stringValue)) {
          const cost =  CostOfPack(costSupp, item);
          return {supplierId:item.supplier_id.stringValue, Cost:cost, Name: item.name_package.stringValue,param:{width:Number(item.weight.integerValue), length: Number(item.Plength.integerValue), weight: Number(item.weight.integerValue), height:Number(item.height.integerValue)}}
        }        
        return {supplierId:item.supplier_id.stringValue, Cost:Number(item.cost.integerValue), Name: item.name_package.stringValue, param:{width:Number(item.weight.integerValue), length: Number(item.Plength.integerValue), weight: Number(item.weight.integerValue), height:Number(item.height.integerValue)}}
      })

      console.log("sorted",JSON.stringify(packCost))

      
      // Filtrace nevyhovujících dat dle ceny     
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, array-callback-return, consistent-return
      const suitableByCost = packCost.map((item: any) => { if(Pcost >= Number(item.Cost)) {return item}});
      console.log("filter by cost",JSON.stringify(suitableByCost))

      // Filtrace dle parametru
      // nebrat i moc velké
    const suitableByParam = suitableByCost.map((itm: {Cost:number, supplierId:string, Name:string,param:{width:number,length:number,weight:number,height:number}}) =>{
      // eslint-disable-next-line sonarjs/no-collapsible-if
      // hmotnost
      if(itm){
        if(itm.param.width > Width) { console.log("nejvetší sirka", itm.param, itm.Name) }
        // eslint-disable-next-line unicorn/no-lonely-if
        if(itm.param?.width >= Width && itm.param?.weight >= Weight && itm.param?.length >= pLength && itm.param?.height >= Height){
          console.log(itm)         
          return itm
        }
      }
        
    })

    console.log("filter by param",suitableByParam)

      suitableByParam.forEach((item:any) =>{
        console.log("ssssssss",item)
        if(item){
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          rtrnItem.push({suppId:item.supplierId,cost:item.Cost,name:item.Name})
        }
      })
      
      if(rtrnItem.length > 0){
        console.log("suitable item",rtrnItem); 
        return {       
        __typename: "Suitable",
        suitable:JSON.stringify(rtrnItem)
        }
      }
      return {
        __typename: "ErrorMessage",
        message:"Any suitable supplier"
      };
   
    },
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
    AddHistory: async (parent_, args: { userEmail: string, data:string}) =>{
      const {userEmail:usEm, data:dataS} = args
      // pridat err msg
      // kdyz se cena zmeni a udela save na tom samém změni se cena, kdyz ne tak se neprida
      try {
        const newHistoryDoc = db.collection('History').doc();
        const data = JSON.parse(dataS)

        const sData = data.data.suppData;
        const sPrice = data.data.priceS;
        const toFirestore = {id:sData.supplierId, name:sData.suppName, pickup:sData.pickUp, delivery:sData.delivery, insurance:sData.insurance, shippingLabel:sData.shippingLabel, sendCashDelivery:sData.sendCashDelivery, packInBox:sData.packInBox, foil:sData.foil, cost:sPrice}
        
        const newHistory = {
          email:usEm,
          dataForm: data.formData.dataFrForm,
          historyId: newHistoryDoc.id,
          suppData:toFirestore
        };

        const dataInColl = await db.collection('History').get()

        const duplicateByParam = dataInColl.docs.map((item:any)=>{
          console.log("iiiiiiiiiiiiiiiiiiiii", item._fieldsProto.suppData.mapValue.fields)
          const byForm = item._fieldsProto.dataForm.mapValue.fields;
          const byCost = item._fieldsProto.suppData.mapValue.fields.cost.integerValue;
          if(item._fieldsProto.suppData.mapValue.fields.id.stringValue === sData.supplierId){
            return byForm.width.stringValue === data.formData.dataFrForm.width && byForm.height.stringValue === data.formData.dataFrForm.height && byForm.weight.stringValue === data.formData.dataFrForm.weight && byForm.plength.stringValue === data.formData.dataFrForm.plength && byForm.placeTo.stringValue === data.formData.dataFrForm.placeTo && byForm.placeFrom.stringValue === data.formData.dataFrForm.placeFrom &&  Number(byCost) === Number(data.data.priceS) ? item : undefined
          }
        })

        if(!duplicateByParam.map((e) =>{return !!e}).includes(true)){
          await newHistoryDoc.set(newHistory);
        }
        
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
        packId: string
      },
      context: MyContext
    ) => {
      const {
        weight: hmotnost,
        Plength: delka,
        height: vyska,
        cost: costPackage,
        width: sirka,
        name_package: packName,
        supplier_id: supplierId,
        packId: ID
      } = args;
      // mozné rekurzivní volaní kvuli kontrole duplicitnich id - není
      // Refactorizace kodu, mozne if zbytecné

      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      // admin divny
      console.log("databaze user",context.user)
      // if(context.user?.email !== Admin){
      //   return {
      //     __typename: "PackageError",
      //     message: "Only admin can use this function"
      //   }
      // }

      if (hmotnost < 0 || delka < 0 || vyska < 0 || costPackage < 0 || sirka < 0) {
        return {
          __typename: "PackageError",
          message: "Any of parameter that expect number dont support negative number"
        }
      }

      if (hmotnost === 0 || delka === 0 || vyska === 0 || costPackage === 0 || sirka === 0) {
        return {
          __typename: "PackageError",
          message: "Any of parameter that expect number dont support 0"
        }
      }
      // try {
        // vyresit graphql error
        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', supplierId).get();

          if (SupplierDoc.size === 0) {
            return {
              __typename: "PackageError",
              message: "Supplier not found"
            }
          }

        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages = supplierDoc.data().package || [];
        const dupPackages: any = [];
        let dupName = ""

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
          const keys = Object.keys(item)[0]
          console.log(keys)
          return keys.includes(ID)
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        existingPackages.forEach((item: { [name: string]: { weight: number, height: number, width: number, Plength: number, name_package: string } }) => {
          // jmeno balicku
          const nameItm = Object.keys(item)[0];
          const itm = item[nameItm];
          console.log("itm", itm)
          // kontrola jmén
          if (itm.name_package === packName) {
            dupName = itm.name_package
          }
          // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
          if (itm.weight === newPackage.weight && itm.height === newPackage.height && itm.width === newPackage.width && itm.Plength === newPackage.Plength) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            dupPackages.push(itm)
            console.log("selected", itm)
          }
        })
        console.log("keypack", keyPack)
        console.log("duplicate pack", dupPackages)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (keyPack.includes(true)) {
          return {
            __typename: "PackageError",
            message: "Duplicate id"
          }
        }
       
        if (dupName.length > 0) {
          return {
            __typename: "PackageError",
            message: "Name is already in use"
          }
        }

        if (dupPackages.length > 0) {
          return {
            __typename: "PackageError",
            message: "This params have alerady another package"
          }     
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

        console.log(existingPackages)
        await supplierDoc.ref.update({ package: existingPackages });        

        console.log('ssdsds', JSON.stringify(newPackage));

        return {
          __typename: "Pack",
          data: newPackage
        }      
      // } catch (error) {
      //   console.error('Chyba při vytváření balíčku:', error);
      //   throw error;
      // }
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
      context: MyContext
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
      } = args;

      // try catch u vsech resolveru
      // try {
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        // if(context.user?.email !== Admin){
        //   return {
        //     __typename: "SupplierError",
        //     message: "Only admin can use this function"
        //   }
        // }

        if(ConverDate(PickupPoint, isDelivered)?.message){
          return {
            __typename: "SupplierError",
            message: "Provided date is not valid"
          }
        }

        if(ConverBool(
          hasFoil,
          hasShippingLabel,
          SendCashOnDelivery,
          PackageInABox,
        ) === true){
            return{
              __typename: "SupplierError",
              message: "Provided data is not in valid format (Ano/Ne)"
            }
        }

        if(InsuranceValue < 0){
          return{
            __typename: "SupplierError",
            message: "Insurance cant be less then zero"
          }
        }

        if (PickupPoint < isDelivered) {
          return{
            __typename: "SupplierError",
            message: "Pickup cant be longer then delivery"
          }
        }
        
        const Supd = await db
          .collection('Supplier')
          .where('suppName', '==', SuppName)
          .get();

        console.log('size', Supd.size);

        if (Supd.size > 0) {
          return {
            __typename: "SupplierError",
            message: "Supplier name is already in use"
          }
        }

        const newSuppDoc = db.collection('Supplier').doc();

        
        const location = {depoDelivery:{cost:20, delivery:"depo"}, personalDelivery:{cost:40, delivery:"personal"}}

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
          location
        };

        await newSuppDoc.set(newSupp);

        return {
          __typename: "Supp",
          data:newSupp
        };
      // } catch (error) {
      //   console.error('Chyba při vytváření dovozce', error);
      //   throw error;
      // }
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
      console.log("ememem", Newmail)
      if (!actEm) {
        throw new Error('You must be logged!');
      }

      const ValidEmail = (email: string) => {
        // zakladni validace
        // eslint-disable-next-line unicorn/better-regex
        const option = /^[a-z0-9-]+@[a-z]+\.[a-z]+$/
        if (!option.test(email)) {
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
        if (actEm === Newmail) {
          throw new Error('The same email as before');
        }
        if (!UserDocEm.empty) {
          throw new Error('Alredy taken email');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        UserDoc.forEach(async (doc) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          // zjistit chybu update
          await doc.ref.update({ email: Newmail });
        });

        return { email: Newmail };
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
        name_package: string;
        supplier_id: string;
        PackKey: string
      },
      context: MyContext
    ) => {
      // update nedokoncen!!!
      // update i u supplier - nebude potřeba
      // refres musi byt i u tabulky po dalsim update
      // kdyz upravim package a jeho supplier je třeba to upravit i u toho starého ? - nebude potřeba
      // porovantavat stare supp id kvuli moznemu update u jineho - nebude potřeba
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
      // try { UPack | PackageError

      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      // if(context.user?.email !== Admin){
      //   return {
      //     __typename: "PackageUpdateError",
      //     message: "Only admin can use this function"
      //   }
      // }
      if (hmotnost < 0 || delka < 0 || vyska < 0 || costPackage < 0 || sirka < 0) {
        return {
          __typename: "PackageUpdateError",
          message: "Any of parameter that expect number dont support negative number"
        }
      }

      if (hmotnost === 0 || delka === 0 || vyska === 0 || costPackage === 0 || sirka === 0) {
        return {
          __typename: "PackageUpdateError",
          message: "Any of parameter that expect number dont support 0"
        }
      }

        const SupplierDoc = await db
          .collection('Supplier')
          .where('supplierId', '==', supplierId).get();

          if (SupplierDoc.size === 0) {
            return {
              __typename: "PackageUpdateError",
              message: "Supplier not found"
            }
          }

        const supplierDoc = SupplierDoc.docs[0];
        const existingPackages = supplierDoc.data().package || [];
        const dupPackages: any = [];
        let dupName = ""

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
        // const keyPack = existingPackages.map((item: any) => {
        //   // Vybrat vsechny,Ignorovat updated
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        //   const keys = Object.keys(item).filter((keyItem) => (keyItem !== id));
        //   return keys.includes(packName)
        // })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        existingPackages.filter((item: any) => { return !item[id] }).forEach((item: { [name: string]: { weight: number, height: number, width: number, Plength: number, name_package:string } }) => {
          // Vybrat vsechny,Ignorovat updated
          // jmeno balicku
          const nameItm = Object.keys(item)[0];
          const itm = item[nameItm];
          console.log("itm", itm)
          // kontrola jmén
          if (itm.name_package === packName) {
            dupName = itm.name_package
          }
          // eslint-disable-next-line @typescript-eslint/no-for-in-array, guard-for-in
          if (itm.weight === UpdatePackage.weight && itm.height === UpdatePackage.height && itm.width === UpdatePackage.width && itm.Plength === UpdatePackage.Plength) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            dupPackages.push(itm)
            console.log("selected", itm)
          }
        })
       
        if (dupName.length > 0) {
          return {
            __typename: "PackageUpdateError",
            message: "Name is already in use"
          }
        }

        if (dupPackages.length > 0) {
          return {
            __typename: "PackageUpdateError",
            message: "This params have alerady another package"
          }     
        }
          
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          existingPackages.forEach((item: { [name: string]: { weight: number, height: number, width: number, Plength: number, cost: number, name_package: string } }) => {
            // najdi update item 
            const updatetedItem = item;

            // eslint-disable-next-line sonarjs/no-collapsible-if, unicorn/no-lonely-if
            if (updatetedItem[id]) {
              // eslint-disable-next-line unicorn/no-lonely-if, max-depth
              console.log("name itm", id)
              updatetedItem[id].weight = hmotnost
              updatetedItem[id].cost = costPackage
              updatetedItem[id].Plength = delka
              updatetedItem[id].height = vyska
              updatetedItem[id].width = sirka
              updatetedItem[id].name_package = packName
              console.log("update with same name", updatetedItem[id])
            }
          })

          console.log(existingPackages)

        await supplierDoc.ref.update({ package: existingPackages });
        console.log('ssdsds', JSON.stringify(UpdatePackage));
        return {
          __typename: "UPack",
          data: UpdatePackage
        }
      // } catch (error) {
      //   console.error('Chyba při update balíčku', error);
      //   throw error;
      // }
    },
    updateSup: async (parent_: any, args: {
      supplierName: string;
      delivery: string;
      shippingLabel: string;
      pickUp: string;
      foil: string;
      insurance: number;
      sendCashDelivery: string;
      packInBox: string;
      suppId: string,
      actNameSupp: string
    },     
    context: MyContext
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
        actNameSupp: ActName
      } = args;

      // lepsi využití erroru
     // predelani erroru
      // try {
        // kontrola jedinecnych jmen - je
        // validace jmena - castecne
        // validace datumu - je
        const Admin = process.env.NEXT_PUBLIC_AdminEm;
        // if(context.user?.email !== Admin){
        //   return {
        //     __typename: "SupplierError",
        //     message: "Only admin can use this function"
        //   }
        // }
        if(ConverDate(PickupPoint, isDelivered)?.message){
          return {
            __typename: "SupplierError",
            message: "Provided date is not valid"
          }
        }

        if(ConverBool(
          hasFoil,
          hasShippingLabel,
          SendCashOnDelivery,
          PackageInABox,
        ) === true){
            return{
              __typename: "SupplierError",
              message: "Provided data is not in valid format (Ano/Ne)"
            }
        }

        const Supd = await db
          .collection('Supplier')
          .where('supplierId', '==', id)
          .get();

          
        if (Supd.size === 0) {
          return {
          __typename: "SupplierError",
          message: "Supplier not found"
        }
      }

        const SupplierDoc = await db
          .collection('Supplier').get()

        const docs = SupplierDoc.docs.map(doc => doc.data());

        const docsWithoutCurrentSupp = docs.filter((doc) => doc.suppName !== ActName);

        const duplicateSupp = docsWithoutCurrentSupp.find((item) => item.suppName === SuppName)

        if (duplicateSupp) {
          return {
            __typename: "SupplierError",
            message: "Supplier name is already in use"
          }
        }

        if (PickupPoint < isDelivered) {
          return {
            __typename: "SupplierError",
            message: "Pickup cant be longer then delivery"
          }
        }

        if(InsuranceValue < 0){
          return{
            __typename: "SupplierError",
            message: "Insurance cant be less then zero"
          }
        }

        const location = {depoDelivery:{cost:35, delivery:"depo"}, personalDelivery:{cost:45, delivery:"personal"}}
        
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
              location
            });
          })
        

        const newSupp = {
          sendCashDelivery: SendCashOnDelivery,
          packInBox: PackageInABox,
          suppName: SuppName,
          pickUp: PickupPoint,
          delivery: isDelivered,
          insurance: InsuranceValue,
          shippingLabel: hasShippingLabel,
          foil: hasFoil,
          supplierId:id
        }

        return {
          __typename: "Supp",
          data:newSupp
        };

      // } catch (error) {
      //   console.error('Chyba při update dovozce', error);
      //   throw error;
      // }
    },
    deletePack: async (parent_: any, args: { key: string, suppId: string }
      ) => {
      // kontrola admina
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      // if(context.user?.email !== Admin){
      //   return {
      //     __typename: "SupplierError",
      //     message: "Only admin can use this function"
      //   }
      // }
        
      const { key: Pack, suppId: Sid } = args;
      let deleted = false;
      let err = "";
      let find = false;
      let newArray = [];
      console.log('id', Pack);
      console.log('id', Sid);


      const SupplierDoc = await db
        .collection('Supplier')
        .where('supplierId', '==', Sid).get();
      const supplierDoc = SupplierDoc.docs[0];
      const existingPackages = supplierDoc.data().package || [];


      if (supplierDoc.exists) {
        if (existingPackages) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          newArray = existingPackages.filter((item: any) => !item[Pack]);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          find = Boolean(existingPackages.filter((item: any) => !item[Pack]));
          console.log("newARR", newArray)
          console.log("ffffind", find)
        }
        else {
          err = "Nothing to delete"
        }
        if (find) {
          await supplierDoc.ref.update({ package: newArray });
          deleted = true
        }
        else {
          err = "Package not found"
        }
      } else {
        err = "Supplier not found"
      }
      return { deletion: deleted, error: err }
    },
    deletePack2: async (parent_: any, args: { id: [string] }) => {
      // nepouziva se v projektu
      let err = "";
      // kontrola admin
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      // if(context.user?.email !== Admin){
      //   return {
      //     __typename: "SupplierError",
      //     message: "Only admin can use this function"
      //   }
      // }
      const { id: PackIdar } = args;
      console.log('pole', PackIdar);
      const collection = db.collection('Package');
      let deleted = false;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      PackIdar.forEach(async function (IdPac) {
        const snapshot = await collection.where('packgeId', '==', IdPac).get();
        // lepsi kontrola
        if (snapshot.empty) {
          err = 'Balíček není v databázi';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        snapshot.docs[0].ref.delete();
      });
      deleted = true;
      return { deletion: deleted, error: err }
    },
    deleteSupp: async (parent_: any, args: { id: number }) => {
      // nepouziva se
      let deleted = false;
      let err = "";
      // kontrola admina
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      // if(context.user?.email !== Admin){
      //   return {
      //     __typename: "SupplierError",
      //     message: "Only admin can use this function"
      //   }
      // }
      const { id: PackId } = args;
      const collection = db.collection('Supplier');
      const snapshot = await collection.where('supplierId', '==', PackId).get();
      if (
        !PackId &&
        Number.isSafeInteger(PackId) &&
        PackId &&
        !Number.isSafeInteger(PackId)
      ) {
        err = 'Nevalidní id dodavatele';
      }
      if (snapshot.empty) {
        err = 'Dodavatel není v databázi';
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      snapshot.docs[0].ref.delete();
      deleted = true;
      return { deletion: deleted, error: err };
    },
    deleteSupp2: async (parent_: any, args: { id: [string] }) => {
      let deleted = false;
      let err = "";
      // kontrola admina
      const Admin = process.env.NEXT_PUBLIC_AdminEm;
      // if(context.user?.email !== Admin){
      //   return {
      //     __typename: "SupplierError",
      //     message: "Only admin can use this function"
      //   }
      // }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const { id: SupIdar } = args;
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
        snapshot.docs[0].ref.delete();
      });
      deleted = true;
      return { deletion: deleted, error: err };
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

