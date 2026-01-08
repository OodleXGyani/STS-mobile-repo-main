import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  VehicleItem as StyledVehicleItem,
  ColLeft,
  SmallIcon,
  StatusText,
  ColRight,
  Row,
  VehicleName,
  SmallRow,
} from '../accordian-styles';
import styled from 'styled-components/native';
import { Vehicle, VehicleStatus } from '../../../context/types';
import timeAgo from '../utils';
import { moderateScale } from 'react-native-size-matters';
import { getStatusDisplayName, getStatusColor } from '../../../utils/statusNormalizer';

const IconContainer = styled.View`
  position: relative;
  width: 55px;
  height: 20px;
`;

const NoSignalIcon = styled.Image`
  position: absolute;
  top: -5px;
  left: 0px;
  width: ${moderateScale(20)};
  height: ${moderateScale(20)};
  z-index: 1;
`;

interface VehicleItemProps {
  vehicle: Vehicle;
  carByStatus: Record<VehicleStatus, any>;
  starGrey: any;
  starYellow: any;
  clockGrey: any;
  noSignalBlue: any;
}

type Nav = NativeStackNavigationProp<{
  DashboardMain: undefined;
  DetailPage: {
    item: Vehicle;
  };
}>;

export const VehicleItem: React.FC<VehicleItemProps> = ({
  vehicle,
  carByStatus,
  starGrey,
  starYellow,
  clockGrey,
  noSignalBlue,
}) => {
  const navigation = useNavigation<Nav>();

  const handlePress = () => {
    navigation.navigate('DetailPage', {
      item: vehicle,
    });
  };

  /**
   * Get display text for vehicle status
   * For "Moving" status, show speed; otherwise show status name
   */
  const getStatusDisplayText = (status: VehicleStatus, speed: string): string => {
    return status === VehicleStatus.MOVING ? speed : getStatusDisplayName(status);
  };

  /**
   * Parse speed value from speed string (e.g., "45Km/h" -> "45")
   */
  const parseSpeed = (speedStr: string): string => {
    if (!speedStr) return '0';
    return speedStr.replace(/[^\d]/g, '') || '0';
  };

  const speed = parseSpeed(vehicle.speed);
  const driverName = vehicle.driverName && vehicle.driverName !== 'No Driver' ? vehicle.driverName : '—';
  const location = vehicle.location || '—';
  const vehicleDisplayName = vehicle.name || vehicle.unitAlias || '—';

  return (
    <StyledVehicleItem onPress={handlePress}>
      <ColLeft>
        <IconContainer>
          <SmallIcon
            source={carByStatus[vehicle.status]}
            style={{ width: 55, height: 20 }}
          />
          {vehicle.status === VehicleStatus.NO_SIGNAL && (
            <NoSignalIcon source={noSignalBlue} />
          )}
        </IconContainer>
        <StatusText>
          {getStatusDisplayText(vehicle.status, speed)}
        </StatusText>
      </ColLeft>

      <ColRight>
        <Row>
          <VehicleName>{driverName}</VehicleName>
          <SmallRow>
            {Array.from({ length: 5 }).map((_, i) => (
              <SmallIcon
                key={i}
                source={starYellow}
                style={{
                  width: 12,
                  height: 12,
                  marginLeft: i ? 2 : 0,
                }}
              />
            ))}
          </SmallRow>
        </Row>

        <Row>
          <VehicleName style={{ fontSize: 14, color: '#9ca3af' }}>
            {vehicleDisplayName}
          </VehicleName>
          <VehicleName style={{ fontSize: 14, color: '#9ca3af' }}>
            {location}
          </VehicleName>
          <SmallRow>
            <SmallIcon source={clockGrey} />
            <VehicleName
              style={{
                fontSize: 14,
                color: '#9ca3af',
                marginLeft: 6,
              }}
            >
              {timeAgo(vehicle.statusTime)}
            </VehicleName>
          </SmallRow>
        </Row>
      </ColRight>
    </StyledVehicleItem>
  );
};
