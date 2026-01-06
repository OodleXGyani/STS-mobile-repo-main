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
import { Container, FleetRangeMarker, Title } from './MonthlyReportsStyles';
import { FleetAvgRow } from './MonthlyReportsStyles';
import { Label } from './MonthlyReportsStyles';
import { SubLabel } from './MonthlyReportsStyles';
import { MonthlySummaryItem } from './components/MonthlySummaryItem';

const infoIcon = require('../../../../assets/icons/info_blue.png');

// ========================================
// API DATA
// ========================================

// Real API response data - EXACTLY as provided by user
const realApiResponse = {
  Id: 864542,
  SummaryMonthlyData: [
    {
      Id: 0,
      VehicleName: 'MITSUBISHI_54240',
      SummaryDate: '2025-08-01T00:00:00',
      AverageIdleTime: 0,
      AverageStopTime: 86400,
      AverageOperationTime: 0,
      AverageGeofenceViolation: 0,
      AverageSpeedOver100: 0,
      AverageSpeedOver80: 6,
      AverageNoOfStops: 16,
      AverageNoOfIdlePeriods: 7,
      AverageFuelFill: 0,
      AverageFuelConsume: 0,
      AverageAttachedUnitOptTime: 0,
      AverageDistanceTravelled: 16,
      MaxIdleTime: 0,
      MaxStopTime: 99797,
      MaxOperationTime: 15598,
      MaxDistanceTravelled: 66,
      MaxSpeed: 0,
      MinIdleTime: 11416,
      MinStopTime: 21092,
      MinOperationTime: 1015,
      MinDistanceTravelled: 2,
      MinSpeed: 0,
      TotalSpeedViolation: 207,
      OperatingDays: 30,
      TotalIdleTime: 165444,
      TotalStopTime: 1925470,
      TotalOperationTime: 205533,
      TotalDistanceTravelled: 505,
      PlateNumber: '54240',
      VehicleType: 'Light',
    },
    {
      Id: 0,
      VehicleName: 'MITSUBISHI_16723',
      SummaryDate: '2025-08-01T00:00:00',
      AverageIdleTime: 0,
      AverageStopTime: 0,
      AverageOperationTime: 0,
      AverageGeofenceViolation: 0,
      AverageSpeedOver100: 6,
      AverageSpeedOver80: 257,
      AverageNoOfStops: 9,
      AverageNoOfIdlePeriods: 10,
      AverageFuelFill: 0,
      AverageFuelConsume: 0,
      AverageAttachedUnitOptTime: 0,
      AverageDistanceTravelled: 83,
      MaxIdleTime: 0,
      MaxStopTime: 13880,
      MaxOperationTime: 16504,
      MaxDistanceTravelled: 130,
      MaxSpeed: 45,
      MinIdleTime: 10309,
      MinStopTime: 1905,
      MinOperationTime: 6446,
      MinDistanceTravelled: 50,
      MinSpeed: 101,
      TotalSpeedViolation: 5539,
      OperatingDays: 21,
      TotalIdleTime: 156437,
      TotalStopTime: 156059,
      TotalOperationTime: 210633,
      TotalDistanceTravelled: 1751,
      PlateNumber: '16723',
      VehicleType: 'Light',
    },
    {
      Id: 0,
      VehicleName: 'MITSUBISHI_324578',
      SummaryDate: '2025-08-01T00:00:00',
      AverageIdleTime: 0,
      AverageStopTime: 0,
      AverageOperationTime: 0,
      AverageGeofenceViolation: 0,
      AverageSpeedOver100: 0,
      AverageSpeedOver80: 2,
      AverageNoOfStops: 7,
      AverageNoOfIdlePeriods: 4,
      AverageFuelFill: 0,
      AverageFuelConsume: 0,
      AverageAttachedUnitOptTime: 0,
      AverageDistanceTravelled: 9,
      MaxIdleTime: 0,
      MaxStopTime: 65222,
      MaxOperationTime: 11299,
      MaxDistanceTravelled: 34,
      MaxSpeed: 0,
      MinIdleTime: 12099,
      MinStopTime: 0,
      MinOperationTime: 263,
      MinDistanceTravelled: 0,
      MinSpeed: 0,
      TotalSpeedViolation: 64,
      OperatingDays: 23,
      TotalIdleTime: 95848,
      TotalStopTime: 639417,
      TotalOperationTime: 89475,
      TotalDistanceTravelled: 228,
      PlateNumber: '324578',
      VehicleType: 'Light',
    },
    {
      Id: 0,
      VehicleName: 'MITSUBISHI_324577',
      SummaryDate: '2025-08-01T00:00:00',
      AverageIdleTime: 0,
      AverageStopTime: 86400,
      AverageOperationTime: 0,
      AverageGeofenceViolation: 0,
      AverageSpeedOver100: 0,
      AverageSpeedOver80: 18,
      AverageNoOfStops: 11,
      AverageNoOfIdlePeriods: 2,
      AverageFuelFill: 0,
      AverageFuelConsume: 0,
      AverageAttachedUnitOptTime: 0,
      AverageDistanceTravelled: 71,
      MaxIdleTime: 0,
      MaxStopTime: 68263,
      MaxOperationTime: 22600,
      MaxDistanceTravelled: 85,
      MaxSpeed: 5,
      MinIdleTime: 4573,
      MinStopTime: 56109,
      MinOperationTime: 16067,
      MinDistanceTravelled: 60,
      MinSpeed: 0,
      TotalSpeedViolation: 548,
      OperatingDays: 30,
      TotalIdleTime: 42262,
      TotalStopTime: 1839859,
      TotalOperationTime: 607434,
      TotalDistanceTravelled: 2138,
      PlateNumber: '324577',
      VehicleType: 'Light',
    },
  ],
  MonthlyFleetStatistics: [
    {
      MeanIdleTime: 4634,
      MeanStopTime: 40185,
      MeanOperationTime: 10254,
      MeanDistanceTravelled: 44,
      MeanMaxIdleTime: 9599,
      MeanMaxStopTime: 61790,
      MeanMaxOperationTime: 16500,
      MeanMaxDistanceTravelled: 78,
      MeanMaxSpeed: 12,
      MeanMinIdleTime: 1012,
      MeanMinStopTime: 19776,
      MeanMinOperationTime: 5947,
      MeanMinDistanceTravelled: 28,
      MeanMinSpeed: 25,
      MeanSpeedViolation: 1589,
      MeanOperatingDays: 26,
      DistanceStandardDeviation: 38,
      OperationStandardDeviation: 0.08238425925925925,
      StoppageStandardDeviation: 0.31690972222222225,
      NumberIdleViolations: 0,
      NumberStopViolations: 0,
      NumberOperationViolations: 0,
      NumberDistanceViolations: 0,
      IdleStandardDeviation: 0.029375,
      MeanTotalIdleTime: 114997,
      MeanTotalStopTime: 1140201,
      MeanTotalOperationTime: 278268,
      MeanTotalDistanceTravelled: 1155,
      MinTotalIdleTime: 42262,
      MinTotalStopTime: 156059,
      MinTotalOperationTime: 89475,
      MinTotalDistanceTravelled: 228,
      MaxTotalIdleTime: 165444,
      MaxTotalStopTime: 1925470,
      MaxTotalOperationTime: 607434,
      MaxTotalDistanceTravelled: 2138,
      OffServiceDays: 0,
      WorkingDays: 31,
    },
  ],
};

