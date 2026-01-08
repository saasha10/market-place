import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import { watchAuthState } from '@/services/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
  AuthLogin: undefined;
  AuthRegister: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = watchAuthState((user) => {
      setIsAuthenticated(!!user);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const content = useMemo(() => {
    if (initializing) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={HomeScreen} options={{ headerShown: false }} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="AuthLogin" component={LoginScreen} options={{ title: 'Sign In' }} />
            <Stack.Screen
              name="AuthRegister"
              component={RegisterScreen}
              options={{ title: 'Create Account' }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    );
  }, [initializing, isAuthenticated]);

  return <NavigationContainer>{content}</NavigationContainer>;
}
