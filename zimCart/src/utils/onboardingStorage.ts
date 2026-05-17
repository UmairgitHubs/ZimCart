import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@zimcart/customer_onboarding_complete';

export async function hasCompletedCustomerOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setCustomerOnboardingComplete(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch {
    // non-fatal
  }
}
