import React, { useMemo, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import {
  moderateScale as ms,
  scale as hs,
  verticalScale as vs,
} from 'react-native-size-matters';

// Marker icons (ensure these exist and are <= ~50KB, 32–64px)
const iconBlue = require('../../../../../assets/icons/map_vehicle_blue.png');
const iconGreen = require('../../../../../assets/icons/map_vehicle_green.png');
const iconGrey = require('../../../../../assets/icons/map_vehicle_grey.png');
const iconOrange = require('../../../../../assets/icons/map_vehicle_orange.png');

type Status =
  | 'on'
  | 'running'
  | 'start'
  | 'idle'
  | 'off'
  | 'stop'
  | 'no_signal'
  | 'longoff';

export type SingleVehicle = {
  id: string;
  name: string;
  status: Status;
  coordinates: [number, number]; // [lng, lat]
};

type Props = {
  vehicle: SingleVehicle;
  initialRegion?: Region;
  mapType?: 'standard' | 'satellite' | 'hybrid' | 'terrain';
  onMarkerPress?: (vehicle: SingleVehicle) => void;
};

// Styled
const Container = styled.View`
  flex: 1;
  border-radius: ${ms(8)}px;
  overflow: hidden;
`;

const InfoChip = styled.View`
  position: absolute;
  left: ${hs(12)}px;
  bottom: ${vs(12)}px;
  background-color: rgba(17, 24, 39, 0.9);
  padding-top: ${vs(8)}px;
  padding-right: ${hs(10)}px;
  border-radius: ${ms(8)}px;
`;

const ChipText = styled.Text`
  color: #fff;
  font-size: ${ms(12)}px;
  font-weight: 600;
`;

// iOS custom marker view (Android uses native icon prop)
const MarkerWrap = styled.View`
  align-items: center;
  justify-content: center;
  padding: ${vs(2)}px;
  background-color: rgba(
    0,
    0,
    0,
    0.001
  ); /* nudge Android/iOS texture pipeline */
  border-radius: ${ms(18)}px;
`;

const MarkerImage = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${ms(32)}px;
  height: ${ms(32)}px;
`;

// Status -> icon
const statusIcon = (status: Status) => {
  switch (status) {
    case 'on':
      
    case 'running':
      return iconBlue;
    case 'start':
      return iconGreen;
    case 'idle':
      return iconOrange;
    case 'off':
    case 'stop':
    case 'no_signal':
    case 'longoff':
    default:
      return iconGrey;
  }
};

const toRegion = (lng: number, lat: number): Region => ({
  latitude: lat,
  longitude: lng,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
});

const VehicleLocationMap: React.FC<Props> = ({
  vehicle,
  initialRegion,
  mapType = 'standard',
  onMarkerPress,
}) => {
  const [chipVisible, setChipVisible] = useState(false);

  const region = useMemo<Region>(() => {
    if (initialRegion) return initialRegion;
    const [lng, lat] = vehicle.coordinates;
    return toRegion(lng, lat);
  }, [initialRegion, vehicle.coordinates]);

  const [lng, lat] = vehicle.coordinates;

  return (
    <Container>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={region}
        mapType={mapType}
        toolbarEnabled={false}
        rotateEnabled={false}
        moveOnMarkerPress={false}
      >
        <Marker
          coordinate={{ latitude: lat, longitude: lng }}
          anchor={{ x: 0.5, y: 0.9 }}
          onPress={() => {
            setChipVisible(true);
            onMarkerPress?.(vehicle);
          }}
          // Use native icon on Android; custom child on iOS
          {...(Platform.OS === 'android'
            ? { icon: statusIcon(vehicle.status) }
            : {})}
          tracksViewChanges={false}
        >
          {Platform.OS === 'ios' && (
            <MarkerWrap>
              <MarkerImage source={statusIcon(vehicle.status)} />
            </MarkerWrap>
          )}
        </Marker>
      </MapView>

      {chipVisible && (
        <InfoChip>
          <ChipText numberOfLines={1} ellipsizeMode="tail">
            {vehicle.name} • {vehicle.status.toUpperCase()}
          </ChipText>
        </InfoChip>
      )}
    </Container>
  );
};

export default VehicleLocationMap;
