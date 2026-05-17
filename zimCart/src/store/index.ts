import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { Platform } from 'react-native';
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

/** Web + SSR: AsyncStorage touches `window`; SecureStore is not implemented on web. */
const webPersistStorage = {
  getItem: (key: string): Promise<string | null> => {
    try {
      if (typeof window === 'undefined') return Promise.resolve(null);
      return Promise.resolve(window.localStorage.getItem(key));
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    } catch {
      /* storage quota / private mode */
    }
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    try {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return Promise.resolve();
  },
};

const isWeb = Platform.OS === 'web';
const rootStorage = isWeb ? webPersistStorage : AsyncStorage;
const authStorage = isWeb ? webPersistStorage : expoSecureStorage;

const rootPersistConfig = {
  key: 'root',
  storage: rootStorage,
  whitelist: ['cart'], // Plain items go to unencrypted async asyncStorage
};

const authPersistConfig = {
  key: 'auth',
  storage: authStorage, // Native: SecureStore; web: localStorage (no hardware keystore)
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
