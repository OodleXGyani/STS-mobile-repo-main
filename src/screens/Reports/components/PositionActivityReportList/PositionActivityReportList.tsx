import React, { useState, useMemo } from 'react';
import { Text, TouchableOpacity, FlatList, View, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  BackIcon,
  HeaderTitle,
  DetailsContainer,
  FlatRow,
  ItemContainer,
  LeftContainer,
  RightContainer,
  ItemHeader,
  ItemFooter,
  CarIcon,
  SpeedText,
  LocationText,
  MapButton,
  MapIcon,
  ItemId,
  ItemTime,
  LocationRow,
  LocationIcon,
  MapButtonText,
} from './position-activity-styles';
import { formatDateForDisplay, formatTo12Hour } from '../../../../utils';
import InfoModal from '../InfoModal';

const backIcon = require('../../../../assets/icons/backArrow.png');
const carIcon = require('../../../../assets/icons/vehicles/car/car_blue.png');
const locationIcon = require('../../../../assets/icons/location_grey.png');
const mapIcon = require('../../../../assets/icons/map_blue.png');
const infoIcon = require('../../../../assets/icons/info_blue.png');

interface PositionDataItem {
  X: number;
  Y: number;
  Time: string;
  Vehicle: string;
  DriverName: string;
  VehicleSpeed?: number;
  DriverId?: string;
  Road?: string;
  AreaName?: string;
  Status?: string;
}

interface MapPayloadItem {
  X: number;
  Y: number;
  Vehicle: string;
  Time: string;
  DriverName: string;
}

/**
 * Map visualization component for Position Activity Report
 * Displays all position data points as markers and optionally as a trace path
 *
 * Per specification: Convert each result item to map payload:
 * { X, Y, Vehicle, Time, DriverName }
 */
const PositionActivityMapView: React.FC<{
  data: MapPayloadItem[];
  onClose: () => void;
}> = ({ data, onClose }) => {
  const [showTracePath, setShowTracePath] = useState(true);

  // Calculate map region to fit all markers
  const mapRegion = useMemo(() => {
    if (!data || data.length === 0) {
      // Default to Bahrain center
      return {
        latitude: 26.0667,
        longitude: 50.5577,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }

    // Get bounding box of all points
    const latitudes = data.map(d => d.Y);
    const longitudes = data.map(d => d.X);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = Math.max(maxLat - minLat, 0.1) * 1.3;
    const lngDelta = Math.max(maxLng - minLng, 0.1) * 1.3;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      {/* Map placeholder - TODO: Integrate with react-native-maps */}
      <View style={{ flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
          📍 Map View - {data.length} positions
        </Text>
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>Map Region:</Text>
          </Text>
          <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            Center: {mapRegion.latitude.toFixed(4)}, {mapRegion.longitude.toFixed(4)}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            Zoom: {mapRegion.latitudeDelta.toFixed(4)}°
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#003459',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            marginBottom: 8,
          }}
          onPress={() => setShowTracePath(!showTracePath)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {showTracePath ? '✓' : ''} Trace Path
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: '#999', marginTop: 16 }}>
          Ready for map integration
        </Text>
      </View>
    </View>
  );
};

const PositionActivityReportList: React.FC = () => {
  const navigation = useNavigation();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMapView, setShowMapView] = useState(false);

  const route = useRoute();
  const routeData = (route.params as { data?: any })?.data;

  // Handle both formats:
  // 1. Direct array: [{ X, Y, Time, ... }, ...]
  // 2. Wrapped object: { HistoryData: [{ ... }, ...] }
  const positionData: PositionDataItem[] = Array.isArray(routeData) ? routeData : routeData?.HistoryData || [];

  console.log('positionData', positionData);
  const { startDate, endDate } = route.params as { startDate: string, endDate: string };

  /**
   * Convert position data items to map payload format
   * Per specification: { X, Y, Vehicle, Time, DriverName }
   */
  const mapPayloadData = useMemo(() => {
    return positionData.map(item => ({
      X: item.X,
      Y: item.Y,
      Vehicle: item.Vehicle,
      Time: item.Time,
      DriverName: item.DriverName,
    }));
  }, [positionData]);

  const renderItem = ({ item }: { item: any }) => (
    <ItemContainer>
      <LeftContainer>
        <CarIcon source={carIcon} />
        <SpeedText>
          {item?.VehicleSpeed !== undefined && item?.VehicleSpeed !== null ? `${item.VehicleSpeed} km/h` : 'Speed N/A'}
        </SpeedText>
      </LeftContainer>

      <RightContainer>
        <ItemHeader>
          <ItemId>{item?.DriverId ?? 'Unknown ID'}</ItemId>
          <ItemTime>
            {item?.Time ? formatTo12Hour(item.Time) : '--:--'}
          </ItemTime>
        </ItemHeader>

        <LocationRow>
          <LocationIcon source={locationIcon} />
          <LocationText>
            {item?.Road && item?.AreaName
              ? `${item.Road}, ${item.AreaName}`
              : 'Location not available'}
          </LocationText>
        </LocationRow>

        <ItemFooter>
          <MapButton onPress={() => {
            (navigation as any).navigate('LocationMap', {
              coordinates: {
                latitude: item?.Y,
                longitude: item?.X,
                item: item,
              },
            });
          }}>
            <MapIcon source={mapIcon} />
            <MapButtonText>Map</MapButtonText>
          </MapButton>
        </ItemFooter>
      </RightContainer>
    </ItemContainer>
  );

  // Show map view if toggled
  if (showMapView) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
        <Header>
          <TouchableOpacity onPress={() => setShowMapView(false)}>
            <BackIcon source={backIcon} />
          </TouchableOpacity>
          <HeaderTitle>
            Trace Path{'\n'}({formatDateForDisplay(startDate)})
          </HeaderTitle>
          <Text style={{ width: 24 }} />
        </Header>

        <DetailsContainer>
          <PositionActivityMapView
            data={mapPayloadData}
            onClose={() => setShowMapView(false)}
          />
        </DetailsContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon source={backIcon} />
        </TouchableOpacity>
        <HeaderTitle>
          Position Activity Report{'\n'}({formatDateForDisplay(startDate)})
        </HeaderTitle>
        <TouchableOpacity onPress={() => setShowMapView(true)} style={{ padding: 4 }}>
          <MapIcon source={mapIcon} />
        </TouchableOpacity>
      </Header>

      <DetailsContainer>
        {!positionData || !Array.isArray(positionData) ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text style={{ color: '#666', fontSize: 16 }}>
              No data available
            </Text>
          </View>
        ) : positionData.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text style={{ color: '#666', fontSize: 16 }}>
              No position activity records found
            </Text>
          </View>
        ) : (
          <FlatList
            data={positionData}
            keyExtractor={(item, index) => `${item?.Vehicle ?? 'no-vehicle'}-${item?.Time ?? 'no-time'}-${index}`}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <FlatRow style={{ height: 1, backgroundColor: '#eee' }} />
            )}
          />
        )}
      </DetailsContainer>

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

      <InfoModal visible={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </SafeAreaView>
  );
};

export default PositionActivityReportList;
