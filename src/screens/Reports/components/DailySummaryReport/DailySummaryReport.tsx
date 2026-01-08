import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { formatDateForDisplay, toHHMM } from '../../../../utils';
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
  FirstColumn,
  TSVContainer,
} from './styles';
import Icons from '../../../../common/icons';
import TimelineList from '../TripReport/components/LocationMarker';
import { DailySummaryCard, DailyFleetStats } from './types';
import InfoModal from '../InfoModal';

const infoIcon = require('../../../../assets/icons/info_blue.png');

export default function DailySummaryReport() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const nav = useNavigation();
  const { report } = useRoute().params as { report: any };
  const { startDate, endDate } = useRoute().params as {
    startDate: string;
    endDate: string;
  };
  console.log('report daily summary report', report);

  // Use real report data, fallback to dummy data if not available
  const dailySummaryData = report?.DailySummaryModelList || [];

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
    <DailySummaryCards
      key={dailyData.id}
      style={{ marginBottom: moderateScale(10) }}
    >
      {/* Header with vehicle info and date */}
      <FirstColumn>
        <SmallIcon
          source={Icons.car_blue}
          style={{
            width: moderateScale(42),
            height: moderateScale(18),

            alignSelf: 'center',
          }}
          resizeMode="contain"
        />

        <Label style={{ marginTop: moderateScale(0) }}>
          {dailyData.vehiclePlate}
        </Label>
      </FirstColumn>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          padding: moderateScale(5),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: moderateScale(5),
          }}
        >
          <SmallIcon
            source={Icons.driver_grey}
            style={{ width: moderateScale(40), height: moderateScale(20) }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: moderateScale(16),
              fontWeight: 'bold',
              color: Colors.primary_blue_color,
            }}
          >
            {dailyData.driverName}
          </Text>
        </View>
      </View>

      <TimelineList data={dailyData.dailyData[0]} />

      {/* Daily summary stats */}
      <FleetAvgRow style={{ backgroundColor: 'white' }}>
        <FleetRangeMarker>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TDT {dailyData.totalDistance} km
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TTT {toHHMM(dailyData.operationTime)} (hh:mm)
          </SubLabel>
        </FleetRangeMarker>

        <FleetRangeMarker style={{ alignItems: 'center' }}>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TIT {toHHMM(dailyData.idleTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TST {toHHMM(dailyData.stopTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TSV {dailyData.totalSpeedViolation}
          </SubLabel>
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
        <DailyHeaderTitle>Daily Summary Report</DailyHeaderTitle>
        <DailyHeaderSubtitle>
          {formatDateForDisplay(startDate)}
        </DailyHeaderSubtitle>
      </View>

      <View style={{ width: moderateScale(41) }} />
    </DailyHeaderContainer>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primary_background_color }}
    >
      <View style={{ flex: 1 }}>
        <View style={{ height: verticalScale(60) }}>{renderHeader()}</View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingBottom: verticalScale(20),
            backgroundColor: Colors.white,
          }}
          style={{ flex: 1, backgroundColor: Colors.white }}
        >
          {/* Render all daily summary cards */}
          {dailySummaryData.map((dailyData: any, index: number) =>
            renderDailySummaryCard({
              id: dailyData.Id || index + 1,
              date: formatDateForDisplay(dailyData.SummaryDate) || 'N/A',
              vehiclePlate: dailyData.VehicleName || 'N/A',
              vehicleType: dailyData.VehicleName || 'N/A',
              driverName: dailyData.DriverName || 'N/A',
              totalDistance: dailyData.TotalDistance || 0,
              totalTime: dailyData.OperationTime || 0,
              idleTime: dailyData.IdleTime || 0,
              maxSpeed: dailyData.SpeedOver80 || 0,
              operationTime: dailyData.OperationTime || 0,
              stopTime: dailyData.StopTime || 0,

              totalTrips: dailyData.NoOfStops || 0,
              workingHours: dailyData.FormattedOpTime || 'N/A',
              breakTime: dailyData.StopTime || 0,
              fuelConsumption: 0, // Not available in API
              engineHours: 0, // Not available in API
              totalSpeedViolation: dailyData.TotalSpeedViolations || 'N/A',
              dailyData: [
                {
                  StartTime: dailyData.StartTime || 'N/A',
                  EndTime: dailyData.EndTime || 'N/A',
                  StartLocation: dailyData.StartLocation || 'N/A',
                  EndLocation: dailyData.EndLocation || 'N/A',
                  totalStops: dailyData.NoOfStops || 0,
                  averageSpeed: 0, // Calculate if needed
                },
              ],
            }),
          )}
        </ScrollView>
      </View>
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
