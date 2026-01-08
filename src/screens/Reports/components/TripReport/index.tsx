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

// Empty state styled components
const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${moderateScale(20)}px;
  background-color: white;
`;

const EmptyStateText = styled(Text)`
  font-size: ${moderateScale(18)}px;
  font-weight: bold;
  color: ${Colors.primary_blue_color};
  text-align: center;
  margin-bottom: ${moderateScale(10)}px;
`;

const EmptyStateSubText = styled(Text)`
  font-size: ${moderateScale(14)}px;
  color: #666;
  text-align: center;
`;

const ErrorStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${moderateScale(20)}px;
  background-color: #fff3cd;
`;

const ErrorStateText = styled(Text)`
  font-size: ${moderateScale(16)}px;
  font-weight: bold;
  color: #856404;
  text-align: center;
  margin-bottom: ${moderateScale(10)}px;
`;

/**
 * Normalizes API trip data to match component expected structure
 * Maps API field names to component expected field names
 *
 * API provides: TripId, TripEndTime, MaximumSpeed, StoppageTime, TripDuration, StartLatitude, etc.
 * Component expects: Tripid, StartTime, EndTime, MaxSpeed, StopTime, TotalTime, DistanceTravelled, IdleTime
 */
const normalizeTripRecord = (trip: any): any => {
  return {
    Tripid: trip.TripId || trip.Tripid || null,
    DriverName: trip.DriverName || null,
    StartTime: trip.StartTime || trip.TripStartTime || null,
    EndTime: trip.TripEndTime || trip.EndTime || null,
    StartLocation: trip.StartLocation || 'N/A',
    EndLocation: trip.EndLocation || 'N/A',
    DistanceTravelled: trip.DistanceTravelled || trip.Distance || 0,
    IdleTime: trip.IdleTime || 0,
    MaxSpeed: trip.MaximumSpeed || trip.MaxSpeed || 0,
    StopTime: trip.StoppageTime || trip.StopTime || 0,
    TotalTime: trip.TripDuration || trip.TotalTime || 0,
    Vehicle: trip.Vehicle || null,
    PlateNumber: trip.PlateNumber || null,
    Type: trip.Type || null,
    // Preserve other fields for reference
    VehicleId: trip.VehicleId || null,
    DriverId: trip.DriverId || null,
    IsValidData: trip.IsValidData !== undefined ? trip.IsValidData : true,
  };
};

