import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  registerForPushNotificationsAsync,
  saveTokenToBackend,
  addNotificationListeners,
  isRemotePushAvailable,
} from '../services/notificationService';

export function useNotifications() {
  const { token } = useSelector((state: RootState) => state.auth);
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<unknown>(undefined);

  useEffect(() => {
    let removeListeners: (() => void) | undefined;
    let cancelled = false;

    const setup = async () => {
      const pushToken = await registerForPushNotificationsAsync();
      if (cancelled) return;

      setExpoPushToken(pushToken);
      if (pushToken && token) {
        await saveTokenToBackend(pushToken);
      }

      if (!isRemotePushAvailable()) return;

      removeListeners = await addNotificationListeners({
        onReceived: (n) => setNotification(n),
        onResponse: (response) => {
          if (__DEV__) {
            console.log('Notification tapped:', response);
          }
        },
      });
    };

    setup();

    return () => {
      cancelled = true;
      removeListeners?.();
    };
  }, [token]);

  return {
    expoPushToken,
    notification,
  };
}
