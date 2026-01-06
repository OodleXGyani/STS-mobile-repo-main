import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../../constants/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import BackArrow from '../../../../assets/icons/backArrow.png';
import styled from 'styled-components/native';
import { SmallIcon } from '../../../Dashboard/components/AccordianList/accordian-styles';
import Icons from '../../../../common/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import original styled components
import { Container, FleetRangeMarker, Title, FleetAvgRow, Label, SubLabel } from './WeeklyReportsStyles';
import { WeeklySummaryItem } from './components/WeeklySummaryItem';

const infoIcon = require('../../../../assets/icons/info_blue.png');

// ========================================
// DUMMY DATA FOR TESTING
// ========================================

// Dummy API response structure for weekly summary
const realApiResponse = {
  "WeeklySummaryModelList": [
    {
      "AverageRowId": 1,
      "VehicleName": "Vehicle-001",
      "SummaryDate": "2024-01-01",
      "AverageProcessDate": "2024-01-01",
      "AverageIdleTime": 18000, // 5 hours in seconds
      "AverageStopTime": 3600, // 1 hour in seconds
      "AverageOperationTime": 144000, // 40 hours in seconds
      "AverageGeofenceViolation": 2,
      "AverageSpeedOver100": 1,
      "AverageSpeedOver80": 3,
      "AverageNoOfStops": 15,
      "AverageNoOfIdlePeriods": 8,
      "AverageFuelFill": 50,
      "AverageFuelConsume": 45,
      "AverageAttachedUnitOptTime": 0,
      "AverageTotalDistance": 600, // 600 km
      "SummaryRowId": 1,
      "SummaryProcessDate": "2024-01-01",
      "SummaryIdleTime": 18000,
      "SummaryStopTime": 3600,
      "SummaryOperationTime": 144000,
      "SummaryGeofenceViolation": 2,
      "SummarySpeedOver100": 1,
      "SummarySpeedOver80": 3,
      "SummaryNoOfStops": 15,
      "SummaryNoOfIdlePeriods": 8,
      "SummaryFuelFill": 50,
      "SummaryFuelConsume": 45,
      "SummaryAttachedUnitOptTime": 0,
      "SummaryTotalDistance": 600,
      "FormatedDate": "01 Jan 2024",
      "details": {
        "min": 50,
        "max": 800,
        "total": 600,
        "fat": 200,
        "minOT": 20,
        "maxOT": 60,
        "totalOT": 40,
        "avgOT": 40,
        "minST": 0.5,
        "maxST": 3,
        "totalST": 1,
        "avgST": 1,
        "operatingDays": 5,
        "totalSpeedViolation": 4
      }
    },
    {
      "AverageRowId": 2,
      "VehicleName": "Vehicle-002",
      "SummaryDate": "2024-01-01",
      "AverageProcessDate": "2024-01-01",
      "AverageIdleTime": 21600, // 6 hours in seconds
      "AverageStopTime": 7200, // 2 hours in seconds
      "AverageOperationTime": 162000, // 45 hours in seconds
      "AverageGeofenceViolation": 1,
      "AverageSpeedOver100": 0,
      "AverageSpeedOver80": 2,
      "AverageNoOfStops": 20,
      "AverageNoOfIdlePeriods": 10,
      "AverageFuelFill": 60,
      "AverageFuelConsume": 55,
      "AverageAttachedUnitOptTime": 0,
      "AverageTotalDistance": 750,
      "SummaryRowId": 2,
      "SummaryProcessDate": "2024-01-01",
      "SummaryIdleTime": 21600,
      "SummaryStopTime": 7200,
      "SummaryOperationTime": 162000,
      "SummaryGeofenceViolation": 1,
      "SummarySpeedOver100": 0,
      "SummarySpeedOver80": 2,
      "SummaryNoOfStops": 20,
      "SummaryNoOfIdlePeriods": 10,
      "SummaryFuelFill": 60,
      "SummaryFuelConsume": 55,
      "SummaryAttachedUnitOptTime": 0,
      "SummaryTotalDistance": 750,
      "FormatedDate": "01 Jan 2024",
      "details": {
        "min": 100,
        "max": 1000,
        "total": 750,
        "fat": 250,
        "minOT": 30,
        "maxOT": 70,
        "totalOT": 45,
        "avgOT": 45,
        "minST": 1,
        "maxST": 4,
        "totalST": 2,
        "avgST": 2,
        "operatingDays": 5,
        "totalSpeedViolation": 2
      }
    }
  ]
};

// ========================================
// DATA TRANSFORMATION FUNCTIONS
// ========================================

const getFleetStats = (data: any) => {
  if (!data?.WeeklySummaryModelList || data.WeeklySummaryModelList.length === 0) {
    return {
      MeanTotalOperationTime: 0,
      MeanTotalIdleTime: 0,
      MeanTotalDistanceTravelled: 0,
      MaxTotalOperationTime: 0,
      MaxTotalIdleTime: 0,
      MaxTotalDistanceTravelled: 0,
    };
  }

  const vehicles = data.WeeklySummaryModelList;
  const totalOT = vehicles.reduce((sum: number, v: any) => sum + v.SummaryOperationTime, 0);
  const totalIT = vehicles.reduce((sum: number, v: any) => sum + v.SummaryIdleTime, 0);
  const totalDT = vehicles.reduce((sum: number, v: any) => sum + v.SummaryTotalDistance, 0);

  return {
    MeanTotalOperationTime: totalOT / vehicles.length,
    MeanTotalIdleTime: totalIT / vehicles.length,
    MeanTotalDistanceTravelled: totalDT / vehicles.length,
    MaxTotalOperationTime: Math.max(...vehicles.map((v: any) => v.SummaryOperationTime)),
    MaxTotalIdleTime: Math.max(...vehicles.map((v: any) => v.SummaryIdleTime)),
    MaxTotalDistanceTravelled: Math.max(...vehicles.map((v: any) => v.SummaryTotalDistance)),
  };
};

