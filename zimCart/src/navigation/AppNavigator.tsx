import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerNavigator from './CustomerNavigator';
import RiderNavigator from './RiderNavigator';
import MartNavigator from './MartNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
          <Stack.Screen name="RiderApp" component={RiderNavigator} />
          <Stack.Screen name="MartApp" component={MartNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
