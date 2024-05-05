import 'firebase/compat/storage';

import { State } from '@hookstate/core';

import {
  ErrSetterProperties,
  ErrSettersPropertiesFromData,
  ErrSettersPropertiesSuppCreateUpdate,
  Package,
  PackageType,
} from '../copmonents/types/types';

const ParseIntReliable = (numArg: string) => {
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  return false;
};

const IsInt = (numArg: string | undefined, min: number) => {
  const parsed = ParseIntReliable(numArg || '');

  return parsed !== false && parsed >= min;
};

const IsInGoodFormat = (
  validationFor: string,
  data: {
    dataSupp?: {
      packInBox: string;
      shippingLabel: string;
      foil: string;
      sendCashDelivery: string;
    };
    dataForm?: { depo: string; personal: string };
  },
  message: { messageSupp?: string; messageFormData?: string },
  errSetterSupp?: State<ErrSettersPropertiesSuppCreateUpdate>,
  errSetterForm?: State<ErrSettersPropertiesFromData>,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (data.dataForm && message.messageFormData && validationFor === 'form') {
    if (!['depo', 'personal'].includes(data.dataForm.depo)) {
      errSetterForm?.errPlaceTo.set(message.messageFormData);
      return new Error(message.messageFormData);
    }

    if (!['depo', 'personal'].includes(data.dataForm.personal)) {
      errSetterForm?.errFrom.set(message.messageFormData);
      return new Error(message.messageFormData);
    }
    return undefined;
  }

  if (data.dataSupp && message.messageSupp && validationFor === 'supplier') {
    if (!['Yes', 'No'].includes(data.dataSupp.packInBox)) {
      errSetterSupp?.errPackInBox.set(message.messageSupp);
      return new Error(message.messageSupp);
    }

    if (!['Yes', 'No'].includes(data.dataSupp.shippingLabel)) {
      errSetterSupp?.errShippingLabel.set(message.messageSupp);
      return new Error(message.messageSupp);
    }

    if (!['Yes', 'No'].includes(data.dataSupp.foil)) {
      errSetterSupp?.errFoil.set(message.messageSupp);
      return new Error(message.messageSupp);
    }

    if (!['Yes', 'No'].includes(data.dataSupp.sendCashDelivery)) {
      errSetterSupp?.errSendCashDelivery.set(message.messageSupp);
      return new Error(message.messageSupp);
    }
    return undefined;
  }
  return new Error('Nebyla správně vybrána operace pro validaci');
};

const ValidateNumberPartPack = (
  data: {
    weight?: string;
    cost?: string;
    pLength?: string;
    height?: string;
    width?: string;
  },
  min: number,
  msgErr: string,
  errState?: State<ErrSetterProperties>,
) => {
  if (!IsInt(data?.weight, min)) {
    errState?.errWeight.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.cost, min)) {
    errState?.errCost.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.pLength, min)) {
    errState?.errpLength.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.height, min)) {
    errState?.errHeight.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.width, min)) {
    errState?.errWidth.set(msgErr);
    return new Error(msgErr);
  }

  return undefined;
};

const ValidateNumberPartSupp = (
  data: {
    insurance?: string;
    depoCost?: string;
    personalCost?: string;
  },
  min: number,
  msgErr: string,
  errState?: State<ErrSettersPropertiesSuppCreateUpdate>,
) => {
  if (!IsInt(data?.insurance, min)) {
    errState?.errInsurance.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.depoCost, min)) {
    errState?.errDepoCost.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.personalCost, min)) {
    errState?.errPersonalCost.set(msgErr);
    return new Error(msgErr);
  }
  return undefined;
};

const ValidateNumberPartChooseSupp = (
  data: {
    weight?: string;
    cost?: string;
    pLength?: string;
    height?: string;
    width?: string;
  },
  min: number,
  msgErr: string,
  errState?: State<ErrSettersPropertiesFromData>,
) => {
  if (!IsInt(data?.weight, min)) {
    errState?.errWeight.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.cost, min)) {
    errState?.errCost.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.pLength, min)) {
    errState?.errLength.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.height, min)) {
    errState?.errHeight.set(msgErr);
    return new Error(msgErr);
  }

  if (!IsInt(data?.width, min)) {
    errState?.errWidth.set(msgErr);
    return new Error(msgErr);
  }

  return undefined;
};