const getVehicles = (data: any) => {
  if (!data?.WeeklySummaryModelList || data.WeeklySummaryModelList.length === 0) {
    return [];
  }

  return data.WeeklySummaryModelList.map((vehicle: any) => ({
    vehicleId: vehicle.VehicleName,
    TotalOperationTime: vehicle.SummaryOperationTime / 3600, // Convert to hours
    TotalIdleTime: vehicle.SummaryIdleTime / 3600, // Convert to hours
    TotalDistanceTravelled: vehicle.SummaryTotalDistance,
    details: vehicle.details || {
      min: 0,
      max: 0,
      total: 0,
      fat: 0,
      minOT: 0,
      maxOT: 0,
      totalOT: 0,
      avgOT: 0,
      minST: 0,
      maxST: 0,
      totalST: 0,
      avgST: 0,
      operatingDays: 0,
      totalSpeedViolation: 0
    }
  }));
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Import time formatting utility
import { toHHMM, getMonthName } from '../../../../utils';
import InfoModal from '../InfoModal';

// ========================================
// MAIN COMPONENT
// ========================================

export default function WeeklySummaryReport({
  route,
  navigation,
}: {
  route?: any;
  navigation?: any;
}) {
  
  const { report } = route.params as { report: any };
  const { startDate, endDate } = route.params as { startDate: string; endDate: string };
  console.log('Report: Weekly Summary Report', report);
  console.log('Report: Weekly Summary Report start date ', startDate , "end date " , endDate );


  // Use the report data passed from navigation, fallback to hardcoded data if not available
  const reportData = report || realApiResponse;
  console.log('Report: Weekly Summary Report Data', reportData);

  // Transform the data using the dynamic report data
  const fleetStats = getFleetStats(reportData);
  const vehicles = getVehicles(reportData);

    const [showInfoModal, setShowInfoModal] = useState(false);
  
  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleBackPress = () => {
    navigation.navigate('ReportsList' as never);
  };

  // ========================================
  // RENDER METHODS
  // ========================================

  const renderHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(12),
        backgroundColor: Colors.primary_blue_color,
      }}
    >
      <TouchableOpacity
        onPress={handleBackPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: verticalScale(8),
        }}
      >
        <Image
          source={BackArrow}
          style={{
            width: moderateScale(20),
            height: moderateScale(20),
            tintColor: Colors.white,
          }}
        />
      </TouchableOpacity>
      
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text
          style={{
            fontSize: moderateScale(18),
            fontWeight: 'bold',
            color: Colors.white,
            textAlign: 'center',
          }}
        >
          Weekly Summary Report
        </Text>
        <Text
          style={{
            fontSize: moderateScale(12),
            color: Colors.white,
            textAlign: 'center',
            marginTop: verticalScale(2),
          }}
        >
          {startDate && endDate ? `${startDate.split(" ")[0].replace("#","")} - ${endDate.split(" ")[0].replace("#","")}` : 'Week Summary'}
        </Text>
      </View>
      
      <View style={{ width: moderateScale(40) }} />
    </View>
  );

  const renderFleetAverageHeader = () => (
    <FleetAvgRow>
      <Label style={{ fontWeight: 'bold' }}>Fleet Avg</Label>
      <FleetRangeMarker>
        <SubLabel style={{ color: Colors.primary_blue_color }}>OT {toHHMM(fleetStats.MeanTotalOperationTime / 3600)} (hh:mm)</SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>IT {toHHMM(fleetStats.MeanTotalIdleTime / 3600)} (hh:mm)</SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>DT {Math.round(fleetStats.MeanTotalDistanceTravelled)} km</SubLabel>
      </FleetRangeMarker>
    </FleetAvgRow>
  );
  
console.log(vehicles, "Vechiles")


  const renderVehicleCards = () =>
    vehicles.map((vehicle: any) => (
      <WeeklySummaryItem
        key={vehicle.vehicleId}
        vehicleId={vehicle.vehicleId}
        OT={vehicle.TotalOperationTime}
        IT={vehicle.TotalIdleTime}
        DT={vehicle.TotalDistanceTravelled}
        avg={fleetStats}
        details={vehicle.details}
        fleetStats={fleetStats}
      />
    ));

  // ========================================
  // MAIN RENDER
  // ========================================

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primary_background_color }}
    >
      {/* Header with back button and title */}
      <View style={{ height: verticalScale(60) }}>{renderHeader()}</View>

      {/* Main scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: verticalScale(20),
          backgroundColor: Colors.white,
        }}
      >
        {/* Fleet Average Header */}
        {renderFleetAverageHeader()}

        {/* Vehicle Cards using WeeklySummaryItem component */}
        {renderVehicleCards()}
      </ScrollView>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 45,
          left: 10,
          backgroundColor: '#fff',
          borderRadius: 25,
          zIndex: 1000,
        }}
        onPress={() => setShowInfoModal(true)}
      >
        <Image source={infoIcon} style={{ width: 40, height: 40, zIndex: 1000 }} />
      </TouchableOpacity>


        <InfoModal
          visible={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
    </SafeAreaView>
  );
}
