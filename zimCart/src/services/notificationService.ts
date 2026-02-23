import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { customerApi } from './customer';

// Configure how notifications are handled when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.error('Permission not granted to get push token for push notification!');
      return;
    }
    
    // EAS Project ID is required for Expo Push Tokens
    const projectId = "4425a17b-8429-4b39-867a-d6bef87464b1";
    
    if (!projectId) {
      console.error('Project ID not found in app.json. Ensure EAS is configured.');
      return;
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('Expo Push Token:', pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      console.error('Error getting push token:', e);
    }
  } else {
    console.warn('Physical device required for Push Notifications');
  }
}

export async function saveTokenToBackend(pushToken: string) {
  try {
    await customerApi.updatePushToken(pushToken);
    console.log('Push token synced with backend successfully');
  } catch (error) {
    console.error('Failed to sync push token with backend:', error);
  }
}

export async function sendPushNotification(expoPushToken: string, title: string, body: string, data = {}) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
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
