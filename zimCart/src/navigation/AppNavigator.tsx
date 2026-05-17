import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import CustomerNavigator from './CustomerNavigator';
import RiderNavigator from './RiderNavigator';
import MartNavigator from './MartNavigator';
import { getAppRouteForRole } from '@/utils/navigation';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const initialRoute =
    isAuthenticated && user?.role ? getAppRouteForRole(user.role) : 'CustomerApp';

  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initialRoute}
        >
          <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
          <Stack.Screen name="RiderApp" component={RiderNavigator} />
          <Stack.Screen name="MartApp" component={MartNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
