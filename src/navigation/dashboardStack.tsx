import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../screens/Dashboard/Dashboard';
import { DashboardStackParamList } from '../constants/types';
import VehicleDetailSection from '../screens/Dashboard/components/VehicleDetailSection/VehicleDetail';



const Stack = createNativeStackNavigator<DashboardStackParamList>();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={Dashboard} />
      <Stack.Screen name="DetailPage" component={VehicleDetailSection} />
    </Stack.Navigator>
  );
}
