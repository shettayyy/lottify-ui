'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { onError } from '@apollo/link-error';
import { LocalForageWrapper, persistCache } from 'apollo3-cache-persist';
import localforage from 'localforage';
import { useCallback, useEffect, useMemo, useState } from 'react';

const makeClient = (cache: NextSSRInMemoryCache) => () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  });

  const errorLink = onError(({ networkError, operation }) => {
    // Check if the networkError is due to the user being offline
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      if (networkError && !navigator.onLine) {
        // Suppress the network error when offline
        operation.setContext({ error: false });
      }
    }
  });

  return new NextSSRApolloClient({
    cache,
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : ApolloLink.from([errorLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
};

const useMakeClient = () => {
  const [persisting, setPersisting] = useState(true);
  const cache = useMemo(() => new NextSSRInMemoryCache(), []);

  const persisGraphQLCache = useCallback(async () => {
    await persistCache({
      cache,
      storage: new LocalForageWrapper(localforage),
      key: `apollo-cache-lottify-ui-${process.env.NODE_ENV}`,
    });
    setPersisting(false);
  }, [cache]);

  useEffect(() => {
    void persisGraphQLCache();
  }, [persisGraphQLCache]);

  return {
    persisting,
    cache,
  };
};

export function ApolloProvider({ children }: React.PropsWithChildren) {
  const { persisting, cache } = useMakeClient();

  if (persisting) {
    return null;
  }

  return (
    <ApolloNextAppProvider makeClient={makeClient(cache)}>
      {children}
    </ApolloNextAppProvider>
  );
}
