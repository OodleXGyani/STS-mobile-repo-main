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
import { Vehicle } from '../../../context/types';
import timeAgo from '../utils';
import { moderateScale } from 'react-native-size-matters';

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
  carByStatus: Record<string, any>;
  starGrey: any;
  starYellow: any;
  clockGrey: any;
  noSignalBlue: any;
}

type Nav = NativeStackNavigationProp<{
  DashboardMain: undefined;
  DetailPage: { 
    item: Vehicle
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
  console.log('vehicle', vehicle)

      const handlePress = () => {
      navigation.navigate('DetailPage', {
        item: vehicle,
      });
    };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      idle: 'Idle',
      off: 'Off',
      on: 'On',
      no_signal: 'No signal',
    };
    return statusMap[status] || 'Off';
  };

  return (
    <StyledVehicleItem onPress={handlePress}>
      <ColLeft>
        <IconContainer>
          <SmallIcon
            source={carByStatus[vehicle.status]}
            style={{ width: 55, height: 20 }}
          />
          {vehicle.status === 'no_signal' && (
            <NoSignalIcon source={noSignalBlue} />
          )}
        </IconContainer>
        <StatusText>{vehicle.status === "on" ? `${vehicle.speed}` : getStatusText(vehicle.status)}</StatusText>
      </ColLeft>

      <ColRight>
        <Row>
                      <VehicleName>{vehicle.driver_name}</VehicleName>
            <SmallRow>
              {Array.from({ length: 5 }).map((_, i) => (
                <SmallIcon
                  key={i}
                  source={
                    i < (vehicle.driver_rating ?? 0) ? starYellow : starGrey
                  }
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
            {vehicle.name || '—'}
          </VehicleName>
          <VehicleName style={{ fontSize: 14, color: '#9ca3af' }}>
            {vehicle.location || '—'}
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
              {timeAgo(vehicle.status_time)}
            </VehicleName>
          </SmallRow>
        </Row>
      </ColRight>
    </StyledVehicleItem>
  );
};
