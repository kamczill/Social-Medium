import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import mainReducer from "./state"
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { mainApi } from './services/mainApi';


const persistsConfig = { key: "root", storage, version: 1, whitelist: ['main']};
const mainPersistConfig = {key: "main", storage, blacklist: ['isLoggedIn', 'mode', 'user']}
const rootReducer = combineReducers({
  main: persistReducer(mainPersistConfig, mainReducer),
  [mainApi.reducerPath]: mainApi.reducer,
})
const persistedReducer = persistReducer(persistsConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([mainApi.middleware]),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  // </React.StrictMode>
);
