import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '@/screens/customer/OnboardingScreen';
import CustomerTabNavigator from '@/navigation/CustomerTabNavigator';
import CustomerLoginScreen from '@/screens/customer/CustomerLoginScreen';
import CustomerRegisterScreen from '@/screens/customer/CustomerRegisterScreen';
import ForgotPasswordScreen from '@/screens/customer/ForgotPasswordScreen';
import ResetPasswordScreen from '@/screens/customer/ResetPasswordScreen';
import EditProfileScreen from '@/screens/customer/EditProfileScreen';

import SavedAddressesScreen from '@/screens/customer/SavedAddressesScreen';
import PaymentMethodsScreen from '../screens/customer/PaymentMethodsScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import PrivacySecurityScreen from '@/screens/customer/PrivacySecurityScreen';
import ChangePasswordScreen from '@/screens/customer/ChangePasswordScreen';
import Verify2FAScreen from '@/screens/customer/Verify2FAScreen';
import ManageDataScreen from '@/screens/customer/ManageDataScreen';
import VerifyResetCodeScreen from '@/screens/customer/VerifyResetCodeScreen';
import PrivacyPolicyScreen from '@/screens/customer/PrivacyPolicyScreen';
import ManageDevicesScreen from '@/screens/customer/ManageDevicesScreen';
import HelpSupportScreen from '@/screens/customer/HelpSupportScreen';
import ChatSupportScreen from '@/screens/customer/ChatSupportScreen';
import PremiumScreen from '@/screens/customer/PremiumScreen';
import OrdersScreen from '@/screens/customer/OrdersScreen';
import VouchersScreen from '@/screens/customer/VouchersScreen';
import FavouritesScreen from '@/screens/customer/FavouritesScreen';

const Stack = createStackNavigator();

export default function CustomerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={CustomerTabNavigator} />
      <Stack.Screen name="CustomerLogin" component={CustomerLoginScreen} />
      <Stack.Screen name="CustomerRegister" component={CustomerRegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyResetCode" component={VerifyResetCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Verify2FA" component={Verify2FAScreen} />
      <Stack.Screen name="ManageData" component={ManageDataScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="ManageDevices" component={ManageDevicesScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="ChatSupport" component={ChatSupportScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Vouchers" component={VouchersScreen} />
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
    </Stack.Navigator>
  );
}