// Trip report data processing function
const processTripReport = (data: any) => {
  console.log('📊 [processTripReport] Raw data received:');
  console.log('📊 [processTripReport] Data type:', typeof data);
  console.log('📊 [processTripReport] Is array?', Array.isArray(data));
  console.log('📊 [processTripReport] Data keys:', Array.isArray(data) ? 'N/A (array)' : Object.keys(data || {}));
  console.log('📊 [processTripReport] Full data:', JSON.stringify(data, null, 2).substring(0, 500));

  // Handle null/undefined
  if (!data) {
    console.log('📊 [processTripReport] Data is null/undefined, returning empty result');
    return {
      id: null,
      TripData: [],
    };
  }

  // FALLBACK 1: Handle direct array response
  // If API returns [{ Tripid, StartTime, ... }] directly instead of { TripData: [...] }
  if (Array.isArray(data)) {
    console.log('📊 [processTripReport] Data is direct array, wrapping as TripData');
    const ilen = data.length;
    if (ilen > 0) {
      // Process the wrapped data using existing logic
      let groups: any = {};
      for (let i = 0; i < ilen; i++) {
        // Normalize the API response to component expected structure
        const normalizedTrip = normalizeTripRecord(data[i]);
        const plateNumber = normalizedTrip.PlateNumber || `Vehicle_${i}`;

        if (!groups[plateNumber]) {
          groups[plateNumber] = {
            DistanceTravelled: 0,
            TotalTime: 0,
            IdleTime: 0,
            MaxSpeed: 0,
            StopTime: 0,
            Vehicle: normalizedTrip.Vehicle,
            Type: normalizedTrip.Type,
            PlateNumber: plateNumber,
            Trips: [],
          };
        }
        groups[plateNumber].Trips.push(normalizedTrip);

        // Aggregate metrics for the vehicle
        groups[plateNumber].DistanceTravelled += parseFloat(normalizedTrip.DistanceTravelled || 0);
        groups[plateNumber].TotalTime += parseInt(normalizedTrip.TotalTime || 0);
        groups[plateNumber].IdleTime += parseInt(normalizedTrip.IdleTime || 0);
        groups[plateNumber].StopTime += parseInt(normalizedTrip.StopTime || 0);

        const maxSpeed = parseInt(normalizedTrip.MaxSpeed || 0);
        if (maxSpeed > groups[plateNumber].MaxSpeed) {
          groups[plateNumber].MaxSpeed = maxSpeed;
        }
      }
      console.log('📊 [processTripReport] Array processed into', Object.keys(groups).length, 'vehicles');
      return {
        id: null,
        TripData: Object.values(groups),
      };
    }
  }

  // FALLBACK 2: Try alternate property names
  // Support TripData, trips, data, result property names
  let tripDataArray =
    data.TripData ||
    data.trips ||
    data.trip_data ||
    (Array.isArray(data.data) ? data.data : null) ||
    (Array.isArray(data.result) ? data.result : null);

  console.log('📊 [processTripReport] TripData array found at property:',
    data.TripData ? 'TripData' :
    data.trips ? 'trips' :
    data.trip_data ? 'trip_data' :
    Array.isArray(data.data) ? 'data' :
    Array.isArray(data.result) ? 'result' :
    'NOT FOUND'
  );

  const ilen = tripDataArray?.length || 0;
  console.log('📊 [processTripReport] TripData length:', ilen);

  if (ilen && tripDataArray) {
    let groups: any = {};

    // Group trips by PlateNumber (Vehicle)
    for (var i = 0; i < ilen; i++) {
      // Normalize the API response to component expected structure
      const normalizedTrip = normalizeTripRecord(tripDataArray[i]);
      const plateNumber = normalizedTrip.PlateNumber || `Vehicle_${i}`;

      if (!groups[plateNumber]) {
        groups[plateNumber] = {
          DistanceTravelled: 0,
          TotalTime: 0,
          IdleTime: 0,
          MaxSpeed: 0,
          StopTime: 0,
          Vehicle: normalizedTrip.Vehicle,
          Type: normalizedTrip.Type,
          PlateNumber: plateNumber,
          Trips: [], // Array to store individual trips
        };
      }

      // Add individual trip to the group
      groups[plateNumber].Trips.push(normalizedTrip);

      // Aggregate metrics for the vehicle
      groups[plateNumber].DistanceTravelled += parseFloat(
        normalizedTrip.DistanceTravelled || 0,
      );
      groups[plateNumber].TotalTime += parseInt(
        normalizedTrip.TotalTime || 0,
      );
      groups[plateNumber].IdleTime += parseInt(
        normalizedTrip.IdleTime || 0,
      );
      groups[plateNumber].StopTime += parseInt(
        normalizedTrip.StopTime || 0,
      );

      // Keep track of maximum speed
      const maxSpeed = parseInt(normalizedTrip.MaxSpeed || 0);
      if (maxSpeed > groups[plateNumber].MaxSpeed) {
        groups[plateNumber].MaxSpeed = maxSpeed;
      }
    }

    const result = {
      id: data.Id || null,
      TripData: Object.values(groups), // Convert object to array
    };
    console.log('📊 [processTripReport] Processed result:', {
      id: result.id,
      vehicleCount: result.TripData.length,
      structure: 'Has TripData array',
    });
    return result;
  } else {
    console.log('📊 [processTripReport] No TripData found, returning empty result');
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

  console.log('🎯 [TripReport] Component mounted with route params:');
  console.log('🎯 [TripReport] report type:', typeof report);
  console.log('🎯 [TripReport] report is array?', Array.isArray(report));
  console.log('🎯 [TripReport] startDate:', startDate);
  console.log('🎯 [TripReport] endDate:', endDate);

  const [
    getVehiclePathReport,
    { data: vehiclePathReport, isLoading: isVehiclePathReportLoading },
  ] = useGetVehiclePathReportMutation();

  // State to track loading for individual trip map buttons
  const [loadingTripId, setLoadingTripId] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processedTripData, setProcessedTripData] = useState<{
    id: null | string;
    TripData: any[];
  }>({ id: null, TripData: [] });

  // Process the real trip report data with error handling (moved to useEffect to avoid infinite renders)
  useEffect(() => {
    let data = { id: null, TripData: [] };
    try {
      if (report) {
        data = processTripReport(report);
        setProcessingError(null);
        console.log('🎯 [TripReport] ✅ Processing succeeded');
      } else {
        console.log('🎯 [TripReport] ⚠️ No report data provided');
        setProcessingError(null);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error processing report data';
      console.error('🎯 [TripReport] ❌ Processing error:', errorMsg);
      setProcessingError(errorMsg);
      data = { id: null, TripData: [] };
    }
    setProcessedTripData(data);
  }, [report]); // Only reprocess when report changes

  const tripCards = processedTripData.TripData;

  console.log('🎯 [TripReport] After processing:');
  console.log('🎯 [TripReport] processedTripData.TripData length:', tripCards.length);
  console.log('🎯 [TripReport] processingError:', processingError);
  console.log('🎯 [TripReport] tripCards:', tripCards);

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

  // Safe render wrapper to catch rendering errors
  const safeRenderVehicleCard = (tripData: any) => {
    try {
      return renderVehicleCard(tripData);
    } catch (error) {
      console.error('🎯 [TripReport] Error rendering vehicle card for', tripData.PlateNumber, ':', error);
      return (
        <View
          key={tripData.PlateNumber}
          style={{
            marginBottom: moderateScale(15),
            padding: moderateScale(10),
            backgroundColor: '#ffe6e6',
            borderRadius: moderateScale(5),
          }}
        >
          <Text style={{ color: 'red', fontWeight: 'bold' }}>
            Error rendering vehicle: {tripData.PlateNumber}
          </Text>
          <Text style={{ color: '#cc0000', fontSize: moderateScale(12) }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </View>
      );
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

      {/* Show error state if processing failed */}
      {processingError ? (
        <ErrorStateContainer>
          <ErrorStateText>⚠️ Error Processing Report</ErrorStateText>
          <ErrorStateSubText>{processingError}</ErrorStateSubText>
          <TouchableOpacity
            style={{
              marginTop: moderateScale(20),
              backgroundColor: Colors.primary_blue_color,
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(20),
              borderRadius: moderateScale(5),
            }}
            onPress={() => handleBackPress()}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </ErrorStateContainer>
      ) : tripCards.length === 0 ? (
        // Show empty state when no trip data
        <EmptyStateContainer>
          <EmptyStateText>📋 No Trips Found</EmptyStateText>
          <EmptyStateSubText>
            No trip data available for the selected date range and vehicles.
          </EmptyStateSubText>
          <EmptyStateSubText style={{ marginTop: moderateScale(10), fontSize: moderateScale(12), color: '#999' }}>
            Try selecting different dates or vehicles.
          </EmptyStateSubText>
          <TouchableOpacity
            style={{
              marginTop: moderateScale(20),
              backgroundColor: Colors.primary_blue_color,
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(20),
              borderRadius: moderateScale(5),
            }}
            onPress={() => handleBackPress()}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
          </TouchableOpacity>
        </EmptyStateContainer>
      ) : (
        // Show trip cards when data exists
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingBottom: verticalScale(20),
            backgroundColor: Colors.white,
          }}
          style={{ flex: 1 }}
        >
          {/* {renderFleetAverageHeader()} */}

          {/* Render all trip cards with error handling */}
          {tripCards.map((tripData: any, index: number) =>
            safeRenderVehicleCard({
              ...tripData,
              id: tripData.PlateNumber || index + 1,
            }),
          )}
        </ScrollView>
      )}

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
