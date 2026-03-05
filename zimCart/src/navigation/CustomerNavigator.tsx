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
import NotificationSettingsScreen from '../screens/customer/NotificationSettingsScreen';
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
import OffersScreen from '@/screens/customer/OffersScreen';
import MartsScreen from '@/screens/customer/MartsScreen';
import NewInScreen from '@/screens/customer/NewInScreen';
import PickupScreen from '@/screens/customer/PickupScreen';
import TechScreen from '@/screens/customer/TechScreen';
import FashionScreen from '@/screens/customer/FashionScreen';
import BeautyScreen from '@/screens/customer/BeautyScreen';
import HomeDecorScreen from '@/screens/customer/HomeDecorScreen';
import TechSaleScreen from '@/screens/customer/TechSaleScreen';
import GroceryBundleScreen from '@/screens/customer/GroceryBundleScreen';
import FashionWeekScreen from '@/screens/customer/FashionWeekScreen';
import StoreDetailScreen from '@/screens/customer/StoreDetailScreen';
import CategoryDetailScreen from '@/screens/customer/CategoryDetailScreen';
import ProductDetailScreen from '@/screens/customer/ProductDetailScreen';
import PetCareScreen from '@/screens/customer/PetCareScreen';

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
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
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
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen name="Marts" component={MartsScreen} />
      <Stack.Screen name="NewIn" component={NewInScreen} />
      <Stack.Screen name="Pickup" component={PickupScreen} />
      <Stack.Screen name="Tech" component={TechScreen} />
      <Stack.Screen name="Fashion" component={FashionScreen} />
      <Stack.Screen name="Beauty" component={BeautyScreen} />
      <Stack.Screen name="HomeDecor" component={HomeDecorScreen} />
      <Stack.Screen name="TechSale" component={TechSaleScreen} />
      <Stack.Screen name="GroceryBundle" component={GroceryBundleScreen} />
      <Stack.Screen name="FashionWeek" component={FashionWeekScreen} />
      <Stack.Screen name="StoreDetail" component={StoreDetailScreen} />
      <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="PetCare" component={PetCareScreen} />
    </Stack.Navigator>
  );
}
