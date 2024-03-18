import React from "react";
import ReactDOM from 'react-dom/client'
import "./index.css";
import App from "./App.tsx";
import { Provider } from 'react-redux';
import { store } from 'store';
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

// Setup client
export const client = new ApolloClient({
  uri: "https://b6d6-184-22-21-44.ngrok-free.app/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // @ts-ignore
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App client={client} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)