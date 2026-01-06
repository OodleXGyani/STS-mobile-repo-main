import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRef, useEffect } from 'react';
import { showSafeAlert } from '../../../../utils/AlertUtils';
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
import {
  toHHMM,
  round_to,
  formatDateForAPI,
  formatDateForDisplay,
} from '../../../../utils';
import { useGetVehiclePathReportMutation } from '../../../../services/reports';
import {
  TripReportCards,
  VehiclePlateContainer,
  VehiclePlateText,
} from './styles';
import Icons from '../../../../common/icons';
import TimelineList from './components/LocationMarker';
import {
  TripMapData,
  TripReportCard,
  TripMarker,
  TripPath,
  TripLocation,
} from './types';
import { TripCoordinates } from './data';
import InfoModal from '../InfoModal';

const infoIcon = require('../../../../assets/icons/info_blue.png');

// Trip report data processing function
const processTripReport = (data: any) => {
  console.log('data', data);
  const ilen = data.TripData?.length || 0;
  if (ilen) {
    let groups: any = {};

    // Group trips by PlateNumber (Vehicle)
    for (var i = 0; i < ilen; i++) {
      if (!groups[data.TripData[i].PlateNumber]) {
        groups[data.TripData[i].PlateNumber] = {
          DistanceTravelled: 0,
          TotalTime: 0,
          IdleTime: 0,
          MaxSpeed: 0,
          StopTime: 0,
          Vehicle: data.TripData[i].Vehicle,
          Type: data.TripData[i].Type,
          PlateNumber: data.TripData[i].PlateNumber,
          Trips: [], // Array to store individual trips
        };
      }

      // Add individual trip to the group
      groups[data.TripData[i].PlateNumber].Trips.push({
        Tripid: data.TripData[i].Tripid,
        DriverName: data.TripData[i].DriverName,
        StartTime: data.TripData[i].StartTime,
        StartLocation: data.TripData[i].StartLocation,
        EndTime: data.TripData[i].EndTime,
        EndLocation: data.TripData[i].EndLocation,
        DistanceTravelled: data.TripData[i].DistanceTravelled,
        IdleTime: data.TripData[i].IdleTime,
        MaxSpeed: data.TripData[i].MaxSpeed,
        StopTime: data.TripData[i].StopTime,
        TotalTime: data.TripData[i].TotalTime,
        Vehicle: data.TripData[i].Vehicle,
      });

      // Aggregate metrics for the vehicle
      groups[data.TripData[i].PlateNumber].DistanceTravelled += parseFloat(
        data.TripData[i].DistanceTravelled,
      );
      groups[data.TripData[i].PlateNumber].TotalTime += parseInt(
        data.TripData[i].TotalTime,
      );
      groups[data.TripData[i].PlateNumber].IdleTime += parseInt(
        data.TripData[i].IdleTime,
      );
      groups[data.TripData[i].PlateNumber].StopTime += parseInt(
        data.TripData[i].StopTime,
      );

      // Keep track of maximum speed
      if (
        parseInt(data.TripData[i].MaxSpeed) >
        groups[data.TripData[i].PlateNumber].MaxSpeed
      ) {
        groups[data.TripData[i].PlateNumber].MaxSpeed = parseInt(
          data.TripData[i].MaxSpeed,
        );
      }
    }

    return {
      id: data.Id,
      TripData: Object.values(groups), // Convert object to array
    };
  } else {
    return {
      id: null,
      TripData: [],
    };
  }
};

