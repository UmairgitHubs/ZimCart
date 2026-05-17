import {
  CommonActions,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import type { User } from '@/types';

export type AppRootRoute = 'CustomerApp' | 'RiderApp' | 'MartApp';

/** Maps auth role to the root stack screen in AppNavigator. */
export function getAppRouteForRole(role: string): AppRootRoute {
  switch (role) {
    case 'RIDER':
      return 'RiderApp';
    case 'STORE_MANAGER':
      return 'MartApp';
    case 'ADMIN':
    case 'CUSTOMER':
    default:
      return 'CustomerApp';
  }
}

function getNavigatorRouteNames(nav: NavigationProp<ParamListBase>): string[] {
  const state = nav.getState?.();
  return state?.routeNames ?? [];
}

/** Tab registered as `CartTab` in CustomerTabNavigator — not `Cart`. */
export function goToCartTab(navigation: NavigationProp<ParamListBase>) {
  let nav: NavigationProp<ParamListBase> | undefined = navigation;

  while (nav) {
    const names = getNavigatorRouteNames(nav);

    if (names.includes('CartTab')) {
      nav.navigate('CartTab' as never);
      return;
    }

    if (names.includes('Main')) {
      nav.navigate('Main' as never, { screen: 'CartTab' } as never);
      return;
    }

    nav = nav.getParent?.() as NavigationProp<ParamListBase> | undefined;
  }

  navigation.navigate('Main' as never, { screen: 'CartTab' } as never);
}

export function goToMainTab(
  navigation: NavigationProp<ParamListBase>,
  screen: 'HomeTab' | 'GroceryTab' | 'SearchTab' | 'CartTab' | 'ProfileTab'
) {
  let nav: NavigationProp<ParamListBase> | undefined = navigation;

  while (nav) {
    const names = getNavigatorRouteNames(nav);

    if (names.includes(screen)) {
      nav.navigate(screen as never);
      return;
    }

    if (names.includes('Main')) {
      nav.navigate('Main' as never, { screen } as never);
      return;
    }

    nav = nav.getParent?.() as NavigationProp<ParamListBase> | undefined;
  }

  navigation.navigate('Main' as never, { screen } as never);
}

export function goToStoreDetail(
  navigation: NavigationProp<ParamListBase>,
  mart: Record<string, unknown>
) {
  navigation.navigate('StoreDetail', { mart });
}

function getRootNavigation(navigation: NavigationProp<ParamListBase>) {
  let current: NavigationProp<ParamListBase> = navigation;
  while (current.getParent?.()) {
    current = current.getParent() as NavigationProp<ParamListBase>;
  }
  return current;
}

export function resetToRiderWelcome(navigation: NavigationProp<ParamListBase>) {
  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'RiderApp',
          state: { index: 0, routes: [{ name: 'RiderWelcome' }] },
        },
      ],
    })
  );
}

/** After sign-out: return to browse home (not splash onboarding). */
export function resetToCustomerMain(navigation: NavigationProp<ParamListBase>) {
  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'CustomerApp',
          state: { index: 0, routes: [{ name: 'Main' }] },
        },
      ],
    })
  );
}

/** First launch only — marketing onboarding slides. */
export function resetToCustomerOnboarding(navigation: NavigationProp<ParamListBase>) {
  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'CustomerApp',
          state: { index: 0, routes: [{ name: 'Onboarding' }] },
        },
      ],
    })
  );
}

export function resetToAppForUser(navigation: NavigationProp<ParamListBase>, user: User) {
  const appRoute = getAppRouteForRole(user.role);
  const root = getRootNavigation(navigation);

  if (appRoute === 'RiderApp') {
    root.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'RiderApp',
            state: { index: 0, routes: [{ name: 'RiderMain' }] },
          },
        ],
      })
    );
    return;
  }

  if (appRoute === 'MartApp') {
    root.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MartApp' }],
      })
    );
    return;
  }

  root.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: 'CustomerApp',
          state: { index: 0, routes: [{ name: 'Main' }] },
        },
      ],
    })
  );
}

export function resolveMartFromRoute(params?: { mart?: unknown; store?: unknown }) {
  const raw = params?.mart ?? params?.store;
  if (raw && typeof raw === 'object' && 'id' in raw && (raw as { id: string }).id) {
    return raw as {
      id: string;
      name: string;
      image?: string;
      rating?: number;
      deliveryTime?: string;
      deliveryFee?: string | number;
      tags?: string[];
    };
  }
  return null;
}
