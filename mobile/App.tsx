import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import { useAuthStore } from './src/stores/useAuthStore';
import { colors } from './src/constants';

// 禁用原生 screens，使用 JS 实现
enableScreens(false);

const App: React.FC = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // 应用启动时检查登录状态
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.card}
        />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
