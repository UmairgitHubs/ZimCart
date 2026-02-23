import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { registerForPushNotificationsAsync, saveTokenToBackend } from '../services/notificationService';

export function useNotifications() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // 1. Register for tokens
    registerForPushNotificationsAsync().then(pushToken => {
      setExpoPushToken(pushToken);
      
      // ONLY sync to backend if we have a token AND the user is logged in
      if (pushToken && token) {
        saveTokenToBackend(pushToken);
      }
    });

    // 2. Listen for incoming notifications while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // 3. Listen for interactions (when user taps the notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Tapped:', response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [token]); // Re-run whenever auth token changes

  return {
    expoPushToken,
    notification,
  };
}
