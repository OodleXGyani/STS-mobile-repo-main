import React, { useMemo } from 'react';
import { Marker } from 'react-native-maps';
import { Platform, View, Image, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Vehicle } from '../../VehicleSelectFilter/types';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  onMarkerPress: (vehicle: Vehicle) => void;
}

// Marker icons - use require for cross-platform compatibility
const iconBlue = require('../../../../../assets/icons/map_vehicle_blue.png');
const iconGreen = require('../../../../../assets/icons/map_vehicle_green.png');
const iconGrey = require('../../../../../assets/icons/map_vehicle_grey.png');
const iconOrange = require('../../../../../assets/icons/map_vehicle_orange.png');

// SVG vehicle icon for Android
const vehicleSvg = require('../../../../../assets/icons/map_vehicle_blue.svg');

// Status colors for markers
const getStatusColor = (status: string) => {
  switch (status) {
    case 'on': return '#22C55E'; // green
    case 'idle': return '#FACC15'; // yellow
    case 'off':
    case 'longoff':
      return '#9CA3AF'; // grey
    case 'no_signal': return Colors.primary_blue_color; // blue
    case 'overspeed': return '#EF4444'; // red
    default: return Colors.primary_blue_color; // grey
  }
};

// Dynamic SVG Vehicle Icon with status-based colors (memoized)
export const DynamicVehicleIcon = React.memo(({ status }: { status: string }) => {
  const statusColor = getStatusColor(status);
  
  return (
    <Svg width={moderateScale(30)} height={moderateScale(30)} viewBox="0 0 80 100">
      {/* Vehicle shape using the exact SVG path from map_vehicle_blue.svg */}
      <Path
        d="M0 0 C0.66 0 1.32 0 2 0 C9.41773912 17.95408744 16.59634118 36.00190903 23.75 54.0625 C24.20289398 55.20544525 24.65578796 56.3483905 25.12240601 57.52597046 C27.69920745 64.03063478 30.27095153 70.5372628 32.83569336 77.04669189 C33.59770659 78.97956744 34.36084606 80.91199946 35.12524414 82.84393311 C36.13365318 85.39337533 37.13780425 87.94444926 38.140625 90.49609375 C38.43515564 91.23827652 38.72968628 91.98045929 39.03314209 92.74513245 C41 97.77105694 41 97.77105694 41 100 C36.64029543 98.54676514 33.44612488 96.18741531 29.9375 93.3125 C28.70944554 92.33453924 27.48020384 91.35806812 26.25 90.3828125 C23.99055378 88.58503197 21.73218526 86.78597622 19.4765625 84.98339844 C16.81103437 82.86602327 14.12630673 80.77520154 11.4375 78.6875 C10.5808374 77.99889893 9.7241748 77.31029785 8.84155273 76.60083008 C8.02630127 75.97329834 7.2110498 75.3457666 6.37109375 74.69921875 C5.64849365 74.13033936 4.92589355 73.56145996 4.18139648 72.9753418 C1.98774086 71.72249847 1.98774086 71.72249847 -0.53173828 72.65405273 C-2.83597926 73.91055921 -4.81470187 75.20097555 -6.86328125 76.8359375 C-7.57806641 77.40038574 -8.29285156 77.96483398 -9.02929688 78.54638672 C-9.78275391 79.1498291 -10.53621094 79.75327148 -11.3125 80.375 C-12.91194304 81.63645374 -14.51222171 82.89684858 -16.11328125 84.15625 C-16.9223291 84.79433594 -17.73137695 85.43242188 -18.56494141 86.08984375 C-22.34750453 89.05703584 -26.16516909 91.97580601 -30 94.875 C-30.67587158 95.39239746 -31.35174316 95.90979492 -32.0480957 96.44287109 C-36.76674853 100 -36.76674853 100 -39 100 C-36.57778423 90.94837731 -33.08425579 82.33533063 -29.609375 73.65234375 C-28.97990579 72.07081875 -28.35078247 70.48915604 -27.72198486 68.90736389 C-26.40655097 65.60071702 -25.08842715 62.2951611 -23.76806641 58.99047852 C-22.09611038 54.80578602 -20.42860048 50.61934191 -18.7628746 46.4321661 C-17.15067498 42.37997403 -15.53642635 38.32859927 -13.921875 34.27734375 C-13.62395805 33.52947035 -13.32604111 32.78159695 -13.01909637 32.01106071 C-8.75373694 21.30962701 -4.40606461 10.64426572 0 0 Z"
        fill={statusColor}
        transform="translate(39,0)"
      />
    </Svg>
  );
});

// Status -> icon mapping (memoized)
const getStatusIcon = (status: string) => {
  try {
    switch (status) {
      case 'on':
        return iconGreen;
      case 'idle':
        return iconOrange;
      case 'longoff':

      case 'off':
        return iconGrey;
      case 'no_signal':
        return iconBlue;
      case 'overspeed':
   
      default:
        return iconBlue;
    }
  } catch (error) {
    return iconGrey; // Fallback to grey icon
  }
};

const VehicleMarkerComponent: React.FC<VehicleMarkerProps> = ({
  vehicle,
  onMarkerPress,
}) => {
  // Memoize expensive calculations
  const icon = useMemo(() => getStatusIcon(vehicle.status), [vehicle.status]);
  const statusColor = useMemo(() => getStatusColor(vehicle.status), [vehicle.status]);
  const isAndroid = useMemo(() => Platform.OS === 'android', []);

  // Validate coordinates
  if (!vehicle.coordinates || vehicle.coordinates.length !== 2) {
    return null;
  }

  // Use dynamic SVG vehicle icon with status colors for both platforms
  return (
    <Marker
      key={vehicle.key}
      coordinate={{
        latitude: vehicle.coordinates[1],
        longitude: vehicle.coordinates[0],
      }}
      onPress={() => onMarkerPress(vehicle)}
      tracksViewChanges={false}
      centerOffset={{ x: 0, y: -12 }}
    >
      <View style={{ 
        alignItems: 'center', 
        justifyContent: 'center',
      }}>
        <DynamicVehicleIcon status={vehicle.status} />
      </View>
    </Marker>
  );
};

export const VehicleMarker = React.memo(VehicleMarkerComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if vehicle key, status, or coordinates change
  return (
    prevProps.vehicle.key === nextProps.vehicle.key &&
    prevProps.vehicle.status === nextProps.vehicle.status &&
    JSON.stringify(prevProps.vehicle.coordinates) === JSON.stringify(nextProps.vehicle.coordinates) &&
    prevProps.onMarkerPress === nextProps.onMarkerPress
  );
});
