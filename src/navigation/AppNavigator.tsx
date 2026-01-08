import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import ProductDetail from '@/screens/products/ProductDetail';
import ProductsList from '@/screens/products/ProductsList';
import ShippingCheckout from '@/screens/checkout/ShippingCheckout';
import { watchAuthState } from '@/services/auth';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
  AuthLogin: undefined;
  AuthRegister: undefined;
  App: undefined;
  Home: undefined;
  Products: undefined;
  ProductDetail: { productId: string };
  ShippingCheckout: { orderId: string; productId: string };
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
          <Stack.Group>
            <Stack.Screen name="App" component={HomeScreen} options={{ title: 'MarketPlace' }} />
            <Stack.Screen name="Products" component={ProductsList} options={{ title: 'Marketplace' }} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen
              name="ShippingCheckout"
              component={ShippingCheckout}
              options={{ title: 'Shipping Address' }}
            />
          </Stack.Group>
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
