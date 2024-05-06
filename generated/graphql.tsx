// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-use-before-define */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: { [key: string]: any };
};

export type CreatedPack = Pack | PackageError;

export type DataUpdateSupp = {
  delivery?: InputMaybe<Scalars['String']>;
  foil?: InputMaybe<Scalars['String']>;
  insurance?: InputMaybe<Scalars['Int']>;
  packInBox?: InputMaybe<Scalars['String']>;
  pickUp?: InputMaybe<Scalars['String']>;
  sendCashDelivery?: InputMaybe<Scalars['String']>;
  shippingLabel?: InputMaybe<Scalars['String']>;
  suppName?: InputMaybe<Scalars['String']>;
  supplierId?: InputMaybe<Scalars['String']>;
};

export type Delete = {
  __typename?: 'Delete';
  deletion: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type ErrorMessage = {
  __typename?: 'ErrorMessage';
  message: Scalars['String'];
};

export type FormData = {
  __typename?: 'FormData';
  height: Scalars['Int'];
  placeFrom: Scalars['String'];
  placeTo: Scalars['String'];
  plength: Scalars['Int'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type HistoryMessage = {
  __typename?: 'HistoryMessage';
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AddHistory?: Maybe<HistoryMessage>;
  BingoSupPac?: Maybe<SuitValue>;
  PackageToFirestore?: Maybe<CreatedPack>;
  SupplierToFirestore?: Maybe<Supplier>;
  deleteHistoryItem?: Maybe<Delete>;
  deletePack?: Maybe<Delete>;
  deleteSupp?: Maybe<Delete>;
  updateHistory?: Maybe<HistoryMessage>;
  updatePack?: Maybe<UpdatedPack>;
  updateSup?: Maybe<Supplier>;
};

export type MutationAddHistoryArgs = {
  data: Scalars['String'];
  uId: Scalars['String'];
};

export type MutationBingoSupPacArgs = {
  Plength: Scalars['Int'];
  cost: Scalars['Int'];
  fromWhere: Scalars['String'];
  height: Scalars['Int'];
  weight: Scalars['Int'];
  where: Scalars['String'];
  width: Scalars['Int'];
};

export type MutationPackageToFirestoreArgs = {
  Plength: Scalars['Int'];
  cost: Scalars['Int'];
  height: Scalars['Int'];
  name_package: Scalars['String'];
  packId: Scalars['String'];
  supplier_id: Scalars['String'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type MutationSupplierToFirestoreArgs = {
  delivery: Scalars['String'];
  depoCost: Scalars['Int'];
  foil?: InputMaybe<Scalars['String']>;
  insurance: Scalars['Int'];
  packInBox: Scalars['String'];
  personalCost: Scalars['Int'];
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  supplierName: Scalars['String'];
};

export type MutationDeleteHistoryItemArgs = {
  id: Scalars['String'];
};

export type MutationDeletePackArgs = {
  key: Scalars['String'];
  suppId: Scalars['String'];
};

export type MutationDeleteSuppArgs = {
  id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationUpdateHistoryArgs = {
  newPriceDepo?: InputMaybe<Scalars['Int']>;
  newPricePack?: InputMaybe<Scalars['Int']>;
  newPricePersonal?: InputMaybe<Scalars['Int']>;
  oldPackName?: InputMaybe<Scalars['String']>;
  oldSuppName?: InputMaybe<Scalars['String']>;
  packName?: InputMaybe<Scalars['String']>;
  suppData?: InputMaybe<DataUpdateSupp>;
  suppId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePackArgs = {
  PackKey: Scalars['String'];
  Plength: Scalars['Int'];
  cost: Scalars['Int'];
  height: Scalars['Int'];
  name_package: Scalars['String'];
  supplier_id: Scalars['String'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type MutationUpdateSupArgs = {
  delivery: Scalars['String'];
  depoCost: Scalars['Int'];
  foil: Scalars['String'];
  insurance: Scalars['Int'];
  oldNameSupp: Scalars['String'];
  packInBox: Scalars['String'];
  personalCost: Scalars['Int'];
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  suppId: Scalars['String'];
  supplierName: Scalars['String'];
};

export type Pack = {
  __typename?: 'Pack';
  data: PackageDataCreate;
};

export type PackageDataCreate = {
  __typename?: 'PackageDataCreate';
  Plength: Scalars['Int'];
  cost: Scalars['Int'];
  height: Scalars['Int'];
  name_package: Scalars['String'];
  packgeId: Scalars['String'];
  supplier_id: Scalars['String'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type PackageDataUpdate = {
  __typename?: 'PackageDataUpdate';
  Plength: Scalars['Int'];
  cost: Scalars['Int'];
  height: Scalars['Int'];
  name_package: Scalars['String'];
  supplier_id: Scalars['String'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type PackageError = {
  __typename?: 'PackageError';
  message: Scalars['String'];
};

export type PackageUpdateError = {
  __typename?: 'PackageUpdateError';
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  historyUserData: Array<QueryHistoryData>;
  suplierData: Array<QuerySuppD>;
};

export type QueryHistoryData = {
  __typename?: 'QueryHistoryData';
  dataForm: FormData;
  historyId: Scalars['String'];
  suppData: HistorySupplierData;
};

export type QuerySuppD = {
  __typename?: 'QuerySuppD';
  delivery: Scalars['String'];
  foil: Scalars['String'];
  insurance: Scalars['Int'];
  location?: Maybe<Scalars['JSON']>;
  packInBox: Scalars['String'];
  package?: Maybe<Scalars['JSON']>;
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  suppName: Scalars['String'];
  supplierId: Scalars['String'];
};

export type SuitValue = ErrorMessage | Suitable;

export type Suitable = {
  __typename?: 'Suitable';
  suitable: Scalars['String'];
};

export type Supp = {
  __typename?: 'Supp';
  data: SupplierData;
};

export type Supplier = Supp | SupplierError;

export type SupplierData = {
  __typename?: 'SupplierData';
  delivery: Scalars['String'];
  foil: Scalars['String'];
  insurance: Scalars['Int'];
  packInBox: Scalars['String'];
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  suppName: Scalars['String'];
  supplierId: Scalars['String'];
};

export type SupplierError = {
  __typename?: 'SupplierError';
  message: Scalars['String'];
};

export type UPack = {
  __typename?: 'UPack';
  data: PackageDataUpdate;
};

export type UpdatedPack = PackageUpdateError | UPack;

export type HistorySupplierData = {
  __typename?: 'historySupplierData';
  cost: Scalars['Int'];
  delivery: Scalars['String'];
  foil: Scalars['String'];
  id: Scalars['String'];
  insurance: Scalars['Int'];
  name: Scalars['String'];
  packInBox: Scalars['String'];
  packName: Scalars['String'];
  pickup: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
};

export type HistoryDataQueryVariables = Exact<{ [key: string]: never }>;

export type HistoryDataQuery = {
  __typename?: 'Query';
  historyUserData: Array<{
    __typename?: 'QueryHistoryData';
    historyId: string;
    dataForm: {
      __typename?: 'FormData';
      width: number;
      placeTo: string;
      weight: number;
      placeFrom: string;
      plength: number;
      height: number;
    };
    suppData: {
      __typename?: 'historySupplierData';
      insurance: number;
      delivery: string;
      packInBox: string;
      name: string;
      pickup: string;
      shippingLabel: string;
      sendCashDelivery: string;
      foil: string;
      packName: string;
      cost: number;
    };
  }>;
};

export type DeleteHistoryItmMutationVariables = Exact<{
  Id: Scalars['String'];
}>;

export type DeleteHistoryItmMutation = {
  __typename?: 'Mutation';
  deleteHistoryItem?: {
    __typename?: 'Delete';
    deletion: boolean;
    error?: string | null;
  } | null;
};

export type AddHistoryToFirestoreMutationVariables = Exact<{
  Id: Scalars['String'];
  Data: Scalars['String'];
}>;

export type AddHistoryToFirestoreMutation = {
  __typename?: 'Mutation';
  AddHistory?: { __typename?: 'HistoryMessage'; message: string } | null;
};

export type UpdateHistoryMutationVariables = Exact<{
  NewPricePack?: InputMaybe<Scalars['Int']>;
  NewPricePersonal?: InputMaybe<Scalars['Int']>;
  NewPriceDepo?: InputMaybe<Scalars['Int']>;
  SuppId?: InputMaybe<Scalars['String']>;
  PackageName?: InputMaybe<Scalars['String']>;
  OldPackName?: InputMaybe<Scalars['String']>;
  OldNameSupp?: InputMaybe<Scalars['String']>;
  SuppData?: InputMaybe<DataUpdateSupp>;
}>;

export type UpdateHistoryMutation = {
  __typename?: 'Mutation';
  updateHistory?: { __typename?: 'HistoryMessage'; message: string } | null;
};

export type MutSuitableSuppMutationVariables = Exact<{
  Width: Scalars['Int'];
  Weight: Scalars['Int'];
  Height: Scalars['Int'];
  Length: Scalars['Int'];
  Where: Scalars['String'];
  FromWhere: Scalars['String'];
  Cost: Scalars['Int'];
}>;

export type MutSuitableSuppMutation = {
  __typename?: 'Mutation';
  BingoSupPac?:
    | { __typename?: 'ErrorMessage'; message: string }
    | { __typename?: 'Suitable'; suitable: string }
    | null;
};

export type DeletePacMutationVariables = Exact<{
  Id: Scalars['String'];
  Key: Scalars['String'];
}>;

export type DeletePacMutation = {
  __typename?: 'Mutation';
  deletePack?: {
    __typename?: 'Delete';
    deletion: boolean;
    error?: string | null;
  } | null;
};

export type NewPackageToFirestoreMutationVariables = Exact<{
  SuppID: Scalars['String'];
  Weight: Scalars['Int'];
  Cost: Scalars['Int'];
  Length: Scalars['Int'];
  Height: Scalars['Int'];
  Width: Scalars['Int'];
  Pack_name: Scalars['String'];
  PackId: Scalars['String'];
}>;

export type NewPackageToFirestoreMutation = {
  __typename?: 'Mutation';
  PackageToFirestore?:
    | {
        __typename?: 'Pack';
        data: {
          __typename?: 'PackageDataCreate';
          weight: number;
          cost: number;
          Plength: number;
          height: number;
          width: number;
          name_package: string;
          supplier_id: string;
        };
      }
    | { __typename?: 'PackageError'; message: string }
    | null;
};

export type UpdatePackageMutationVariables = Exact<{
  Weight: Scalars['Int'];
  Cost: Scalars['Int'];
  Length: Scalars['Int'];
  Height: Scalars['Int'];
  Width: Scalars['Int'];
  Pack_name: Scalars['String'];
  PackKey: Scalars['String'];
  SuppId: Scalars['String'];
}>;

export type UpdatePackageMutation = {
  __typename?: 'Mutation';
  updatePack?:
    | { __typename?: 'PackageUpdateError'; message: string }
    | {
        __typename?: 'UPack';
        data: {
          __typename?: 'PackageDataUpdate';
          weight: number;
          cost: number;
          Plength: number;
          height: number;
          width: number;
          name_package: string;
          supplier_id: string;
        };
      }
    | null;
};

export type DeleteSuppMutationVariables = Exact<{
  Id?: InputMaybe<
    Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>
  >;
}>;

export type DeleteSuppMutation = {
  __typename?: 'Mutation';
  deleteSupp?: {
    __typename?: 'Delete';
    deletion: boolean;
    error?: string | null;
  } | null;
};

export type NewSupplierToFirestoreMutationVariables = Exact<{
  SupName: Scalars['String'];
  Delivery: Scalars['String'];
  PickUp: Scalars['String'];
  ShippingLabel: Scalars['String'];
  Foil: Scalars['String'];
  Insurance: Scalars['Int'];
  SendCashDelivery: Scalars['String'];
  PackInBox: Scalars['String'];
  DepoCost: Scalars['Int'];
  PersonalCost: Scalars['Int'];
}>;

export type NewSupplierToFirestoreMutation = {
  __typename?: 'Mutation';
  SupplierToFirestore?:
    | {
        __typename?: 'Supp';
        data: {
          __typename?: 'SupplierData';
          sendCashDelivery: string;
          packInBox: string;
          suppName: string;
          pickUp: string;
          delivery: string;
          insurance: number;
          shippingLabel: string;
          foil: string;
        };
      }
    | { __typename?: 'SupplierError'; message: string }
    | null;
};

export type UpdateSupplierMutationVariables = Exact<{
  SupName: Scalars['String'];
  Delivery: Scalars['String'];
  PickUp: Scalars['String'];
  ShippingLabel: Scalars['String'];
  Foil: Scalars['String'];
  Insurance: Scalars['Int'];
  SendCashDelivery: Scalars['String'];
  PackInBox: Scalars['String'];
  SuppId: Scalars['String'];
  OldSupplierName: Scalars['String'];
  DepoCost: Scalars['Int'];
  PersonalCost: Scalars['Int'];
}>;

export type UpdateSupplierMutation = {
  __typename?: 'Mutation';
  updateSup?:
    | {
        __typename?: 'Supp';
        data: {
          __typename?: 'SupplierData';
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
    | { __typename?: 'SupplierError'; message: string }
    | null;
};

export type SuppDataQueryVariables = Exact<{ [key: string]: never }>;

export type SuppDataQuery = {
  __typename?: 'Query';
  suplierData: Array<{
    __typename?: 'QuerySuppD';
    sendCashDelivery: string;
    packInBox: string;
    supplierId: string;
    suppName: string;
    pickUp: string;
    delivery: string;
    insurance: number;
    shippingLabel: string;
    foil: string;
    package?: { [key: string]: any } | null;
    location?: { [key: string]: any } | null;
  }>;
};

export const HistoryDataDocument = gql`
  query HistoryData {
    historyUserData {
      dataForm {
        width
        placeTo
        weight
        placeFrom
        plength
        height
      }
      historyId
      suppData {
        insurance
        delivery
        packInBox
        name
        pickup
        shippingLabel
        sendCashDelivery
        foil
        packName
        cost
      }
    }
  }
`;

/**
 * __useHistoryDataQuery__
 *
 * To run a query within a React component, call `useHistoryDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useHistoryDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHistoryDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useHistoryDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    HistoryDataQuery,
    HistoryDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<HistoryDataQuery, HistoryDataQueryVariables>(
    HistoryDataDocument,
    options,
  );
}
export function useHistoryDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    HistoryDataQuery,
    HistoryDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<HistoryDataQuery, HistoryDataQueryVariables>(
    HistoryDataDocument,
    options,
  );
}
export type HistoryDataQueryHookResult = ReturnType<typeof useHistoryDataQuery>;
export type HistoryDataLazyQueryHookResult = ReturnType<
  typeof useHistoryDataLazyQuery
>;
export type HistoryDataQueryResult = Apollo.QueryResult<
  HistoryDataQuery,
  HistoryDataQueryVariables
>;
export const DeleteHistoryItmDocument = gql`
  mutation DeleteHistoryItm($Id: String!) {
    deleteHistoryItem(id: $Id) {
      deletion
      error
    }
  }
`;
export type DeleteHistoryItmMutationFn = Apollo.MutationFunction<
  DeleteHistoryItmMutation,
  DeleteHistoryItmMutationVariables
>;

/**
 * __useDeleteHistoryItmMutation__
 *
 * To run a mutation, you first call `useDeleteHistoryItmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHistoryItmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHistoryItmMutation, { data, loading, error }] = useDeleteHistoryItmMutation({
 *   variables: {
 *      Id: // value for 'Id'
 *   },
 * });
 */
export function useDeleteHistoryItmMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteHistoryItmMutation,
    DeleteHistoryItmMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteHistoryItmMutation,
    DeleteHistoryItmMutationVariables
  >(DeleteHistoryItmDocument, options);
}
export type DeleteHistoryItmMutationHookResult = ReturnType<
  typeof useDeleteHistoryItmMutation
>;
export type DeleteHistoryItmMutationResult =
  Apollo.MutationResult<DeleteHistoryItmMutation>;
export type DeleteHistoryItmMutationOptions = Apollo.BaseMutationOptions<
  DeleteHistoryItmMutation,
  DeleteHistoryItmMutationVariables
>;
export const AddHistoryToFirestoreDocument = gql`
  mutation AddHistoryToFirestore($Id: String!, $Data: String!) {
    AddHistory(uId: $Id, data: $Data) {
      message
    }
  }
`;
export type AddHistoryToFirestoreMutationFn = Apollo.MutationFunction<
  AddHistoryToFirestoreMutation,
  AddHistoryToFirestoreMutationVariables
>;

/**
 * __useAddHistoryToFirestoreMutation__
 *
 * To run a mutation, you first call `useAddHistoryToFirestoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddHistoryToFirestoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addHistoryToFirestoreMutation, { data, loading, error }] = useAddHistoryToFirestoreMutation({
 *   variables: {
 *      Id: // value for 'Id'
 *      Data: // value for 'Data'
 *   },
 * });
 */
export function useAddHistoryToFirestoreMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddHistoryToFirestoreMutation,
    AddHistoryToFirestoreMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddHistoryToFirestoreMutation,
    AddHistoryToFirestoreMutationVariables
  >(AddHistoryToFirestoreDocument, options);
}
export type AddHistoryToFirestoreMutationHookResult = ReturnType<
  typeof useAddHistoryToFirestoreMutation
>;
export type AddHistoryToFirestoreMutationResult =
  Apollo.MutationResult<AddHistoryToFirestoreMutation>;
export type AddHistoryToFirestoreMutationOptions = Apollo.BaseMutationOptions<
  AddHistoryToFirestoreMutation,
  AddHistoryToFirestoreMutationVariables
>;
export const UpdateHistoryDocument = gql`
  mutation UpdateHistory(
    $NewPricePack: Int
    $NewPricePersonal: Int
    $NewPriceDepo: Int
    $SuppId: String
    $PackageName: String
    $OldPackName: String
    $OldNameSupp: String
    $SuppData: DataUpdateSupp
  ) {
    updateHistory(
      newPricePack: $NewPricePack
      newPricePersonal: $NewPricePersonal
      newPriceDepo: $NewPriceDepo
      suppId: $SuppId
      packName: $PackageName
      oldPackName: $OldPackName
      suppData: $SuppData
      oldSuppName: $OldNameSupp
    ) {
      message
    }
  }
`;
export type UpdateHistoryMutationFn = Apollo.MutationFunction<
  UpdateHistoryMutation,
  UpdateHistoryMutationVariables
>;

/**
 * __useUpdateHistoryMutation__
 *
 * To run a mutation, you first call `useUpdateHistoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateHistoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateHistoryMutation, { data, loading, error }] = useUpdateHistoryMutation({
 *   variables: {
 *      NewPricePack: // value for 'NewPricePack'
 *      NewPricePersonal: // value for 'NewPricePersonal'
 *      NewPriceDepo: // value for 'NewPriceDepo'
 *      SuppId: // value for 'SuppId'
 *      PackageName: // value for 'PackageName'
 *      OldPackName: // value for 'OldPackName'
 *      OldNameSupp: // value for 'OldNameSupp'
 *      SuppData: // value for 'SuppData'
 *   },
 * });
 */
export function useUpdateHistoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateHistoryMutation,
    UpdateHistoryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateHistoryMutation,
    UpdateHistoryMutationVariables
  >(UpdateHistoryDocument, options);
}
export type UpdateHistoryMutationHookResult = ReturnType<
  typeof useUpdateHistoryMutation
>;
export type UpdateHistoryMutationResult =
  Apollo.MutationResult<UpdateHistoryMutation>;
export type UpdateHistoryMutationOptions = Apollo.BaseMutationOptions<
  UpdateHistoryMutation,
  UpdateHistoryMutationVariables
>;
export const MutSuitableSuppDocument = gql`
  mutation MutSuitableSupp(
    $Width: Int!
    $Weight: Int!
    $Height: Int!
    $Length: Int!
    $Where: String!
    $FromWhere: String!
    $Cost: Int!
  ) {
    BingoSupPac(
      width: $Width
      weight: $Weight
      height: $Height
      Plength: $Length
      where: $Where
      fromWhere: $FromWhere
      cost: $Cost
    ) {
      ... on Suitable {
        suitable
      }
      ... on ErrorMessage {
        message
      }
    }
  }
`;
export type MutSuitableSuppMutationFn = Apollo.MutationFunction<
  MutSuitableSuppMutation,
  MutSuitableSuppMutationVariables
>;

/**
 * __useMutSuitableSuppMutation__
 *
 * To run a mutation, you first call `useMutSuitableSuppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMutSuitableSuppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [mutSuitableSuppMutation, { data, loading, error }] = useMutSuitableSuppMutation({
 *   variables: {
 *      Width: // value for 'Width'
 *      Weight: // value for 'Weight'
 *      Height: // value for 'Height'
 *      Length: // value for 'Length'
 *      Where: // value for 'Where'
 *      FromWhere: // value for 'FromWhere'
 *      Cost: // value for 'Cost'
 *   },
 * });
 */
export function useMutSuitableSuppMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MutSuitableSuppMutation,
    MutSuitableSuppMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MutSuitableSuppMutation,
    MutSuitableSuppMutationVariables
  >(MutSuitableSuppDocument, options);
}
export type MutSuitableSuppMutationHookResult = ReturnType<
  typeof useMutSuitableSuppMutation
>;
export type MutSuitableSuppMutationResult =
  Apollo.MutationResult<MutSuitableSuppMutation>;
export type MutSuitableSuppMutationOptions = Apollo.BaseMutationOptions<
  MutSuitableSuppMutation,
  MutSuitableSuppMutationVariables
>;
export const DeletePacDocument = gql`
  mutation DeletePac($Id: String!, $Key: String!) {
    deletePack(suppId: $Id, key: $Key) {
      deletion
      error
    }
  }
`;
export type DeletePacMutationFn = Apollo.MutationFunction<
  DeletePacMutation,
  DeletePacMutationVariables
>;

/**
 * __useDeletePacMutation__
 *
 * To run a mutation, you first call `useDeletePacMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePacMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePacMutation, { data, loading, error }] = useDeletePacMutation({
 *   variables: {
 *      Id: // value for 'Id'
 *      Key: // value for 'Key'
 *   },
 * });
 */
export function useDeletePacMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePacMutation,
    DeletePacMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeletePacMutation, DeletePacMutationVariables>(
    DeletePacDocument,
    options,
  );
}
export type DeletePacMutationHookResult = ReturnType<
  typeof useDeletePacMutation
>;
export type DeletePacMutationResult = Apollo.MutationResult<DeletePacMutation>;
export type DeletePacMutationOptions = Apollo.BaseMutationOptions<
  DeletePacMutation,
  DeletePacMutationVariables
>;
export const NewPackageToFirestoreDocument = gql`
  mutation NewPackageToFirestore(
    $SuppID: String!
    $Weight: Int!
    $Cost: Int!
    $Length: Int!
    $Height: Int!
    $Width: Int!
    $Pack_name: String!
    $PackId: String!
  ) {
    PackageToFirestore(
      supplier_id: $SuppID
      weight: $Weight
      cost: $Cost
      Plength: $Length
      height: $Height
      width: $Width
      name_package: $Pack_name
      packId: $PackId
    ) {
      ... on Pack {
        data {
          weight
          cost
          Plength
          height
          width
          name_package
          supplier_id
        }
      }
      ... on PackageError {
        message
      }
    }
  }
`;
export type NewPackageToFirestoreMutationFn = Apollo.MutationFunction<
  NewPackageToFirestoreMutation,
  NewPackageToFirestoreMutationVariables
>;

/**
 * __useNewPackageToFirestoreMutation__
 *
 * To run a mutation, you first call `useNewPackageToFirestoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewPackageToFirestoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newPackageToFirestoreMutation, { data, loading, error }] = useNewPackageToFirestoreMutation({
 *   variables: {
 *      SuppID: // value for 'SuppID'
 *      Weight: // value for 'Weight'
 *      Cost: // value for 'Cost'
 *      Length: // value for 'Length'
 *      Height: // value for 'Height'
 *      Width: // value for 'Width'
 *      Pack_name: // value for 'Pack_name'
 *      PackId: // value for 'PackId'
 *   },
 * });
 */
export function useNewPackageToFirestoreMutation(
  baseOptions?: Apollo.MutationHookOptions<
    NewPackageToFirestoreMutation,
    NewPackageToFirestoreMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    NewPackageToFirestoreMutation,
    NewPackageToFirestoreMutationVariables
  >(NewPackageToFirestoreDocument, options);
}
export type NewPackageToFirestoreMutationHookResult = ReturnType<
  typeof useNewPackageToFirestoreMutation
>;
export type NewPackageToFirestoreMutationResult =
  Apollo.MutationResult<NewPackageToFirestoreMutation>;
export type NewPackageToFirestoreMutationOptions = Apollo.BaseMutationOptions<
  NewPackageToFirestoreMutation,
  NewPackageToFirestoreMutationVariables
>;
export const UpdatePackageDocument = gql`
  mutation UpdatePackage(
    $Weight: Int!
    $Cost: Int!
    $Length: Int!
    $Height: Int!
    $Width: Int!
    $Pack_name: String!
    $PackKey: String!
    $SuppId: String!
  ) {
    updatePack(
      PackKey: $PackKey
      weight: $Weight
      cost: $Cost
      Plength: $Length
      height: $Height
      width: $Width
      name_package: $Pack_name
      supplier_id: $SuppId
    ) {
      ... on UPack {
        data {
          weight
          cost
          Plength
          height
          width
          name_package
          supplier_id
        }
      }
      ... on PackageUpdateError {
        message
      }
    }
  }
`;
export type UpdatePackageMutationFn = Apollo.MutationFunction<
  UpdatePackageMutation,
  UpdatePackageMutationVariables
>;

/**
 * __useUpdatePackageMutation__
 *
 * To run a mutation, you first call `useUpdatePackageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePackageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePackageMutation, { data, loading, error }] = useUpdatePackageMutation({
 *   variables: {
 *      Weight: // value for 'Weight'
 *      Cost: // value for 'Cost'
 *      Length: // value for 'Length'
 *      Height: // value for 'Height'
 *      Width: // value for 'Width'
 *      Pack_name: // value for 'Pack_name'
 *      PackKey: // value for 'PackKey'
 *      SuppId: // value for 'SuppId'
 *   },
 * });
 */
export function useUpdatePackageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdatePackageMutation,
    UpdatePackageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdatePackageMutation,
    UpdatePackageMutationVariables
  >(UpdatePackageDocument, options);
}
export type UpdatePackageMutationHookResult = ReturnType<
  typeof useUpdatePackageMutation
>;
export type UpdatePackageMutationResult =
  Apollo.MutationResult<UpdatePackageMutation>;
export type UpdatePackageMutationOptions = Apollo.BaseMutationOptions<
  UpdatePackageMutation,
  UpdatePackageMutationVariables
>;
export const DeleteSuppDocument = gql`
  mutation DeleteSupp($Id: [String]) {
    deleteSupp(id: $Id) {
      deletion
      error
    }
  }
`;
export type DeleteSuppMutationFn = Apollo.MutationFunction<
  DeleteSuppMutation,
  DeleteSuppMutationVariables
>;

/**
 * __useDeleteSuppMutation__
 *
 * To run a mutation, you first call `useDeleteSuppMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSuppMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSuppMutation, { data, loading, error }] = useDeleteSuppMutation({
 *   variables: {
 *      Id: // value for 'Id'
 *   },
 * });
 */
export function useDeleteSuppMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSuppMutation,
    DeleteSuppMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteSuppMutation, DeleteSuppMutationVariables>(
    DeleteSuppDocument,
    options,
  );
}
export type DeleteSuppMutationHookResult = ReturnType<
  typeof useDeleteSuppMutation
>;
export type DeleteSuppMutationResult =
  Apollo.MutationResult<DeleteSuppMutation>;
export type DeleteSuppMutationOptions = Apollo.BaseMutationOptions<
  DeleteSuppMutation,
  DeleteSuppMutationVariables
>;
export const NewSupplierToFirestoreDocument = gql`
  mutation NewSupplierToFirestore(
    $SupName: String!
    $Delivery: String!
    $PickUp: String!
    $ShippingLabel: String!
    $Foil: String!
    $Insurance: Int!
    $SendCashDelivery: String!
    $PackInBox: String!
    $DepoCost: Int!
    $PersonalCost: Int!
  ) {
    SupplierToFirestore(
      supplierName: $SupName
      delivery: $Delivery
      shippingLabel: $ShippingLabel
      pickUp: $PickUp
      foil: $Foil
      insurance: $Insurance
      sendCashDelivery: $SendCashDelivery
      packInBox: $PackInBox
      depoCost: $DepoCost
      personalCost: $PersonalCost
    ) {
      ... on Supp {
        data {
          sendCashDelivery
          packInBox
          suppName
          pickUp
          delivery
          insurance
          shippingLabel
          foil
        }
      }
      ... on SupplierError {
        message
      }
    }
  }
`;
export type NewSupplierToFirestoreMutationFn = Apollo.MutationFunction<
  NewSupplierToFirestoreMutation,
  NewSupplierToFirestoreMutationVariables
>;

/**
 * __useNewSupplierToFirestoreMutation__
 *
 * To run a mutation, you first call `useNewSupplierToFirestoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useNewSupplierToFirestoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [newSupplierToFirestoreMutation, { data, loading, error }] = useNewSupplierToFirestoreMutation({
 *   variables: {
 *      SupName: // value for 'SupName'
 *      Delivery: // value for 'Delivery'
 *      PickUp: // value for 'PickUp'
 *      ShippingLabel: // value for 'ShippingLabel'
 *      Foil: // value for 'Foil'
 *      Insurance: // value for 'Insurance'
 *      SendCashDelivery: // value for 'SendCashDelivery'
 *      PackInBox: // value for 'PackInBox'
 *      DepoCost: // value for 'DepoCost'
 *      PersonalCost: // value for 'PersonalCost'
 *   },
 * });
 */
export function useNewSupplierToFirestoreMutation(
  baseOptions?: Apollo.MutationHookOptions<
    NewSupplierToFirestoreMutation,
    NewSupplierToFirestoreMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    NewSupplierToFirestoreMutation,
    NewSupplierToFirestoreMutationVariables
  >(NewSupplierToFirestoreDocument, options);
}
export type NewSupplierToFirestoreMutationHookResult = ReturnType<
  typeof useNewSupplierToFirestoreMutation
>;
export type NewSupplierToFirestoreMutationResult =
  Apollo.MutationResult<NewSupplierToFirestoreMutation>;
export type NewSupplierToFirestoreMutationOptions = Apollo.BaseMutationOptions<
  NewSupplierToFirestoreMutation,
  NewSupplierToFirestoreMutationVariables
>;
export const UpdateSupplierDocument = gql`
  mutation UpdateSupplier(
    $SupName: String!
    $Delivery: String!
    $PickUp: String!
    $ShippingLabel: String!
    $Foil: String!
    $Insurance: Int!
    $SendCashDelivery: String!
    $PackInBox: String!
    $SuppId: String!
    $OldSupplierName: String!
    $DepoCost: Int!
    $PersonalCost: Int!
  ) {
    updateSup(
      supplierName: $SupName
      delivery: $Delivery
      shippingLabel: $ShippingLabel
      pickUp: $PickUp
      foil: $Foil
      insurance: $Insurance
      sendCashDelivery: $SendCashDelivery
      packInBox: $PackInBox
      suppId: $SuppId
      oldNameSupp: $OldSupplierName
      depoCost: $DepoCost
      personalCost: $PersonalCost
    ) {
      ... on Supp {
        data {
          sendCashDelivery
          supplierId
          packInBox
          suppName
          pickUp
          delivery
          insurance
          shippingLabel
          foil
        }
      }
      ... on SupplierError {
        message
      }
    }
  }
`;
export type UpdateSupplierMutationFn = Apollo.MutationFunction<
  UpdateSupplierMutation,
  UpdateSupplierMutationVariables
>;

/**
 * __useUpdateSupplierMutation__
 *
 * To run a mutation, you first call `useUpdateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSupplierMutation, { data, loading, error }] = useUpdateSupplierMutation({
 *   variables: {
 *      SupName: // value for 'SupName'
 *      Delivery: // value for 'Delivery'
 *      PickUp: // value for 'PickUp'
 *      ShippingLabel: // value for 'ShippingLabel'
 *      Foil: // value for 'Foil'
 *      Insurance: // value for 'Insurance'
 *      SendCashDelivery: // value for 'SendCashDelivery'
 *      PackInBox: // value for 'PackInBox'
 *      SuppId: // value for 'SuppId'
 *      OldSupplierName: // value for 'OldSupplierName'
 *      DepoCost: // value for 'DepoCost'
 *      PersonalCost: // value for 'PersonalCost'
 *   },
 * });
 */
export function useUpdateSupplierMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateSupplierMutation,
    UpdateSupplierMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateSupplierMutation,
    UpdateSupplierMutationVariables
  >(UpdateSupplierDocument, options);
}
export type UpdateSupplierMutationHookResult = ReturnType<
  typeof useUpdateSupplierMutation
>;
export type UpdateSupplierMutationResult =
  Apollo.MutationResult<UpdateSupplierMutation>;
export type UpdateSupplierMutationOptions = Apollo.BaseMutationOptions<
  UpdateSupplierMutation,
  UpdateSupplierMutationVariables
>;
export const SuppDataDocument = gql`
  query SuppData {
    suplierData {
      sendCashDelivery
      packInBox
      supplierId
      suppName
      pickUp
      delivery
      insurance
      shippingLabel
      foil
      package
      location
    }
  }
`;

/**
 * __useSuppDataQuery__
 *
 * To run a query within a React component, call `useSuppDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuppDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuppDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useSuppDataQuery(
  baseOptions?: Apollo.QueryHookOptions<SuppDataQuery, SuppDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<SuppDataQuery, SuppDataQueryVariables>(
    SuppDataDocument,
    options,
  );
}
export function useSuppDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SuppDataQuery,
    SuppDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<SuppDataQuery, SuppDataQueryVariables>(
    SuppDataDocument,
    options,
  );
}
export type SuppDataQueryHookResult = ReturnType<typeof useSuppDataQuery>;
export type SuppDataLazyQueryHookResult = ReturnType<
  typeof useSuppDataLazyQuery
>;
export type SuppDataQueryResult = Apollo.QueryResult<
  SuppDataQuery,
  SuppDataQueryVariables
>;