const NumberValdation = (
  operation: string,
  min: number,
  msgErr: string,
  data: {
    weightarg?: string;
    costarg?: string;
    pLengtharg?: string;
    heightarg?: string;
    widtharg?: string;
    insurancearg?: string;
    depoCostarg?: string;
    personalCostarg?: string;
  },
  errStatePack?: State<ErrSetterProperties>,
  errStateSupp?: State<ErrSettersPropertiesSuppCreateUpdate>,
  errStateForm?: State<ErrSettersPropertiesFromData>,
) => {
  if (operation === 'packCreate' || operation === 'packUpdate') {
    return ValidateNumberPartPack(
      {
        weight: data.weightarg,
        width: data.widtharg,
        pLength: data.pLengtharg,
        height: data.heightarg,
        cost: data.costarg,
      },
      min,
      msgErr,
      errStatePack,
    );
  }

  if (operation === 'suppCreate' || operation === 'suppUpdate') {
    return ValidateNumberPartSupp(
      {
        insurance: data.insurancearg,
        depoCost: data.depoCostarg,
        personalCost: data.personalCostarg,
      },
      min,
      msgErr,
      errStateSupp,
    );
  }

  if (operation === 'chooseSupp') {
    return ValidateNumberPartChooseSupp(
      {
        weight: data.weightarg,
        width: data.widtharg,
        cost: data.costarg,
        pLength: data.pLengtharg,
        height: data.heightarg,
      },
      min,
      msgErr,
      errStateForm,
    );
  }
  return new Error('Nebyla správně vybraná operace');
};

const IsWithErrors = (errors: {
  packPart: Error | undefined;
  suppPart: {
    numValidation: Error | undefined;
    formatValidatiom: Error | undefined;
  };
  chooseSupPart: {
    numValidation: Error | undefined;
    formatValidatiom: Error | undefined;
  };
}) => {
  if (errors.chooseSupPart.formatValidatiom) {
    return errors.chooseSupPart.formatValidatiom;
  }

  if (errors.chooseSupPart.numValidation) {
    return errors.chooseSupPart.numValidation;
  }

  if (errors.suppPart.formatValidatiom) {
    return errors.suppPart.formatValidatiom;
  }

  if (errors.suppPart.numValidation) {
    return errors.suppPart.numValidation;
  }

  if (errors.packPart) {
    return errors.packPart;
  }

  return undefined;
};

