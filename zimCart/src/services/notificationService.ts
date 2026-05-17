import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { customerApi } from './customer';
import { riderApi } from './rider';
import { store } from '@/store';

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null = null;
let handlerConfigured = false;

/**
 * Remote Expo Push tokens are not available in Expo Go (SDK 53+, especially Android).
 * Use a development build (`expo run:android` / EAS dev client) for push testing.
 */
export function isRemotePushAvailable(): boolean {
  if (Platform.OS === 'web') return false;
  if (Constants.appOwnership === 'expo') return false;
  return Device.isDevice;
}

async function loadNotificationsModule(): Promise<NotificationsModule | null> {
  if (!isRemotePushAvailable()) return null;

  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');

    if (!handlerConfigured) {
      notificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      handlerConfigured = true;
    }
  }

  return notificationsModule;
}

/** @deprecated Use isRemotePushAvailable */
export function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    if (__DEV__ && isExpoGo()) {
      console.info(
        '[ZimCart] Push registration skipped in Expo Go. Run a development build for remote notifications.'
      );
    }
    return undefined;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    if (__DEV__) {
      console.warn('Push permission not granted; skipping Expo Push token.');
    }
    return undefined;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    '4425a17b-8429-4b39-867a-d6bef87464b1';

  if (!projectId) {
    console.warn('EAS project ID missing; cannot obtain Expo Push token.');
    return undefined;
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    if (__DEV__) {
      console.log('Expo Push Token:', pushTokenString);
    }
    return pushTokenString;
  } catch (e: unknown) {
    console.warn('Could not obtain Expo Push token:', e);
    return undefined;
  }
}

export async function saveTokenToBackend(pushToken: string) {
  try {
    const role = store.getState().auth.user?.role;
    if (role === 'RIDER') {
      await riderApi.updatePushToken(pushToken);
    } else {
      await customerApi.updatePushToken(pushToken);
    }
    if (__DEV__) {
      console.log('Push token synced with backend successfully');
    }
  } catch (error) {
    console.error('Failed to sync push token with backend:', error);
  }
}

export async function addNotificationListeners(handlers: {
  onReceived?: (notification: NotificationsModule['Notification']) => void;
  onResponse?: (response: NotificationsModule['NotificationResponse']) => void;
}): Promise<() => void> {
  const Notifications = await loadNotificationsModule();
  if (!Notifications) return () => {};

  const receivedSub =
    handlers.onReceived &&
    Notifications.addNotificationReceivedListener(handlers.onReceived);
  const responseSub =
    handlers.onResponse &&
    Notifications.addNotificationResponseReceivedListener(handlers.onResponse);

  return () => {
    receivedSub?.remove();
    responseSub?.remove();
  };
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {}
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title,
    body,
    data,
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}
