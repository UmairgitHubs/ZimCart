import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import authReducer from './slices/auth.slice';
import cartReducer from './slices/cart.slice';

// Enterprise Security Engine for Tokens
const sanitizeKey = (key: string) => key.replace(/[^a-zA-Z0-9.\-_]/g, '-');

const expoSecureStorage = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(sanitizeKey(key));
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(sanitizeKey(key), value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(sanitizeKey(key));
  },
};

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['cart'], // Plain items go to unencrypted async asyncStorage
};

const authPersistConfig = {
  key: 'auth',
  storage: expoSecureStorage, // Auth slice goes explicitly to encrypted hardware
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // Nested secure persist
  cart: cartReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      }, 
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
