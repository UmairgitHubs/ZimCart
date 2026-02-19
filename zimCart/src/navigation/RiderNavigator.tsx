import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

function RiderDashboard() {
  return <View><Text>Rider Dashboard</Text></View>;
}

export default function RiderNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RiderDashboard" component={RiderDashboard} />
    </Stack.Navigator>
  );
}