export const GetCost = (
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

// eslint-disable-next-line complexity
export const Validation = (
  operation: string,
  data: {
    packageData?: {
      weight: string;
      cost: string;
      pLength: string;
      height: string;
      width: string;
    };
    suppData?: {
      pickUp: string;
      delivery: string;
      insurance: string;
      sendCashDelivery: string;
      foil: string;
      shippingLabel: string;
      packInBox: string;
      depoCost: string;
      personalCost: string;
    };
    formData?: {
      weight: string;
      cost: string;
      pLength: string;
      height: string;
      width: string;
      depo: string;
      personal: string;
    };
  },
  errState: any,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const errorFromValidation: {
    packPart: Error | undefined;
    suppPart: {
      numValidation: Error | undefined;
      formatValidatiom: Error | undefined;
    };
    chooseSupPart: {
      numValidation: Error | undefined;
      formatValidatiom: Error | undefined;
    };
  } = {
    packPart: undefined,
    suppPart: {
      numValidation: undefined,
      formatValidatiom: undefined,
    },
    chooseSupPart: {
      numValidation: undefined,
      formatValidatiom: undefined,
    },
  };
  const messageInt = 'Očekává se číslo';
  const messageDate =
    'Očekává se minimálně aktuální datum ve formě (DD/MM/YYYY)';
  const messageYesNo = 'Očekává se hodnota (Yes/No)';
  const messageDepoPersonal = 'Očekává se hodnota (depo/personal)';

  if (operation === 'packUpdate' || operation === 'packCreate') {
    errorFromValidation.packPart = NumberValdation(
      operation,
      1,
      `${messageInt} větší nebo rovné jedničce`,
      {
        weightarg: data.packageData?.weight,
        costarg: data.packageData?.cost,
        pLengtharg: data.packageData?.pLength,
        heightarg: data.packageData?.height,
        widtharg: data.packageData?.width,
        insurancearg: data.suppData?.insurance,
        depoCostarg: data.suppData?.depoCost,
        personalCostarg: data.suppData?.personalCost,
      },
      errState as State<ErrSetterProperties>,
      errState as State<ErrSettersPropertiesSuppCreateUpdate>,
    );
  }

  if (operation === 'suppCreate' || operation === 'suppUpdate') {
    errorFromValidation.suppPart.numValidation = NumberValdation(
      operation,
      0,
      `${messageInt} větší nebo rovné nule`,
      {
        weightarg: data.packageData?.weight,
        costarg: data.packageData?.cost,
        pLengtharg: data.packageData?.pLength,
        heightarg: data.packageData?.height,
        widtharg: data.packageData?.width,
        insurancearg: data.suppData?.insurance,
        depoCostarg: data.suppData?.depoCost,
        personalCostarg: data.suppData?.personalCost,
      },
      errState as State<ErrSetterProperties>,
      errState as State<ErrSettersPropertiesSuppCreateUpdate>,
    );
    errorFromValidation.suppPart.formatValidatiom = IsInGoodFormat(
      'supplier',
      {
        dataSupp: {
          packInBox: data.suppData?.packInBox ?? '',
          shippingLabel: data.suppData?.shippingLabel ?? '',
          foil: data.suppData?.foil ?? '',
          sendCashDelivery: data.suppData?.sendCashDelivery ?? '',
        },
      },
      { messageSupp: messageYesNo },
      errState as State<ErrSettersPropertiesSuppCreateUpdate>,
    );
    if (
      !data.suppData ||
      data.suppData.delivery === 'invalidDate' ||
      data.suppData.delivery === 'disablePast'
    ) {
      return new Error(messageDate);
    }

    if (
      !data.suppData ||
      data.suppData.pickUp === 'invalidDate' ||
      data.suppData.pickUp === 'disablePast'
    ) {
      return new Error(messageDate);
    }
  }

  if (operation === 'chooseSupp') {
    errorFromValidation.chooseSupPart.numValidation = NumberValdation(
      operation,
      0,
      `${messageInt} větší nebo rovné nule`,
      {
        weightarg: data.formData?.weight,
        costarg: data.formData?.cost,
        pLengtharg: data.formData?.pLength,
        heightarg: data.formData?.height,
        widtharg: data.formData?.width,
      },
      errState as undefined,
      errState as undefined,
      errState as State<ErrSettersPropertiesFromData>,
    );

    errorFromValidation.chooseSupPart.formatValidatiom = IsInGoodFormat(
      'form',
      {
        dataForm: {
          depo: data.formData?.depo ?? '',
          personal: data.formData?.personal ?? '',
        },
      },
      { messageFormData: messageDepoPersonal },
      errState as undefined,
      errState as State<ErrSettersPropertiesFromData>,
    );
  }

  return IsWithErrors(errorFromValidation);
};

export const ToDateInNumForm = (date: string) => {
  const newDate = new Date(date);
  return `${newDate.getDate()}-${newDate.getMonth()}-${newDate.getFullYear()}`;
};

export const CheckIfisThereDoc = (
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

// eslint-disable-next-line complexity
export const Request = async (
  collections: {
    historyCol?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
    supplierCol?: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
  },
  filter?: Array<string>,
  id?: string,
) => {
  const data: Array<object> | undefined = [];

  // history
  try {
    if (collections.historyCol && filter && id) {
      const document = collections.historyCol.where('historyId', '==', id);

      filter.forEach(async (field) => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        (await document.select(field).get()).forEach((doc) => {
          data.push(doc.data());
        });
      });
    }

    if (collections.historyCol && filter) {
      const documents = collections.historyCol;

      filter.forEach(async (field) => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        (await documents.select(field).get()).forEach((doc) => {
          data.push({ property: field, data: doc.data() });
        });
      });
    }

    if (collections.historyCol && id) {
      const documents = await collections.historyCol
        ?.where('historyId', '==', id)
        .get();

      documents.forEach((doc) => {
        data.push(doc.data());
      });
    }

    if (collections.historyCol) {
      const documets = await collections.historyCol.get();

      documets.forEach((doc) => {
        data.push(doc.data());
      });
    }

    // suppp
    if (collections.supplierCol && filter && id) {
      const document = collections.supplierCol?.where('supplierId', '==', id);
      filter.forEach(async (field) => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        (await document.select(field).get()).forEach((doc) => {
          data.push(doc.data());
        });
      });
    }

    if (collections.supplierCol && filter) {
      const documents = collections.supplierCol;
      filter.forEach(async (field) => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        (await documents.select(field).get()).forEach((doc) => {
          doc.data();
        });
      });
    }

    if (collections.historyCol && id) {
      const document = await collections.supplierCol
        ?.where('supplierId', '==', id)
        .get();
      document?.forEach((doc) => {
        doc.data();
      });
    }

    if (collections.historyCol) {
      const documents = await collections.supplierCol?.get();

      documents?.forEach((doc) => {
        data.push(doc.data());
      });
    }

    return data;
  } catch {
    return data;
  }
};

export const GetDocsPack = (
  doc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  sID: string,
  packageName: string,
) => {
  const docs: Array<
    FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
  > = [];
  for (const document of doc.docs) {
    const item = document.data();
    if (item.suppData.id === sID && item.suppData.packName === packageName) {
      docs.push(document);
    }
  }
  return docs;
};

export const GetDocSupp = (
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

export const GetPackName = (
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

export const IsInGoodForm = (
  string1: string,
  string2: string,
  string3: string,
  string4: string,
) => {
  return (
    ['Yes', 'No'].includes(string1) &&
    ['Yes', 'No'].includes(string2) &&
    ['Yes', 'No'].includes(string3) &&
    ['Yes', 'No'].includes(string4)
  );
};

export const LookWhichIsBetter = (item: PackageType, item2: PackageType) => {
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

export const FindSameParamsPack = (
  data: Array<Package>,
  dataOfUpdated: {
    width: number;
    weight: number;
    length: number;
    height: number;
    packName: string;
  },
) => {
  const duplicate = { name: false, params: false };
  for (const item of data) {
    const nameItm = Object.keys(item)[0];
    const itm = item[nameItm];
    // kontrola jmén
    if (itm.name_package === dataOfUpdated.packName) {
      duplicate.name = true;
    }
    if (
      itm.weight === dataOfUpdated.weight &&
      itm.height === dataOfUpdated.height &&
      itm.width === dataOfUpdated.width &&
      itm.Plength === dataOfUpdated.length
    ) {
      duplicate.params = true;
    }
  }
  return duplicate;
};