export default function TripReport({ route }: { route: any }) {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const nav = useNavigation();
  const { report, startDate, endDate } = route.params as {
    report: any;
    startDate?: string;
    endDate?: string;
  };
  const [
    getVehiclePathReport,
    { data: vehiclePathReport, isLoading: isVehiclePathReportLoading },
  ] = useGetVehiclePathReportMutation();

  // State to track loading for individual trip map buttons
  const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Process the real trip report data
  const processedTripData = report
    ? processTripReport(report)
    : { id: null, TripData: [] };
  const tripCards = processedTripData.TripData;

  const handleBackPress = () => {
    nav.goBack();
  };
  console.log('vehiclePathReport', vehiclePathReport);

  console.log('tripCards', tripCards);

  const handleMapPress = async (tripCard: any) => {
    console.log('🗺️ Map button pressed for trip:', tripCard);
    console.log('🗺️ TripCard properties:', {
      Vehicle: tripCard.Vehicle,
      StartTime: formatDateForAPI(new Date(tripCard.StartTime), true),
      EndTime: formatDateForAPI(new Date(tripCard.EndTime), false),
      PlateNumber: tripCard.PlateNumber,
    });

    // Set loading state for this specific trip
    setLoadingTripId(tripCard.Tripid);

    try {
      console.log('🗺️ About to call API...');
      const response = await getVehiclePathReport({
        Vehicle: tripCard.Vehicle,
        StartDate: formatDateForAPI(new Date(tripCard.StartTime), true),
        EndDate: formatDateForAPI(new Date(tripCard.EndTime), false),
      });
      console.log('🗺️ API Response:', response);
      if (response.data) {
        (nav as any).navigate('TripMapPage', {
          tripData: response.data,
          title: `Trip Map - ${tripCard.Vehicle}`,
        });
      } else if (response.error) {
        showSafeAlert(mountedRef, 'Error', 'An UnKnown Error Occured !');
      }
    } catch (error) {
      console.error('🗺️ API error:', error);
    } finally {
      // Clear loading state
      setLoadingTripId(null);
    }
  };

  const renderVehicleCard = (tripData: any) => (
    <View
      key={tripData.PlateNumber}
      style={{ marginBottom: moderateScale(15) }}
    >
      {/* Vehicle Header using Fleet Average Header styling */}
      <FleetAvgRow>
        <VehiclePlateContainer>
          <SmallIcon
            source={Icons.car_blue}
            style={{ width: moderateScale(40), height: moderateScale(20) }}
            resizeMode="contain"
          />
          <VehiclePlateText>{tripData.PlateNumber}</VehiclePlateText>
        </VehiclePlateContainer>

        <FleetRangeMarker>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TDT {round_to(tripData.DistanceTravelled || 0, 3)} km
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TTT {toHHMM(tripData.TotalTime)} (hh:mm)
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
            {tripData.MaxSpeed} km/h
          </SubLabel>
        </FleetRangeMarker>

        <FleetRangeMarker>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TIT {toHHMM(tripData.IdleTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TST {toHHMM(tripData.StopTime)} (hh:mm)
          </SubLabel>
          <SubLabel style={{ color: Colors.primary_blue_color }}>
            TTR {tripData.Trips?.length || 0}
          </SubLabel>
        </FleetRangeMarker>
      </FleetAvgRow>

      {/* Individual Trips using TripReportCards */}
      {tripData.Trips && tripData.Trips.length > 0 && (
        <View style={{ marginTop: moderateScale(5) }}>
          {tripData.Trips.map(
            (trip: any, index: number) => (
              console.log('trip', trip),
              (
                <TripReportCards
                  key={trip.Tripid || index}
                  style={{
                    marginBottom: moderateScale(5),
                    marginLeft: moderateScale(10),
                  }}
                >
                  {/* Trip Header */}
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
                        style={{
                          width: moderateScale(40),
                          height: moderateScale(20),
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontSize: moderateScale(16),
                          fontWeight: 'bold',
                          color: Colors.primary_blue_color,
                        }}
                      >
                        {trip.DriverName}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: moderateScale(16),
                          fontWeight: 'bold',
                          color: Colors.primary_blue_color,
                        }}
                      >
                        Trip ID: {trip.Tripid}
                      </Text>
                    </View>
                  </View>

                  {/* Keep original TimelineList for trips */}
                  <TimelineList data={trip} />

                  {/* Trip Stats - using original FleetAvgRow styling */}
                  <FleetAvgRow style={{ backgroundColor: 'white' }}>
                    <FleetRangeMarker>
                      <SubLabel style={{ color: Colors.primary_blue_color }}>
                        DT {round_to(trip.DistanceTravelled || 0, 3)} km
                      </SubLabel>
                      <SubLabel style={{ color: Colors.primary_blue_color }}>
                        TT {toHHMM(trip.TotalTime)} (hh:mm)
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
                        {trip.MaxSpeed} km/h
                      </SubLabel>
                    </FleetRangeMarker>
                    <FleetRangeMarker style={{ alignItems: 'center' }}>
                      <SubLabel style={{ color: Colors.primary_blue_color }}>
                        IT {toHHMM(trip.IdleTime)} (hh:mm)
                      </SubLabel>
                      <SubLabel style={{ color: Colors.primary_blue_color }}>
                        ST {toHHMM(trip.StopTime)} (hh:mm)
                      </SubLabel>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          backgroundColor: Colors.primary_blue_80_color,
                          padding: moderateScale(5),
                          alignItems: 'center',
                          gap: moderateScale(5),
                          alignSelf: 'flex-start',
                          borderRadius: moderateScale(5),
                          opacity: loadingTripId === trip.Tripid ? 0.6 : 1,
                        }}
                        onPress={() => handleMapPress(trip)}
                        disabled={loadingTripId === trip.Tripid}
                      >
                        {loadingTripId === trip.Tripid ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.white}
                          />
                        ) : (
                          <SmallIcon
                            source={Icons.map_white}
                            style={{
                              width: moderateScale(15),
                              height: moderateScale(12),
                            }}
                          />
                        )}
                        <SubLabel style={{ color: Colors.white }}>
                          {loadingTripId === trip.Tripid ? 'Map' : 'Map'}
                        </SubLabel>
                      </TouchableOpacity>
                    </FleetRangeMarker>
                  </FleetAvgRow>
                </TripReportCards>
              )
            ),
          )}
        </View>
      )}
    </View>
  );

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
          Trip Report
        </Text>
        <Text
          style={{
            fontSize: moderateScale(14),
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginTop: moderateScale(4),
          }}
        >
          {formatDateForDisplay(startDate)}
        </Text>
      </View>

      <View style={{ width: moderateScale(41) }} />
    </View>
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
        {/* {renderFleetAverageHeader()} */}

        {/* Render all trip cards */}
        {tripCards.map((tripData: any, index: number) =>
          renderVehicleCard({
            ...tripData,
            id: tripData.PlateNumber || index + 1,
          }),
        )}
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
