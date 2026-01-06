import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { RootState } from './src/store/store';
import NetInfo from '@react-native-community/netinfo';

// Redux store
import { store } from './src/store/store';

import SplashScreen from './src/screens/SplashScreen';
import Login from './src/screens/Login/Login';
import ProtectedDrawer from './src/navigation/drawer';
import { Vehicle } from './src/constants/types';
import useLoadAuth from './src/hooks/useLoadAuthHook';
import NoInternet from './src/screens/NoInternet/NoInternet';

// Define navigation types
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined; // will load drawer
  Detail: { item: Vehicle };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      {/* other auth screens here */}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

function AppContent() {
  useLoadAuth(); // ✅ Runs auth loading

  const { authLoading, token } = useSelector((state: RootState) => state.auth);
  console.log('🔍 App.tsx - authLoading:', authLoading, 'token:', token);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
console.log('token', token)
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return <SplashScreen autoNavigate={false} />;
  }
  
  if (isConnected === false) {
    return <NoInternet />;
  }

  return (
    <NavigationContainer>
      {token ? <ProtectedDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}
