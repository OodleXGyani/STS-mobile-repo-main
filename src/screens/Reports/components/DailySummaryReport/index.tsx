import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../../../constants/colors';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import BackArrow from '../../../../assets/icons/backArrow.png';
import styled from 'styled-components/native';
import { SmallIcon } from '../../../Dashboard/components/AccordianList/accordian-styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FleetAvgRow,
  FleetRangeMarker,
  Label,
  SubLabel,
} from '../MonthlySummaryReport/MonthlyReportsStyles';
import { toHHMM } from '../../../../utils';
import {
  DailySummaryCards,
  VehiclePlateContainer,
  VehiclePlateText,
  DateContainer,
  DateText,
  SummaryStatsContainer,
  StatItem,
  StatLabel,
  StatValue,
  ActionButton,
  ActionButtonText,
  DailyHeaderContainer,
  DailyHeaderTitle,
  DailyHeaderSubtitle,
} from './styles';
import Icons from '../../../../common/icons';
import TimelineList from '../TripReport/components/LocationMarker';
import { DailySummaryCard, DailyFleetStats } from './types';

// Dummy fleet stats for daily summary
const dailyFleetStats: DailyFleetStats = {
  MeanOperationTime: 28800, // 8 hours in seconds
  MeanIdleTime: 7200, // 2 hours in seconds
  MeanDistanceTravelled: 120, // 120 km
  MeanFuelConsumption: 15, // 15 liters
  MeanEngineHours: 8, // 8 hours
  TotalVehicles: 25,
  ActiveVehicles: 20,
};

// Dummy daily summary data for multiple cards
const dummyDailySummaryCards: DailySummaryCard[] = [
  {
    id: 1,
    date: "2024-01-15",
    vehiclePlate: "MH 12 AB 1234",
    vehicleType: "MITSUBISHI_324578",
    driverName: "Ameer- Admin Driver",
    totalDistance: 85.5,
    totalTime: 28800, // 8 hours
    idleTime: 3600, // 1 hour
    maxSpeed: 95,
    totalTrips: 8,
    workingHours: 8,
    breakTime: 1800, // 30 minutes
    fuelConsumption: 12.5,
    engineHours: 8.5,
    dailyData: [
      { 
        startTime: "08:00 AM", 
        endTime: "05:00 PM", 
        startLocation: "Hidd Town 115 / 1505 Rd", 
        endLocation: "Hidd Town 115 / 1505 Rd",
        totalStops: 12,
        averageSpeed: 45
      }
    ]
  },
  {
    id: 2,
    date: "2024-01-15",
    vehiclePlate: "MH 12 CD 5678",
    vehicleType: "MITSUBISHI_324578",
    driverName: "Nazar Alawi Al Sharkhat",
    totalDistance: 65.2,
    totalTime: 25200, // 7 hours
    idleTime: 1800, // 30 minutes
    maxSpeed: 87,
    totalTrips: 6,
    workingHours: 7,
    breakTime: 1200, // 20 minutes
    fuelConsumption: 9.8,
    engineHours: 7.2,
    dailyData: [
      { 
        startTime: "09:00 AM", 
        endTime: "04:00 PM", 
        startLocation: "Hidd Town 115 / 1505 Rd", 
        endLocation: "Hidd Town 115 / 1505 Rd",
        totalStops: 8,
        averageSpeed: 42
      }
    ]
  },
  {
    id: 3,
    date: "2024-01-15",
    vehiclePlate: "MH 12 EF 9012",
    vehicleType: "MITSUBISHI_324578",
    driverName: "Gufran Sdiddique",
    totalDistance: 95.8,
    totalTime: 30600, // 8.5 hours
    idleTime: 2700, // 45 minutes
    maxSpeed: 92,
    totalTrips: 10,
    workingHours: 8.5,
    breakTime: 2100, // 35 minutes
    fuelConsumption: 14.2,
    engineHours: 9.0,
    dailyData: [
      { 
        startTime: "07:30 AM", 
        endTime: "05:00 PM", 
        startLocation: "Hidd Town 115 / 1505 Rd", 
        endLocation: "Hidd Town 115 / 1505 Rd",
        totalStops: 15,
        averageSpeed: 48
      }
    ]
  },
  {
    id: 4,
    date: "2024-01-15",
    vehiclePlate: "MH 12 GH 3456",
    vehicleType: "MITSUBISHI_324578",
    driverName: "Ahmed Naji",
    totalDistance: 72.3,
    totalTime: 27000, // 7.5 hours
    idleTime: 2400, // 40 minutes
    maxSpeed: 78,
    totalTrips: 7,
    workingHours: 7.5,
    breakTime: 1800, // 30 minutes
    fuelConsumption: 11.1,
    engineHours: 8.0,
    dailyData: [
      { 
        startTime: "08:30 AM", 
        endTime: "04:00 PM", 
        startLocation: "Hidd Town 115 / 1505 Rd", 
        endLocation: "Hidd Town 115 / 1505 Rd",
        totalStops: 10,
        averageSpeed: 40
      }
    ]
  }
];