// ========================================
// DATA TRANSFORMATION
// ========================================

// Extract fleet statistics from real API response - EXACTLY as original code does
const getFleetStats = (data: any) => ({
  // Fleet averages (from MonthlyFleetStatistics[0]) - for header display
  MeanOperationTime: data.MonthlyFleetStatistics[0].MeanOperationTime, // for OT fleet average
  MeanIdleTime: data.MonthlyFleetStatistics[0].MeanIdleTime, // for IT fleet average
  MeanDistanceTravelled: data.MonthlyFleetStatistics[0].MeanDistanceTravelled, // for DT fleet average

  // Fleet maximums for bar scaling (from MonthlyFleetStatistics[0])
  MaxTotalOperationTime: data.MonthlyFleetStatistics[0].MaxTotalOperationTime, // 211824 minutes
  MaxTotalIdleTime: data.MonthlyFleetStatistics[0].MaxTotalIdleTime, // 150013 minutes
  MaxTotalDistanceTravelled:
    data.MonthlyFleetStatistics[0].MaxTotalDistanceTravelled, // 1755 km

  // Fleet averages for ticker positions (from MonthlyFleetStatistics[0])
  MeanTotalOperationTime: data.MonthlyFleetStatistics[0].MeanTotalOperationTime, // 152869 minutes
  MeanTotalIdleTime: data.MonthlyFleetStatistics[0].MeanTotalIdleTime, // 104952 minutes
  MeanTotalDistanceTravelled:
    data.MonthlyFleetStatistics[0].MeanTotalDistanceTravelled, // 818 km

  // Add OT, IT, DT properties for component compatibility
  OT: data.MonthlyFleetStatistics[0].MeanTotalOperationTime, // 152869 minutes
  IT: data.MonthlyFleetStatistics[0].MeanTotalIdleTime, // 104952 minutes
  DT: data.MonthlyFleetStatistics[0].MeanTotalDistanceTravelled, // 818 km
});

