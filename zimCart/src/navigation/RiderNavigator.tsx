import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import RiderMainShell from '@/components/rider/RiderMainShell';
import RiderWelcomeScreen from '@/screens/rider/RiderWelcomeScreen';
import RiderLoginScreen from '@/screens/rider/RiderLoginScreen';
import RiderJobDetailScreen from '@/screens/rider/RiderJobDetailScreen';
import RiderNotificationsScreen from '@/screens/rider/RiderNotificationsScreen';
import RiderHelpScreen from '@/screens/rider/RiderHelpScreen';
import RiderChangePasswordScreen from '@/screens/rider/RiderChangePasswordScreen';
import RiderEditProfileScreen from '@/screens/rider/RiderEditProfileScreen';
import RiderWalletScreen from '@/screens/rider/RiderWalletScreen';

const Stack = createStackNavigator();

export default function RiderNavigator() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isRiderSession = isAuthenticated && user?.role === 'RIDER';

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isRiderSession ? 'RiderMain' : 'RiderWelcome'}
    >
      <Stack.Screen name="RiderWelcome" component={RiderWelcomeScreen} />
      <Stack.Screen name="RiderLogin" component={RiderLoginScreen} />
      <Stack.Screen name="RiderMain" component={RiderMainShell} />
      <Stack.Screen name="RiderJobDetail" component={RiderJobDetailScreen} />
      <Stack.Screen name="RiderNotifications" component={RiderNotificationsScreen} />
      <Stack.Screen name="RiderHelp" component={RiderHelpScreen} />
      <Stack.Screen name="RiderChangePassword" component={RiderChangePasswordScreen} />
      <Stack.Screen name="RiderEditProfile" component={RiderEditProfileScreen} />
      <Stack.Screen name="RiderWallet" component={RiderWalletScreen} />
    </Stack.Navigator>
  );
}