export default function DailySummaryReport() {
  const nav = useNavigation();

  const handleBackPress = () => {
    nav.goBack();
  };

  const handleMapPress = (dailyCard: any) => {
    console.log('🗺️ Map button pressed for daily summary:', dailyCard.id);
    // TODO: Navigate to daily summary map page
    // Similar to trip report map navigation
  };

  const handleDetailsPress = (dailyCard: any) => {
    console.log('📊 Details button pressed for daily summary:', dailyCard.id);
    // TODO: Navigate to daily summary details page
  };

  const renderDailySummaryCard = (dailyData: DailySummaryCard) => (
    <DailySummaryCards key={dailyData.id} style={{ marginBottom: moderateScale(10) }}>
      {/* Header with vehicle info and date */}
      <View style={{ justifyContent:'space-between',flexDirection:'row', alignItems:'center',padding:moderateScale(5) }}>
        <View style={{flexDirection:'row',alignItems:'center',gap:moderateScale(5)}}>
          <SmallIcon
            source={Icons.driver_grey}
            style={{ width: moderateScale(40), height: moderateScale(20) }}
            resizeMode="contain"
          />
          <Text style={{fontSize:moderateScale(16),fontWeight:'bold',color:Colors.primary_blue_color}}>
            {dailyData.vehiclePlate}
          </Text>
        </View>
        <View>
          <Text style={{fontSize:moderateScale(16),fontWeight:'bold',color:Colors.primary_blue_color}}>
            {dailyData.date}
          </Text>
        </View>
      </View>

      {/* Date and driver info */}
      <DateContainer>
        <SmallIcon
          source={Icons.calendar_blue}
          style={{ width: moderateScale(16), height: moderateScale(16) }}
          resizeMode="contain"
        />
        <DateText>{dailyData.driverName}</DateText>
        <DateText>•</DateText>
        <DateText>{dailyData.dailyData[0]?.startTime} - {dailyData.dailyData[0]?.endTime}</DateText>
      </DateContainer>
    
      <TimelineList/>
      
      {/* Daily summary stats */}
      <FleetAvgRow style={{backgroundColor:'white'}}>
        <FleetRangeMarker>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TDT {toHHMM(dailyData.totalTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TTT {toHHMM(dailyData.idleTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: 'red' }}>
            <SmallIcon
              source={Icons.speed_blue}
              style={{
                width: moderateScale(15),
                height: moderateScale(12),
                marginRight: moderateScale(10),
              }}
            />
            {dailyData.maxSpeed} km/h
          </SubLabel>
        </FleetRangeMarker>
        
        <FleetRangeMarker style={{alignItems:'center'}}>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            WH {toHHMM(dailyData.workingHours * 3600)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            BT {toHHMM(dailyData.breakTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            DT {dailyData.totalDistance} km
          </SubLabel>
        </FleetRangeMarker>
        
        <FleetRangeMarker style={{alignItems:'flex-end'}}>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TR {dailyData.totalTrips}
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            FC {dailyData.fuelConsumption}L
          </SubLabel>
          <View style={{flexDirection:'row', gap: moderateScale(5)}}>
            <TouchableOpacity 
              style={{
                flexDirection:'row',
                backgroundColor: Colors.primary_blue_80_color,
                padding: moderateScale(5),
                alignItems:'center',
                gap: moderateScale(5),
                alignSelf: 'flex-start',
                borderRadius:moderateScale(5),
              }}
              onPress={() => handleMapPress(dailyData)}
            >
              <SmallIcon
                source={Icons.map_white}
                style={{
                  width: moderateScale(15),
                  height: moderateScale(12),
                }}
              />
              <SubLabel style={{ color: Colors.white }}>Map</SubLabel>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{
                flexDirection:'row',
                backgroundColor: Colors.primary_blue_color,
                padding: moderateScale(5),
                alignItems:'center',
                gap: moderateScale(5),
                alignSelf: 'flex-start',
                borderRadius:moderateScale(5),
              }}
              onPress={() => handleDetailsPress(dailyData)}
            >
              <SmallIcon
                source={Icons.details_white}
                style={{
                  width: moderateScale(15),
                  height: moderateScale(12),
                }}
              />
              <SubLabel style={{ color: Colors.white }}>Details</SubLabel>
            </TouchableOpacity>
          </View>
        </FleetRangeMarker>
      </FleetAvgRow>
    </DailySummaryCards>
  );

  const renderHeader = () => (
    <DailyHeaderContainer
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
        <DailyHeaderTitle>
          Daily Summary Report
        </DailyHeaderTitle>
        <DailyHeaderSubtitle>
          January 15, 2024
        </DailyHeaderSubtitle>
      </View>

      <View style={{ width: moderateScale(41) }} />
    </DailyHeaderContainer>
  );

  const renderFleetAverageHeader = () => (
    <FleetAvgRow>
      <VehiclePlateContainer>
        <SmallIcon
          source={Icons.car_blue}
          style={{ width: moderateScale(40), height: moderateScale(20) }}
          resizeMode="contain"
        />
        <VehiclePlateText>Fleet Average</VehiclePlateText>
      </VehiclePlateContainer>

      <FleetRangeMarker>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          TDT {toHHMM(dailyFleetStats.MeanOperationTime)} (hh:mm)
        </SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          TTT {toHHMM(dailyFleetStats.MeanIdleTime)} (hh:mm)
        </SubLabel>
        <SubLabel style={{ color: 'red' }}>
          <SmallIcon
            source={Icons.speed_blue}
            style={{
              width: moderateScale(15),
              height: moderateScale(12),
              marginRight: moderateScale(10),
            }}
          />
          {dailyFleetStats.MeanDistanceTravelled} km/h
        </SubLabel>
      </FleetRangeMarker>
      
      <FleetRangeMarker>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          WH {toHHMM(dailyFleetStats.MeanOperationTime)} (hh:mm)
        </SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          FC {dailyFleetStats.MeanFuelConsumption}L
        </SubLabel>
        <SubLabel style={{ color: Colors.primary_blue_color }}>
          EH {dailyFleetStats.MeanEngineHours}h
        </SubLabel>
      </FleetRangeMarker>
    </FleetAvgRow>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primary_background_color }}
    >
      <View style={{ height: verticalScale(60) }}>{renderHeader()}</View>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingBottom: verticalScale(20),
          backgroundColor: Colors.white,
        }}
        style={{ flex: 1 }}
      >
        {renderFleetAverageHeader()}
        
        {/* Render all daily summary cards */}
        {dummyDailySummaryCards.map((dailyData) => renderDailySummaryCard(dailyData))}
      </ScrollView>
    </SafeAreaView>
  );
}
