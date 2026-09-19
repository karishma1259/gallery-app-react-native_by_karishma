import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { ImageDetailScreen } from '@/screens/Main/ImageDetailScreen';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/useThemeStore';
import { RootStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isHydrating, loadSession } = useAuth();
  const { isHydrated: themeHydrated, loadTheme } = useThemeStore();

  useEffect(() => {
    loadSession();
    loadTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isHydrating) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="ImageDetail"
            component={ImageDetailScreen}
            options={{ headerShown: true, title: 'Image Details' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};