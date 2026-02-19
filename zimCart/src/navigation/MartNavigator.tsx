import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

function MartDashboard() {
  return <View><Text>Mart Dashboard</Text></View>;
}

export default function MartNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MartDashboard" component={MartDashboard} />
    </Stack.Navigator>
  );
}
