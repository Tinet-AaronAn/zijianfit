jest.mock('@react-native/js-polyfills/error-guard', () => ({}), { virtual: true });

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaConsumer: ({ children }: { children: any }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  initialWindowMetrics: { insets: { top: 0, bottom: 0, left: 0, right: 0 } },
}));

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: ({ children }: { children: React.ReactNode }) => children,
  ScreenContainer: ({ children }: { children: React.ReactNode }) => children,
  NativeScreen: ({ children }: { children: React.ReactNode }) => children,
  NativeScreenContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
    Group: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: ({ children }: { children: React.ReactNode }) => children,
  }),
}));

jest.mock('react-native-orientation-locker', () => ({
  unlockAllOrientations: jest.fn(),
  lockToPortrait: jest.fn(),
  lockToLandscape: jest.fn(),
  getOrientation: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));
