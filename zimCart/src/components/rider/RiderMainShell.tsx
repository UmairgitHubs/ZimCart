import React from 'react';
import { useRiderSocket } from '@/hooks/useRiderSocket';
import { useRiderLocation } from '@/hooks/useRiderLocation';
import RiderTabNavigator from '@/navigation/RiderTabNavigator';

/** Wraps rider tabs with real-time socket + GPS while on delivery. */
export default function RiderMainShell() {
  useRiderSocket();
  useRiderLocation(true);
  return <RiderTabNavigator />;
}
