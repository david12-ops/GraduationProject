import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
// import { auth } from '../components/userContext';
const isServer = typeof window === 'undefined';
// source: https://github.com/shshaw/next-apollo-ssr
// @ts-ignore
const windowApolloState = !isServer && window.__NEXT_DATA__.apolloState;
let CLIENT: ApolloClient<any>;
const endpoint = '/api/graphql';
const logoutLink = (logout: VoidFunction) =>
  onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
      // todo: tiny refactor when working..
      console.info(JSON.stringify(networkError));
      // {"name":"ServerError","response":{},"statusCode":200,"result":{"timestamp":"2022-08-04T06:50:18.843987244","error":"Unauthorized","status":401,"message":"invalid token","path":"/graphql"}}
      // @ts-ignore we know
      if (networkError?.result?.error === 'Unauthorized') {
        logout();
      }
    }
    if (graphQLErrors?.[0]?.message === 'Unauthorized') {
      logout();
    }
  });
const httpLink = (): HttpLink => {
  if (typeof window === 'undefined') {
    return new HttpLink({
      uri: endpoint,
      credentials: 'same-origin',
      headers: {},
    });
  }
  return new HttpLink({
    uri: endpoint,
    credentials: 'same-origin',
    headers: {
      // every header should be allowed in CORS
    },
  });
};

type ApolloClientProps =
  | {
      forceNew?: false;
      logout?: VoidFunction;
    }
  | {
      forceNew: true;
    };
export function getApolloClient(parameters: ApolloClientProps) {
  const forceNew = parameters?.forceNew;
  const logout = !parameters.forceNew ? parameters.logout : undefined;
  if (!CLIENT || forceNew) {
    CLIENT = new ApolloClient({
      ssrMode: isServer,
      uri: endpoint,
      cache: new InMemoryCache().restore(windowApolloState || {}),
      credentials: 'same-origin',
      link: ApolloLink.from(isServer || !logout ? [httpLink()] : [logoutLink(logout), httpLink()]),
      /**
        // Default options to disable SSR for all queries.
        defaultOptions: {
          // Skip queries when server side rendering
          // https://www.apollographql.com/docs/react/data/queries/#ssr
          watchQuery: {
            ssr: false
          },
          query: {
            ssr: false
          }
          // Selectively enable specific queries like so:
          // `useQuery(QUERY, { ssr: true });`
        }
      */
    });
  }
  return CLIENT;
}