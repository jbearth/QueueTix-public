import 'react-native-gesture-handler';
import React from 'react';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";

import { Provider } from 'react-redux';
import { DataProvider } from './src/hooks';
import AppNavigation from './src/navigation/App';


// Initialize Apollo Client
const client = new ApolloClient({
  uri: '',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </ApolloProvider>
  );
}
