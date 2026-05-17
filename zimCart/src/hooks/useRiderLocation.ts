import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { riderApi } from '@/services/rider';
import { useRiderJobs } from './useRider';

/** Share GPS with fleet while rider has an active out-for-delivery job. */
export function useRiderLocation(enabled: boolean) {
  const { data: activeJobs = [] } = useRiderJobs('active');
  const hasActiveDelivery = activeJobs.some((j) => j.dbStatus === 'SHIPPING');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled || !hasActiveDelivery) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let cancelled = false;

    const shareLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted' || cancelled) return;

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        await riderApi.updateLocation(pos.coords.latitude, pos.coords.longitude);
      } catch {
        // permission denied or GPS unavailable
      }
    };

    shareLocation();
    intervalRef.current = setInterval(shareLocation, 45_000);

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, hasActiveDelivery]);
}
