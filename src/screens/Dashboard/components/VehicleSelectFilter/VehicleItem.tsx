import React from 'react';
import { Image, View } from 'react-native';
import { Vehicle } from './types';
import {
  ItemContainer,
  CheckboxContainer,
  Checkbox,
  Checkmark,
  VehicleInfo,
  VehicleHeader,
  VehicleName,
  PlateNumber,
  DriverInfo,
  DriverName,
  LocationText,
  StatusSection,
  StatusText,
  LastUpdate,
  StatusIndicator,
} from './styles';
import { moderateScale } from 'react-native-size-matters';
import Icons from '../../../../common/icons';

interface VehicleItemProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const VehicleItem: React.FC<VehicleItemProps> = ({
  vehicle,
  isSelected,
  onToggle,
  disabled = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on':
        return '#4CAF50';
      case 'idle':
        return '#FF9800';
      case 'off':
        return '#9E9E9E';
      case 'longoff':
        return '#9E9E9E';
      case 'overspeed':
        return '#F44336';
      case 'no_signal':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusIcon = (statusKey: string) => {
    console.log('🔍 Getting icon for status:', statusKey);

    switch (statusKey) {
      case 'on':
        console.log('🟢 Using vehicle_front_green icon');
        return Icons.car_green;
      case 'idle':
        console.log('🟠 Using vehicle_front_orange icon');
        return Icons.car_orange;
      case 'off':
      case 'longoff':
        console.log('⚫ Using vehicle_front_grey icon');
        return Icons.car_grey;
      case 'overspeed':
        console.log('🔴 Using vehicle_front_red icon for overspeed');
        return Icons.car_red || Icons.car_grey; // Use red if available, fallback to grey
      case 'no_signal':
        console.log('⚫📡 Using vehicle_front_grey with no signal overlay');
        return Icons.car_grey; // Base grey car icon
      default:
        console.log('❓ Using default vehicle_front_grey icon');
        return Icons.vehicle_front_grey;
    }
  };

  const renderStatusIcon = (status: string) => {
    if (status === 'no_signal') {
      // Grey car with no signal overlay
      return (
        <View
          style={{
            position: 'relative',
            width: moderateScale(50),
            height: moderateScale(50),
            marginBottom: moderateScale(2),
          }}
        >
          {/* Base grey car icon */}
          <Image
            source={getStatusIcon(status)}
            style={{
              width: moderateScale(50),
              height: moderateScale(50),
            }}
            resizeMode="contain"
          />
          {/* No signal overlay - positioned absolutely on top right */}
          <Image
            source={Icons.nosignal_blue}
            style={{
              position: 'absolute',
              top: moderateScale(10),
              left: moderateScale(1),
              width: moderateScale(16),
              height: moderateScale(16),
            }}
            resizeMode="contain"
          />
        </View>
      );
    } else if (status === 'overspeed') {
      // Red car for overspeed
      return (
        <Image
          source={getStatusIcon(status)}
          style={{
            width: moderateScale(50),
            height: moderateScale(50),
            marginBottom: moderateScale(2),
          }}
          resizeMode="contain"
        />
      );
    } else {
      // Regular status icons
      return (
        <Image
          source={getStatusIcon(status)}
          style={{
            width: moderateScale(50),
            height: moderateScale(50),
            marginBottom: moderateScale(2),
          }}
          resizeMode="contain"
        />
      );
    }
  };

  // Format status time to relative time
  const formatStatusTime = (statusTime: string) => {
    try {
      const now = new Date();
      const statusDate = new Date(statusTime);
      const diffInMinutes = Math.floor((now.getTime() - statusDate.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
      return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <ItemContainer
      onPress={onToggle}
      isSelected={isSelected}
      disabled={disabled}
    >
      <CheckboxContainer>
        <Checkbox isSelected={isSelected} disabled={disabled}>
          {isSelected && <Checkmark>✓</Checkmark>}
        </Checkbox>
      </CheckboxContainer>
      <StatusSection>
        {renderStatusIcon(vehicle.status)}
        <LastUpdate numberOfLines={1} ellipsizeMode="tail">
          {formatStatusTime(vehicle.status_time)}
        </LastUpdate>
      </StatusSection>

      <VehicleInfo>
        <VehicleHeader>
          <VehicleName numberOfLines={1} ellipsizeMode="tail">
            {vehicle.name}
          </VehicleName>
        </VehicleHeader>

        <PlateNumber numberOfLines={1} ellipsizeMode="tail">
          {vehicle.vehicle_Number || 'N/A'}
        </PlateNumber>

        <DriverInfo>
          <DriverName numberOfLines={1} ellipsizeMode="tail">
            {vehicle.driver_name || 'No Driver'}
          </DriverName>
          <LocationText numberOfLines={1} ellipsizeMode="tail">
            {vehicle.location} • {vehicle.area}
          </LocationText>
        </DriverInfo>
      </VehicleInfo>
    </ItemContainer>
  );
};
