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

export type CardValue = {
  __typename?: 'CardValue';
  description: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  image: Scalars['String'];
  title: Scalars['String'];
};

export type Delete = {
  __typename?: 'Delete';
  deletion: Scalars['Boolean'];
  error?: Maybe<Scalars['String']>;
};

export type GithubUser = {
  __typename?: 'GithubUser';
  avatarUrl: Scalars['String'];
  id: Scalars['ID'];
  login: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  ActualUsToFirestore?: Maybe<UserData>;
  BingoSupPac?: Maybe<SuitableSupp>;
  ChangeActualUsEmToFirestore?: Maybe<UserChangeEmData>;
  PackageToFirestore?: Maybe<PackageData>;
  SupplierToFirestore?: Maybe<Supplier>;
  deletePack?: Maybe<Delete>;
  deletePack2?: Maybe<Scalars['Boolean']>;
  deleteSupp?: Maybe<Scalars['Boolean']>;
  deleteSupp2?: Maybe<Scalars['Boolean']>;
  updatePack?: Maybe<PackageDataUpdate>;
  updateSup?: Maybe<Supplier>;
};

export type MutationActualUsToFirestoreArgs = {
  emailUS: Scalars['String'];
};

export type MutationBingoSupPacArgs = {
  Plength: Scalars['Int'];
  height: Scalars['Int'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type MutationChangeActualUsEmToFirestoreArgs = {
  ActualemailUser: Scalars['String'];
  Email: Scalars['String'];
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
  foil?: InputMaybe<Scalars['String']>;
  insurance: Scalars['Int'];
  packInBox: Scalars['String'];
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  supplierName: Scalars['String'];
};

export type MutationDeletePackArgs = {
  key: Scalars['String'];
  suppId: Scalars['String'];
};

export type MutationDeletePack2Args = {
  id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationDeleteSuppArgs = {
  id?: InputMaybe<Scalars['Int']>;
};

export type MutationDeleteSupp2Args = {
  id?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
  actNameSupp: Scalars['String'];
  delivery: Scalars['String'];
  foil: Scalars['String'];
  insurance: Scalars['Int'];
  packInBox: Scalars['String'];
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  suppId: Scalars['String'];
  supplierName: Scalars['String'];
};

export type PackageData = {
  __typename?: 'PackageData';
  Plength: Scalars['Int'];
  cost: Scalars['Int'];
  error?: Maybe<Scalars['String']>;
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
  error: Scalars['String'];
  height: Scalars['Int'];
  name_package: Scalars['String'];
  supplier_id: Scalars['String'];
  weight: Scalars['Int'];
  width: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  cardValues: Array<Maybe<CardValue>>;
  githubUsers: Array<GithubUser>;
  packageData: Array<QueryPackD>;
  suplierData: Array<QuerySuppD>;
  userdata: Array<UserData>;
  users: Array<User>;
};

export type QueryPackD = {
  __typename?: 'QueryPackD';
  Pkam: Scalars['String'];
  Podkud: Scalars['String'];
  costPackage: Scalars['Int'];
  delka: Scalars['Int'];
  hmotnost: Scalars['Int'];
  kam: Scalars['String'];
  odkud: Scalars['String'];
  packName: Scalars['String'];
  packgeId: Scalars['String'];
  sirka: Scalars['Int'];
  supplierId: Scalars['String'];
  vyska: Scalars['Int'];
};

export type QuerySuppD = {
  __typename?: 'QuerySuppD';
  delivery: Scalars['String'];
  foil: Scalars['String'];
  insurance: Scalars['Int'];
  packInBox: Scalars['String'];
  package?: Maybe<Scalars['JSON']>;
  pickUp: Scalars['String'];
  sendCashDelivery: Scalars['String'];
  shippingLabel: Scalars['String'];
  suppName: Scalars['String'];
  supplierId: Scalars['String'];
};

export type SuitableSupp = {
  __typename?: 'SuitableSupp';
  cost?: Maybe<Scalars['Int']>;
  suppId?: Maybe<Scalars['String']>;
};

export type Supplier = {
  __typename?: 'Supplier';
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

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']>;
};

export type UserChangeEmData = {
  __typename?: 'UserChangeEmData';
  email: Scalars['String'];
};

export type UserData = {
  __typename?: 'UserData';
  dataUs: Scalars['String'];
  email: Scalars['String'];
  historyId: Scalars['Int'];
  supplierId: Scalars['Int'];
};

export type ChangeActualUsEmToFirestoreMutationVariables = Exact<{
  ActualemailUser: Scalars['String'];
  NewEmail: Scalars['String'];
}>;

export type ChangeActualUsEmToFirestoreMutation = {
  __typename?: 'Mutation';
  ChangeActualUsEmToFirestore?: {
    __typename?: 'UserChangeEmData';
    email: string;
  } | null;
};

export type ActualUsToFirestoreMutationVariables = Exact<{
  email: Scalars['String'];
}>;

export type ActualUsToFirestoreMutation = {
  __typename?: 'Mutation';
  ActualUsToFirestore?: { __typename?: 'UserData'; email: string } | null;
};

export type DeleteSuppMutationVariables = Exact<{
  Id?: InputMaybe<Scalars['Int']>;
}>;

export type DeleteSuppMutation = {
  __typename?: 'Mutation';
  deleteSupp?: boolean | null;
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

export type DeletePac2MutationVariables = Exact<{
  Id?: InputMaybe<
    Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>
  >;
}>;

export type DeletePac2Mutation = {
  __typename?: 'Mutation';
  deletePack2?: boolean | null;
};

export type DeleteSupp2MutationVariables = Exact<{
  Id?: InputMaybe<
    Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>
  >;
}>;

export type DeleteSupp2Mutation = {
  __typename?: 'Mutation';
  deleteSupp2?: boolean | null;
};

export type NewPackageToFirestoreMutationVariables = Exact<{
  SuppID: Scalars['String'];
  Hmotnost: Scalars['Int'];
  Cost: Scalars['Int'];
  Delka: Scalars['Int'];
  Vyska: Scalars['Int'];
  Sirka: Scalars['Int'];
  Pack_name: Scalars['String'];
  PackId: Scalars['String'];
}>;

export type NewPackageToFirestoreMutation = {
  __typename?: 'Mutation';
  PackageToFirestore?: {
    __typename?: 'PackageData';
    weight: number;
    cost: number;
    Plength: number;
    height: number;
    width: number;
    name_package: string;
    error?: string | null;
    supplier_id: string;
  } | null;
};

export type MutSuitableSuppMutationVariables = Exact<{
  Width: Scalars['Int'];
  Weight: Scalars['Int'];
  Height: Scalars['Int'];
  Length: Scalars['Int'];
}>;

export type MutSuitableSuppMutation = {
  __typename?: 'Mutation';
  BingoSupPac?: {
    __typename?: 'SuitableSupp';
    cost?: number | null;
    suppId?: string | null;
  } | null;
};

export type NewSupplierToFirestoreMutationVariables = Exact<{
  SupName: Scalars['String'];
  Delivery: Scalars['String'];
  pickUp: Scalars['String'];
  ShippingLabel: Scalars['String'];
  Foil: Scalars['String'];
  Insurance: Scalars['Int'];
  SendCashDelivery: Scalars['String'];
  packInBox: Scalars['String'];
}>;

export type NewSupplierToFirestoreMutation = {
  __typename?: 'Mutation';
  SupplierToFirestore?: {
    __typename?: 'Supplier';
    sendCashDelivery: string;
    packInBox: string;
    suppName: string;
    pickUp: string;
    delivery: string;
    insurance: number;
    shippingLabel: string;
    supplierId: string;
    foil: string;
  } | null;
};

export type UpdatePackageMutationVariables = Exact<{
  Hmotnost: Scalars['Int'];
  Cost: Scalars['Int'];
  Delka: Scalars['Int'];
  Vyska: Scalars['Int'];
  Sirka: Scalars['Int'];
  Pack_name: Scalars['String'];
  PackKey: Scalars['String'];
  SuppId: Scalars['String'];
}>;

export type UpdatePackageMutation = {
  __typename?: 'Mutation';
  updatePack?: {
    __typename?: 'PackageDataUpdate';
    weight: number;
    cost: number;
    Plength: number;
    height: number;
    width: number;
    name_package: string;
    supplier_id: string;
    error: string;
  } | null;
};

export type UpdateSupplierMutationVariables = Exact<{
  SupName: Scalars['String'];
  Delivery: Scalars['String'];
  pickUp: Scalars['String'];
  ShippingLabel: Scalars['String'];
  Foil: Scalars['String'];
  Insurance: Scalars['Int'];
  SendCashDelivery: Scalars['String'];
  packInBox: Scalars['String'];
  SuppId: Scalars['String'];
  ActNameSupp: Scalars['String'];
}>;

export type UpdateSupplierMutation = {
  __typename?: 'Mutation';
  updateSup?: {
    __typename?: 'Supplier';
    sendCashDelivery: string;
    packInBox: string;
    suppName: string;
    pickUp: string;
    delivery: string;
    insurance: number;
    shippingLabel: string;
    foil: string;
  } | null;
};

export type PackageDataQueryVariables = Exact<{ [key: string]: never }>;

export type PackageDataQuery = {
  __typename?: 'Query';
  packageData: Array<{
    __typename?: 'QueryPackD';
    Pkam: string;
    Podkud: string;
    costPackage: number;
    delka: number;
    hmotnost: number;
    kam: string;
    odkud: string;
    packName: string;
    packgeId: string;
    sirka: number;
    vyska: number;
    supplierId: string;
  }>;
};

export type CardDataQueryVariables = Exact<{ [key: string]: never }>;

export type CardDataQuery = {
  __typename?: 'Query';
  cardValues: Array<{
    __typename?: 'CardValue';
    id?: number | null;
    description: string;
    image: string;
    title: string;
  } | null>;
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
  }>;
};

export type UserDataQueryVariables = Exact<{ [key: string]: never }>;

export type UserDataQuery = {
  __typename?: 'Query';
  userdata: Array<{
    __typename?: 'UserData';
    dataUs: string;
    email: string;
    historyId: number;
    supplierId: number;
  }>;
};

export type PeopleQueryVariables = Exact<{ [key: string]: never }>;

export type PeopleQuery = {
  __typename?: 'Query';
  githubUsers: Array<{ __typename?: 'GithubUser'; login: string }>;
  users: Array<{ __typename?: 'User'; name?: string | null }>;
};

export const ChangeActualUsEmToFirestoreDocument = gql`
  mutation ChangeActualUsEmToFirestore(
    $ActualemailUser: String!
    $NewEmail: String!
  ) {
    ChangeActualUsEmToFirestore(
      Email: $NewEmail
      ActualemailUser: $ActualemailUser
    ) {
      email
    }
  }
`;
export type ChangeActualUsEmToFirestoreMutationFn = Apollo.MutationFunction<
  ChangeActualUsEmToFirestoreMutation,
  ChangeActualUsEmToFirestoreMutationVariables
>;

/**
 * __useChangeActualUsEmToFirestoreMutation__
 *
 * To run a mutation, you first call `useChangeActualUsEmToFirestoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeActualUsEmToFirestoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeActualUsEmToFirestoreMutation, { data, loading, error }] = useChangeActualUsEmToFirestoreMutation({
 *   variables: {
 *      ActualemailUser: // value for 'ActualemailUser'
 *      NewEmail: // value for 'NewEmail'
 *   },
 * });
 */
export function useChangeActualUsEmToFirestoreMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangeActualUsEmToFirestoreMutation,
    ChangeActualUsEmToFirestoreMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ChangeActualUsEmToFirestoreMutation,
    ChangeActualUsEmToFirestoreMutationVariables
  >(ChangeActualUsEmToFirestoreDocument, options);
}
export type ChangeActualUsEmToFirestoreMutationHookResult = ReturnType<
  typeof useChangeActualUsEmToFirestoreMutation
>;
export type ChangeActualUsEmToFirestoreMutationResult =
  Apollo.MutationResult<ChangeActualUsEmToFirestoreMutation>;
export type ChangeActualUsEmToFirestoreMutationOptions =
  Apollo.BaseMutationOptions<
    ChangeActualUsEmToFirestoreMutation,
    ChangeActualUsEmToFirestoreMutationVariables
  >;
export const ActualUsToFirestoreDocument = gql`
  mutation ActualUsToFirestore($email: String!) {
    ActualUsToFirestore(emailUS: $email) {
      email
    }
  }
`;
export type ActualUsToFirestoreMutationFn = Apollo.MutationFunction<
  ActualUsToFirestoreMutation,
  ActualUsToFirestoreMutationVariables
>;

/**
 * __useActualUsToFirestoreMutation__
 *
 * To run a mutation, you first call `useActualUsToFirestoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActualUsToFirestoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actualUsToFirestoreMutation, { data, loading, error }] = useActualUsToFirestoreMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useActualUsToFirestoreMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ActualUsToFirestoreMutation,
    ActualUsToFirestoreMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ActualUsToFirestoreMutation,
    ActualUsToFirestoreMutationVariables
  >(ActualUsToFirestoreDocument, options);
}
export type ActualUsToFirestoreMutationHookResult = ReturnType<
  typeof useActualUsToFirestoreMutation
>;
export type ActualUsToFirestoreMutationResult =
  Apollo.MutationResult<ActualUsToFirestoreMutation>;
export type ActualUsToFirestoreMutationOptions = Apollo.BaseMutationOptions<
  ActualUsToFirestoreMutation,
  ActualUsToFirestoreMutationVariables
>;
export const DeleteSuppDocument = gql`
  mutation DeleteSupp($Id: Int) {
    deleteSupp(id: $Id)
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
export const DeletePac2Document = gql`
  mutation DeletePac2($Id: [String]) {
    deletePack2(id: $Id)
  }
`;
export type DeletePac2MutationFn = Apollo.MutationFunction<
  DeletePac2Mutation,
  DeletePac2MutationVariables
>;

/**
 * __useDeletePac2Mutation__
 *
 * To run a mutation, you first call `useDeletePac2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePac2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePac2Mutation, { data, loading, error }] = useDeletePac2Mutation({
 *   variables: {
 *      Id: // value for 'Id'
 *   },
 * });
 */
export function useDeletePac2Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeletePac2Mutation,
    DeletePac2MutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeletePac2Mutation, DeletePac2MutationVariables>(
    DeletePac2Document,
    options,
  );
}
export type DeletePac2MutationHookResult = ReturnType<
  typeof useDeletePac2Mutation
>;
export type DeletePac2MutationResult =
  Apollo.MutationResult<DeletePac2Mutation>;
export type DeletePac2MutationOptions = Apollo.BaseMutationOptions<
  DeletePac2Mutation,
  DeletePac2MutationVariables
>;
export const DeleteSupp2Document = gql`
  mutation DeleteSupp2($Id: [String]) {
    deleteSupp2(id: $Id)
  }
`;
export type DeleteSupp2MutationFn = Apollo.MutationFunction<
  DeleteSupp2Mutation,
  DeleteSupp2MutationVariables
>;

/**
 * __useDeleteSupp2Mutation__
 *
 * To run a mutation, you first call `useDeleteSupp2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSupp2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSupp2Mutation, { data, loading, error }] = useDeleteSupp2Mutation({
 *   variables: {
 *      Id: // value for 'Id'
 *   },
 * });
 */
export function useDeleteSupp2Mutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteSupp2Mutation,
    DeleteSupp2MutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteSupp2Mutation, DeleteSupp2MutationVariables>(
    DeleteSupp2Document,
    options,
  );
}
export type DeleteSupp2MutationHookResult = ReturnType<
  typeof useDeleteSupp2Mutation
