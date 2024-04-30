import { ApolloError } from '@apollo/client';

import { SuppDataQuery } from '@/generated/graphql';

export type LocErrors = {
  errPlaceTo: string;
  errFrom: string;
};

export type ParamErrors = {
  errWidth: string;
  errHeight: string;
  errWeight: string;
  errLength: string;
  errCost: string;
};

export type Supplier =
  | {
      __typename?: 'QuerySuppD' | undefined;
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
    }
  | undefined;

export type Package = {
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

export type SuppData = SuppDataQuery | undefined;

export type CreatedPackage = {
  weight: number;
  cost: number;
  Plength: number;
  height: number;
  width: number;
  name_package: string;
  supplier_id: string;
};

export type ErrSetterProperties = {
  errWeight: string;
  errCost: string;
  errpLength: string;
  errHeight: string;
  errWidth: string;
  errLabel: string;
};

export type SupplierData = SuppDataQuery['suplierData'];

export type DataFrServer = {
  SuppId: string;
  PackName: string;
  Cost: string;
  Plength: string;
  Weight: string;
  Width: string;
  Height: string;
};

export type PackageData = {
  weight: number;
  cost: number;
  Plength: number;
  height: number;
  width: number;
  name_package: string;
  supplier_id: string;
};

export type ErrSettersPropertiesSuppCreateUpdate = {
  errInsurance: string;
  errSendCashDelivery: string;
  errFoil: string;
  errShippingLabel: string;
  errPackInBox: string;
  errDepoCost: string;
  errPersonalCost: string;
  errName: string;
};

export type DataCreatedSupp = {
  sendCashDelivery: string;
  packInBox: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
};

export type DataUpdateSupp = {
  sendCashDelivery: string;
  supplierId: string;
  packInBox: string;
  suppName: string;
  pickUp: string;
  delivery: string;
  insurance: number;
  shippingLabel: string;
  foil: string;
};

export type DataFromDB = {
  SuppId: string;
  SupplierName: string;
  Delivery: string;
  PickUp: string;
  Insurance: string;
  SendCashDelivery: string;
  PackInBox: string;
  ShippingLabel: string;
  Foil: string;
  DepoCost: string;
  PersonalCost: string;
};

export type ResponseSuppUpdate =
  | {
      __typename?: 'Supp' | undefined;
      data: {
        __typename?: 'SupplierData' | undefined;
        sendCashDelivery: string;
        supplierId: string;
        packInBox: string;
        suppName: string;
        pickUp: string;
        delivery: string;
        insurance: number;
        shippingLabel: string;
        foil: string;
      };
    }
  | {
      __typename?: 'SupplierError' | undefined;
      message: string;
    }
  | null
  | undefined;

export type ResponsePackUpdate =
  | {
      __typename?: 'PackageUpdateError' | undefined;
      message: string;
    }
  | {
      __typename?: 'UPack' | undefined;
      data: {
        __typename?: 'PackageDataUpdate' | undefined;
        weight: number;
        cost: number;
        Plength: number;
        height: number;
        width: number;
        name_package: string;
        supplier_id: string;
      };
    }
  | null
  | undefined;

export type DataFromForm = {
  width: string;
  height: string;
  weight: string;
  plength: string;
  placeFrom: string;
  placeTo: string;
};

export type SupplierInfo = {
  data: SuppDataQuery | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export type DataS = {
  suppId: string;
  cost: number;
  name: string;
};

export type SuitableSuppType = {
  dataS: Supplier;
  cost: number;
  packName: string;
};

export type ErrSettersPropertiesFromData = {
  errWidth: string;
  errHeight: string;
  errWeight: string;
  errLength: string;
  errCost: string;
  errPlaceTo: string;
  errFrom: string;
};

export type SetterDataProperties = {
  Width: string;
  Height: string;
  Weight: string;
  Plength: string;
  PlaceFrom: string;
  PlaceTo: string;
  Cost: string;
};

export type Location = {
  depoDelivery: { delivery: string; cost: number };
  personalDelivery: { delivery: string; cost: number };
};

export type SuppWithLocation = {
  suppId: string;
  loc: Location;
};

export type PackageType = {
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

export type CostSup = {
  idS: string;
  cost: number;
};

export type ReturnItem = {
  suppId: string;
  cost: number;
  name: string;
};

export type DataChoosedSupp = {
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

export type HistoryDocument = {
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

export type SupplierInformation = {
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

export type Response = {
  docID?: string;
  message: string;
};
