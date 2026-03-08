import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../constants';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import WorkoutSessionScreen from '../screens/WorkoutSessionScreen';
import FollowWorkoutScreen from '../screens/FollowWorkoutScreen';
import StatsScreen from '../screens/StatsScreen';

// Store
import { useAuthStore } from '../stores/useAuthStore';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  WorkoutDetail: { planId: string; dayOfWeek: number };
  WorkoutSession: { planId: string; exercises: any[] };
  FollowWorkout: {
    id: string;
    planId: string;
    dayOfWeek: number;
    type: 'strength' | 'cardio';
    videoUrl?: string;
    title: string;
    targetRounds: number;
    duration: number;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 底部导航图标
const TabBarIcon = ({ route, focused }: { route: string; focused: boolean }) => {
  const icons: { [key: string]: string } = {
    Home: '🏠',
    Stats: '📊',
  };

  return (
    <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>
      {icons[route] || '📱'}
    </Text>
  );
};

// 主页面Tab导航
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabBarIcon route={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{ tabBarLabel: '统计' }}
      />
    </Tab.Navigator>
  );
};

// 认证导航
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// 主导航
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{
          headerShown: true,
          title: '训练详情',
          headerTintColor: colors.text.primary,
          headerStyle: {
            backgroundColor: colors.card,
          },
        }}
      />
      <Stack.Screen
        name="WorkoutSession"
        component={WorkoutSessionScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="FollowWorkout"
        component={FollowWorkoutScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

// 根导航
const RootNavigator = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
