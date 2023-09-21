import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CardValue = {
  __typename?: 'CardValue';
  description: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  image: Scalars['String'];
  title: Scalars['String'];
};

export type GithubUser = {
  __typename?: 'GithubUser';
  avatarUrl: Scalars['String'];
  id: Scalars['ID'];
  login: Scalars['String'];
};

export type Leagues = {
  __typename?: 'Leagues';
  country: Scalars['String'];
  name: Scalars['String'];
  teams?: Maybe<Array<Scalars['String']>>;
};

export type Players = {
  __typename?: 'Players';
  Assists?: Maybe<Scalars['Int']>;
  Goals?: Maybe<Scalars['Int']>;
  League: Scalars['String'];
  country: Scalars['String'];
  id?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  number?: Maybe<Scalars['Int']>;
  playTime?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  session?: Maybe<Scalars['Int']>;
  surname: Scalars['String'];
  team: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  cardValues: Array<Maybe<CardValue>>;
  githubUsers: Array<GithubUser>;
  leagues: Array<Leagues>;
  players: Array<Players>;
  teams: Array<Teams>;
  users: Array<User>;
};


export type QueryTeamsArgs = {
  league?: InputMaybe<Scalars['String']>;
  season?: InputMaybe<Scalars['String']>;
  team?: InputMaybe<Scalars['String']>;
};

export type Teams = {
  __typename?: 'Teams';
  league?: Maybe<Scalars['String']>;
  season?: Maybe<Scalars['String']>;
  team?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  name?: Maybe<Scalars['String']>;
};

export type CardDataQueryVariables = Exact<{ [key: string]: never; }>;


export type CardDataQuery = { __typename?: 'Query', cardValues: Array<{ __typename?: 'CardValue', id?: number | null, description: string, image: string, title: string } | null> };

export type LeaguesQueryVariables = Exact<{ [key: string]: never; }>;


export type LeaguesQuery = { __typename?: 'Query', leagues: Array<{ __typename?: 'Leagues', name: string, country: string, teams?: Array<string> | null }> };

export type PlayerQueryVariables = Exact<{ [key: string]: never; }>;


export type PlayerQuery = { __typename?: 'Query', players: Array<{ __typename?: 'Players', country: string, number?: number | null, team: string, name: string, surname: string, position?: number | null }> };

export type TeamQueryVariables = Exact<{
  team?: InputMaybe<Scalars['String']>;
  season?: InputMaybe<Scalars['String']>;
  league?: InputMaybe<Scalars['String']>;
}>;


export type TeamQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Teams', team?: string | null, season?: string | null, league?: string | null }> };

export type PeopleQueryVariables = Exact<{ [key: string]: never; }>;


export type PeopleQuery = { __typename?: 'Query', githubUsers: Array<{ __typename?: 'GithubUser', login: string }>, users: Array<{ __typename?: 'User', name?: string | null }> };


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
export function useCardDataQuery(baseOptions?: Apollo.QueryHookOptions<CardDataQuery, CardDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardDataQuery, CardDataQueryVariables>(CardDataDocument, options);
      }
export function useCardDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardDataQuery, CardDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardDataQuery, CardDataQueryVariables>(CardDataDocument, options);
        }
export type CardDataQueryHookResult = ReturnType<typeof useCardDataQuery>;
export type CardDataLazyQueryHookResult = ReturnType<typeof useCardDataLazyQuery>;
export type CardDataQueryResult = Apollo.QueryResult<CardDataQuery, CardDataQueryVariables>;
export const LeaguesDocument = gql`
    query Leagues {
  leagues {
    name
    country
    teams
  }
}
    `;

/**
 * __useLeaguesQuery__
 *
 * To run a query within a React component, call `useLeaguesQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaguesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaguesQuery({
 *   variables: {
 *   },
 * });
 */
export function useLeaguesQuery(baseOptions?: Apollo.QueryHookOptions<LeaguesQuery, LeaguesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LeaguesQuery, LeaguesQueryVariables>(LeaguesDocument, options);
      }
export function useLeaguesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LeaguesQuery, LeaguesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LeaguesQuery, LeaguesQueryVariables>(LeaguesDocument, options);
        }
export type LeaguesQueryHookResult = ReturnType<typeof useLeaguesQuery>;
export type LeaguesLazyQueryHookResult = ReturnType<typeof useLeaguesLazyQuery>;
export type LeaguesQueryResult = Apollo.QueryResult<LeaguesQuery, LeaguesQueryVariables>;
export const PlayerDocument = gql`
    query Player {
  players {
    country
    number
    team
    name
    surname
    position
  }
}
    `;

/**
 * __usePlayerQuery__
 *
 * To run a query within a React component, call `usePlayerQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayerQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlayerQuery(baseOptions?: Apollo.QueryHookOptions<PlayerQuery, PlayerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlayerQuery, PlayerQueryVariables>(PlayerDocument, options);
      }
export function usePlayerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlayerQuery, PlayerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlayerQuery, PlayerQueryVariables>(PlayerDocument, options);
        }
export type PlayerQueryHookResult = ReturnType<typeof usePlayerQuery>;
export type PlayerLazyQueryHookResult = ReturnType<typeof usePlayerLazyQuery>;
export type PlayerQueryResult = Apollo.QueryResult<PlayerQuery, PlayerQueryVariables>;
export const TeamDocument = gql`
    query Team($team: String, $season: String, $league: String) {
  teams(team: $team, season: $season, league: $league) {
    team
    season
    league
  }
}
    `;

/**
 * __useTeamQuery__
 *
 * To run a query within a React component, call `useTeamQuery` and pass it any options that fit your needs.
 * When your component renders, `useTeamQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTeamQuery({
 *   variables: {
 *      team: // value for 'team'
 *      season: // value for 'season'
 *      league: // value for 'league'
 *   },
 * });
 */
export function useTeamQuery(baseOptions?: Apollo.QueryHookOptions<TeamQuery, TeamQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TeamQuery, TeamQueryVariables>(TeamDocument, options);
      }
export function useTeamLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TeamQuery, TeamQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TeamQuery, TeamQueryVariables>(TeamDocument, options);
        }
export type TeamQueryHookResult = ReturnType<typeof useTeamQuery>;
export type TeamLazyQueryHookResult = ReturnType<typeof useTeamLazyQuery>;
export type TeamQueryResult = Apollo.QueryResult<TeamQuery, TeamQueryVariables>;
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
export function usePeopleQuery(baseOptions?: Apollo.QueryHookOptions<PeopleQuery, PeopleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PeopleQuery, PeopleQueryVariables>(PeopleDocument, options);
      }
export function usePeopleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PeopleQuery, PeopleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PeopleQuery, PeopleQueryVariables>(PeopleDocument, options);
        }
export type PeopleQueryHookResult = ReturnType<typeof usePeopleQuery>;
export type PeopleLazyQueryHookResult = ReturnType<typeof usePeopleLazyQuery>;
export type PeopleQueryResult = Apollo.QueryResult<PeopleQuery, PeopleQueryVariables>;