// Transform real API data to component format - EXACTLY as original code does
const getVehicles = (data: any) =>
  data.SummaryMonthlyData.map(item => ({
    // Vehicle identification
    vehicleId: item.PlateNumber, // Map PlateNumber to vehicleId for component compatibility
    VehicleType: item.VehicleType,
    PlateNumber: item.PlateNumber,
    VehicleName: item.VehicleName,

    // Main metrics (from SummaryMonthlyData) - EXACTLY as original code uses
    TotalOperationTime: item.TotalOperationTime, // TotalOperationTime in minutes
    TotalIdleTime: item.TotalIdleTime, // TotalIdleTime in minutes
    TotalDistanceTravelled: item.TotalDistanceTravelled, // TotalDistanceTravelled in km
    TotalSpeedViolation: item.TotalSpeedViolation, // TotalSpeedViolation

    // Detailed breakdown data - EXACTLY as original code uses
    MinDistanceTravelled: item.MinDistanceTravelled, // MinDistanceTravelled
    MaxDistanceTravelled: item.MaxDistanceTravelled, // MaxDistanceTravelled
    AverageDistanceTravelled: item.AverageDistanceTravelled, // AverageDistanceTravelled

    // Operation Time details - EXACTLY as original code uses
    MinOperationTime: item.MinOperationTime, // MinOperationTime
    MaxOperationTime: item.MaxOperationTime, // MaxOperationTime
    AverageOperationTime: item.AverageOperationTime, // AverageOperationTime

    // Stop Time details - EXACTLY as original code uses
    MinStopTime: item.MinStopTime, // MinStopTime
    MaxStopTime: item.MaxStopTime, // MaxStopTime
    TotalStopTime: item.TotalStopTime, // TotalStopTime
    AverageStopTime: item.AverageStopTime, // AverageStopTime

    // Additional data - EXACTLY as original code uses
    OperatingDays: item.OperatingDays, // OperatingDays

    // Add details object for component compatibility
    details: {
      min: item.MinDistanceTravelled,
      max: item.MaxDistanceTravelled,
      total: item.TotalDistanceTravelled,
      fat: item.AverageDistanceTravelled,
      minOT: item.MinOperationTime,
      maxOT: item.MaxOperationTime,
      totalOT: item.TotalOperationTime,
      avgOT: item.AverageOperationTime,
      minST: item.MinStopTime,
      maxST: item.MaxStopTime,
      totalST: item.TotalStopTime,
      avgST: item.AverageStopTime,
      operatingDays: item.OperatingDays,
      totalSpeedViolation: item.TotalSpeedViolation, // Fixed property name
    },
  }));

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Import time formatting utility
import { toHHMM, getMonthName } from '../../../../utils';
import InfoModal from '../InfoModal';

// ========================================
// MAIN COMPONENT
// ========================================

export default function MonthlySummaryReport({
  route,
  navigation,
}: {
  route?: any;
  navigation?: any;
}) {
  const nav = useNavigation();
  const { report } = route.params as { report: any };
  const { selectedMonth, selectedYear } = route.params as { selectedMonth: string; selectedYear: string };
  console.log('Report: Monthly Summary Report', report);

  // Use the report data passed from navigation, fallback to hardcoded data if not available
  const reportData = report || realApiResponse;

  // Transform the data using the dynamic report data
  const fleetStats = getFleetStats(reportData);
  const vehicles = getVehicles(reportData);

    const [showInfoModal, setShowInfoModal] = useState(false);
  
  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleBackPress = () => {
    nav.navigate('ReportsList' as never);
  };

  // ========================================
  // RENDER METHODS
  // ========================================

  const renderHeader = () => (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.primary_blue_color,
        justifyContent: 'space-between',
      }}
    >
      <TouchableOpacity
        onPress={handleBackPress}
        style={{ padding: moderateScale(8) }}
      >
        <SmallIcon
          source={BackArrow}
          style={{ width: moderateScale(25), height: moderateScale(25) }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: moderateScale(16),
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}
        >
          Monthly Summary Report
        </Text>
        <Text
          style={{
            fontSize: moderateScale(14),
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginTop: moderateScale(4),
          }}
        >
          {getMonthName(parseInt(selectedMonth))} {selectedYear}
        </Text>
      </View>

      <View style={{ width: moderateScale(41) }} />
    </View>
  );

  const renderFleetAverageHeader = () => (
    <FleetAvgRow>
      <Label style={{ fontWeight: 'bold' }}>Fleet Avg</Label>
      <FleetRangeMarker>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          OT {toHHMM(fleetStats.MeanOperationTime)} (hh:mm)
        </SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          IT {toHHMM(fleetStats.MeanIdleTime)} (hh:mm)
        </SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          DT {fleetStats.MeanDistanceTravelled} km
        </SubLabel>
      </FleetRangeMarker>
    </FleetAvgRow>
  );
  
  const renderVehicleCards = () =>
    vehicles.map(vehicle => (
      <MonthlySummaryItem
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

        {/* Vehicle Cards using MonthlySummaryItem component */}
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
