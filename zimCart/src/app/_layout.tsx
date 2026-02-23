import React, { useEffect } from 'react';
import ignoreWarnings from '@/utils/ignoreWarnings';

// Clean up logs
ignoreWarnings();

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from '@/navigation/AppNavigator';
import "../global.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { useNotifications } from '@/hooks/useNotifications';

const queryClient = new QueryClient();

// Wrapper to initialize notifications inside providers
function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useNotifications();
  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <NotificationWrapper>
              <SafeAreaProvider>
                <StatusBar style="dark" />
                <AppNavigator />
              </SafeAreaProvider>
            </NotificationWrapper>
          </QueryClientProvider>
        </PersistGate>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
