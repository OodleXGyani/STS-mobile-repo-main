import React, { useEffect, useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Button, StyleSheet } from 'react-native';
import CustomDrawerContent from './customDrawer';
import { moderateScale } from 'react-native-size-matters';
import DashboardStack from './dashboardStack';
import { MenuProvider } from 'react-native-popup-menu';

import VehicleManagement from '../screens/VehicleManagement/VehicleManagement';
import DriverManagement from '../screens/DriverManagement/DriverManagement';
import SystemAdmin from '../screens/SystemAdmin/SystemAdmin';
import ReportsScreen from '../screens/Reports';
import ReportDetail from '../screens/Reports/components/ReportDetailSection';
import UserManagementStack from './userManagementStack';
import { useGetUserQuery } from '../services/user';
import * as Keychain from 'react-native-keychain';
import MonthlySummaryReport from '../screens/Reports/components/MonthlySummaryReport';
import TripReport from '../screens/Reports/components/TripReport';
import TripMapPage from '../screens/Reports/components/TripReport/components/TripMapPage';
import { DailySummaryReport } from '../screens/Reports/components/DailySummaryReport';
import { WeeklySummaryReport } from '../screens/Reports/components/WeeklySummaryReport';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { setUser } from '../store/userSlice';
import VehicleScoringReportList from '../screens/Reports/components/VehicleScoringReportList/VehicleScoringReportList';
import PositionActivityReportList from '../screens/Reports/components/PositionActivityReportList/PositionActivityReportList';
import SpeedVoilationReportList from '../screens/Reports/components/SpeedVoilationReportList/SpeedVoilationReportList';
import { LocationMap } from '../components/LocationMap';
import GeoFenceReportList from '../screens/Reports/components/GeoFenceReportList/GeoFenceReportList';

const Drawer = createDrawerNavigator();
const ReportsStack = createNativeStackNavigator();

// Stack Navigator for all Reports related screens
function ReportsStackNavigator() {
  return (
    <ReportsStack.Navigator screenOptions={{ headerShown: false }}>
      <ReportsStack.Screen name="ReportsList" component={ReportsScreen} />
      <ReportsStack.Screen name="ReportDetail" component={ReportDetail} />
      <ReportsStack.Screen name="PositionActivityReportList" component={PositionActivityReportList} />
      <ReportsStack.Screen name="VehicleScoringReportList" component={VehicleScoringReportList} />
      <ReportsStack.Screen name="SpeedVoilationReportList" component={SpeedVoilationReportList} />
      <ReportsStack.Screen name="MonthlySummaryReport" component={MonthlySummaryReport} />
      <ReportsStack.Screen name="WeeklySummaryReport" component={WeeklySummaryReport} />
      <ReportsStack.Screen name="DailySummaryReport" component={DailySummaryReport} />
      <ReportsStack.Screen name="TripReport" component={TripReport} />
      <ReportsStack.Screen name="TripMapPage" component={TripMapPage} />
      <ReportsStack.Screen name="GeoFenceReportList" component={GeoFenceReportList} />
      <ReportsStack.Screen name="LocationMap" component={LocationMap} />
    </ReportsStack.Navigator>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
}

export default function ProtectedDrawer() {
  const { data, refetch } = useGetUserQuery();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (data && data[0]) {
      const user = data[0];

      dispatch(setUser(user));

      const userString = JSON.stringify(user);
      console.log('userString', user)

      Keychain.setGenericPassword('user', userString)
        .then(() => console.log('User saved in Keychain'))
        .catch(err => console.error('Error saving user:', err));
    }
  }, [data]);

  // Refetch user data when component mounts to ensure fresh data
  useEffect(() => {
    refetch();
  }, []);

  return (
    <MenuProvider>
      <Drawer.Navigator
        backBehavior="history"
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#101726',
            width: moderateScale(280),
          },
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: '#888',
          headerShown: false,
        }}
        drawerContent={props => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={DashboardStack} />
        <Drawer.Screen name="Reports" component={ReportsStackNavigator} />

        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen
          name="vehicle_management"
          component={VehicleManagement}
        />
        <Drawer.Screen name="driver_management" component={DriverManagement} />
        <Drawer.Screen name="user_management" component={UserManagementStack} />
        <Drawer.Screen name="system_admin" component={SystemAdmin} />
      </Drawer.Navigator>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    backgroundColor: '#101726',
  },
  text: {
    color: 'white',
    fontSize: 22,
  },
});