>;
export type DeleteSupp2MutationResult =
  Apollo.MutationResult<DeleteSupp2Mutation>;
export type DeleteSupp2MutationOptions = Apollo.BaseMutationOptions<
  DeleteSupp2Mutation,
  DeleteSupp2MutationVariables
>;
export const NewPackageToFirestoreDocument = gql`
  mutation NewPackageToFirestore(
    $SuppID: String!
    $Hmotnost: Int!
    $Cost: Int!
    $Delka: Int!
    $Vyska: Int!
    $Sirka: Int!
    $Pack_name: String!
    $PackId: String!
  ) {
    PackageToFirestore(
      supplier_id: $SuppID
      weight: $Hmotnost
      cost: $Cost
      Plength: $Delka
      height: $Vyska
      width: $Sirka
      name_package: $Pack_name
      packId: $PackId
    ) {
      weight
      cost
      Plength
      height
      width
      name_package
      error
      supplier_id
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
 *      Hmotnost: // value for 'Hmotnost'
 *      Cost: // value for 'Cost'
 *      Delka: // value for 'Delka'
 *      Vyska: // value for 'Vyska'
 *      Sirka: // value for 'Sirka'
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
export const MutSuitableSuppDocument = gql`
  mutation MutSuitableSupp(
    $Width: Int!
    $Weight: Int!
    $Height: Int!
    $Length: Int!
  ) {
    BingoSupPac(
      width: $Width
      weight: $Weight
      height: $Height
      Plength: $Length
    ) {
      cost
      suppId
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
export const NewSupplierToFirestoreDocument = gql`
  mutation NewSupplierToFirestore(
    $SupName: String!
    $Delivery: String!
    $pickUp: String!
    $ShippingLabel: String!
    $Foil: String!
    $Insurance: Int!
    $SendCashDelivery: String!
    $packInBox: String!
  ) {
    SupplierToFirestore(
      supplierName: $SupName
      delivery: $Delivery
      shippingLabel: $ShippingLabel
      pickUp: $pickUp
      foil: $Foil
      insurance: $Insurance
      sendCashDelivery: $SendCashDelivery
      packInBox: $packInBox
    ) {
      sendCashDelivery
      packInBox
      suppName
      pickUp
      delivery
      insurance
      shippingLabel
      supplierId
      foil
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
 *      pickUp: // value for 'pickUp'
 *      ShippingLabel: // value for 'ShippingLabel'
 *      Foil: // value for 'Foil'
 *      Insurance: // value for 'Insurance'
 *      SendCashDelivery: // value for 'SendCashDelivery'
 *      packInBox: // value for 'packInBox'
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
export const UpdatePackageDocument = gql`
  mutation UpdatePackage(
    $Hmotnost: Int!
    $Cost: Int!
    $Delka: Int!
    $Vyska: Int!
    $Sirka: Int!
    $Pack_name: String!
    $PackKey: String!
    $SuppId: String!
  ) {
    updatePack(
      PackKey: $PackKey
      weight: $Hmotnost
      cost: $Cost
      Plength: $Delka
      height: $Vyska
      width: $Sirka
      name_package: $Pack_name
      supplier_id: $SuppId
    ) {
      weight
      cost
      Plength
      height
      width
      name_package
      supplier_id
      error
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
 *      Hmotnost: // value for 'Hmotnost'
 *      Cost: // value for 'Cost'
 *      Delka: // value for 'Delka'
 *      Vyska: // value for 'Vyska'
 *      Sirka: // value for 'Sirka'
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
export const UpdateSupplierDocument = gql`
  mutation UpdateSupplier(
    $SupName: String!
    $Delivery: String!
    $pickUp: String!
    $ShippingLabel: String!
    $Foil: String!
    $Insurance: Int!
    $SendCashDelivery: String!
    $packInBox: String!
    $SuppId: String!
    $ActNameSupp: String!
  ) {
    updateSup(
      supplierName: $SupName
      delivery: $Delivery
      shippingLabel: $ShippingLabel
      pickUp: $pickUp
      foil: $Foil
      insurance: $Insurance
      sendCashDelivery: $SendCashDelivery
      packInBox: $packInBox
      suppId: $SuppId
      actNameSupp: $ActNameSupp
    ) {
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
 *      pickUp: // value for 'pickUp'
 *      ShippingLabel: // value for 'ShippingLabel'
 *      Foil: // value for 'Foil'
 *      Insurance: // value for 'Insurance'
 *      SendCashDelivery: // value for 'SendCashDelivery'
 *      packInBox: // value for 'packInBox'
 *      SuppId: // value for 'SuppId'
 *      ActNameSupp: // value for 'ActNameSupp'
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
export const PackageDataDocument = gql`
  query PackageData {
    packageData {
      Pkam
      Podkud
      costPackage
      delka
      hmotnost
      kam
      odkud
      packName
      packgeId
      sirka
      vyska
      supplierId
    }
  }
`;

/**
 * __usePackageDataQuery__
 *
 * To run a query within a React component, call `usePackageDataQuery` and pass it any options that fit your needs.
 * When your component renders, `usePackageDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePackageDataQuery({
 *   variables: {
 *   },
 * });
 */
export function usePackageDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    PackageDataQuery,
    PackageDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PackageDataQuery, PackageDataQueryVariables>(
    PackageDataDocument,
    options,
  );
}
export function usePackageDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    PackageDataQuery,
    PackageDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PackageDataQuery, PackageDataQueryVariables>(
    PackageDataDocument,
    options,
  );
}
export type PackageDataQueryHookResult = ReturnType<typeof usePackageDataQuery>;
export type PackageDataLazyQueryHookResult = ReturnType<
  typeof usePackageDataLazyQuery
>;
export type PackageDataQueryResult = Apollo.QueryResult<
  PackageDataQuery,
  PackageDataQueryVariables
>;
export const CardDataDocument = gql`
  query CardData {
    cardValues {
      id
      description
      image
      title
    }
  }
`;

/**
 * __useCardDataQuery__
 *
 * To run a query within a React component, call `useCardDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useCardDataQuery(
  baseOptions?: Apollo.QueryHookOptions<CardDataQuery, CardDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CardDataQuery, CardDataQueryVariables>(
    CardDataDocument,
    options,
  );
}
export function useCardDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    CardDataQuery,
    CardDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CardDataQuery, CardDataQueryVariables>(
    CardDataDocument,
    options,
  );
}
export type CardDataQueryHookResult = ReturnType<typeof useCardDataQuery>;
export type CardDataLazyQueryHookResult = ReturnType<
  typeof useCardDataLazyQuery
>;
export type CardDataQueryResult = Apollo.QueryResult<
  CardDataQuery,
  CardDataQueryVariables
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
export const UserDataDocument = gql`
  query UserData {
    userdata {
      dataUs
      email
      historyId
      supplierId
    }
  }
`;

/**
 * __useUserDataQuery__
 *
 * To run a query within a React component, call `useUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserDataQuery(
  baseOptions?: Apollo.QueryHookOptions<UserDataQuery, UserDataQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UserDataQuery, UserDataQueryVariables>(
    UserDataDocument,
    options,
  );
}
export function useUserDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    UserDataQuery,
    UserDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UserDataQuery, UserDataQueryVariables>(
    UserDataDocument,
    options,
  );
}
export type UserDataQueryHookResult = ReturnType<typeof useUserDataQuery>;
export type UserDataLazyQueryHookResult = ReturnType<
  typeof useUserDataLazyQuery
>;
export type UserDataQueryResult = Apollo.QueryResult<
  UserDataQuery,
  UserDataQueryVariables
>;
export const PeopleDocument = gql`
  query People {
    githubUsers {
      login
    }
    users {
      name
    }
  }
`;

/**
 * __usePeopleQuery__
 *
 * To run a query within a React component, call `usePeopleQuery` and pass it any options that fit your needs.
 * When your component renders, `usePeopleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePeopleQuery({
 *   variables: {
 *   },
 * });
 */
export function usePeopleQuery(
  baseOptions?: Apollo.QueryHookOptions<PeopleQuery, PeopleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PeopleQuery, PeopleQueryVariables>(
    PeopleDocument,
    options,
  );
}
export function usePeopleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PeopleQuery, PeopleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PeopleQuery, PeopleQueryVariables>(
    PeopleDocument,
    options,
  );
}
export type PeopleQueryHookResult = ReturnType<typeof usePeopleQuery>;
export type PeopleLazyQueryHookResult = ReturnType<typeof usePeopleLazyQuery>;
export type PeopleQueryResult = Apollo.QueryResult<
  PeopleQuery,
  PeopleQueryVariables
>;
