import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RiderJobsScreen from '@/screens/rider/RiderJobsScreen';
import RiderEarningsScreen from '@/screens/rider/RiderEarningsScreen';
import RiderProfileScreen from '@/screens/rider/RiderProfileScreen';
import { useRiderProfile } from '@/hooks/useRider';

const Tab = createBottomTabNavigator();

const TEAL = '#0d9488';
const INACTIVE = '#94a3b8';

export default function RiderTabNavigator() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useRiderProfile();
  const activeCount = profile?.stats.activeJobs ?? 0;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: TEAL,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: Platform.OS === 'ios' ? 88 + insets.bottom / 2 : 68 + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 8,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="RiderJobsTab"
        component={RiderJobsScreen}
        options={{
          tabBarLabel: 'Deliveries',
          tabBarBadge: activeCount > 0 ? activeCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RiderEarningsTab"
        component={RiderEarningsScreen}
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="RiderProfileTab"
        component={RiderProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account-circle' : 'account-circle-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
