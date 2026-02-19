import { createStackNavigator } from '@react-navigation/stack';
import CustomerNavigator from './CustomerNavigator';
import RiderNavigator from './RiderNavigator';
import MartNavigator from './MartNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 
        This is where you'd conditionally render based on generic auth state or user role.
        For now, we default to Customer.
      */}
      <Stack.Screen name="CustomerApp" component={CustomerNavigator} />
      <Stack.Screen name="RiderApp" component={RiderNavigator} />
      <Stack.Screen name="MartApp" component={MartNavigator} />
    </Stack.Navigator>
  );
}
