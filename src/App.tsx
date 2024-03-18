import React, { FC } from "react";
import {
  ApolloClient,
  ApolloProvider
} from "@apollo/client";

import { AuthProvider } from "./data/Auth";

import NavigationScroll from "layout/NavigationScroll";

import Routes from "routes";

import ThemeProvider from "./constants/themes";

import { HelmetProvider } from "react-helmet-async";

const App: FC<{ client: ApolloClient<any> }> = ({ client }) => {

  return (
    <ApolloProvider client={client}>
      {/* @ts-ignore */}
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationScroll>
              <Routes />
            </NavigationScroll>
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ApolloProvider>
  );
}

export default App;