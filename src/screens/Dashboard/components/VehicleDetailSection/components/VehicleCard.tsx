import React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import styled from 'styled-components/native';
import { moderateScale as ms, scale as hs, verticalScale as vs } from 'react-native-size-matters';

const starGrey = require('../../../../../assets/icons/star_full_grey.png');
const starYellow = require('../../../../../assets/icons/star_full_yellow.png');
const clockGrey = require('../../../../../assets/icons/clock_grey.png');
const locationPin = require('../../../../../assets/icons/location_grey.png');

type Status = 'on' | 'idle' | 'off' | 'no_signal' | 'longoff';

const carByStatus: Record<Status, ImageSourcePropType> = {
  on: require('../../../../../assets/icons/vehicles/car/car_green.png'),
  idle: require('../../../../../assets/icons/vehicles/car/car_orange.png'),
  off: require('../../../../../assets/icons/vehicles/car/car_grey.png'),
  longoff: require('../../../../../assets/icons/vehicles/car/car_grey.png'),
  no_signal: require('../../../../../assets/icons/vehicles/car/car_grey.png'),
};

const statusTextMap: Record<Status, string> = {
  on: 'On',
  idle: 'Idle',
  off: 'Off',
  longoff: 'Off',
  no_signal: 'No signal',
};

export type VehicleCardProps = {
  status: Status;
  vehicleNumber: string;
  driverName: string;
  plate: string;
  driverRating: number;
  statusAgoText: string;
  address: string;
  speedLimit: number;
  model: string | null;
  modelDetails?: string;
  serviceDueLabel?: string;
  serviceDueDate?: string;
  onPress?: () => void;
};

const CardWrap = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: ${ms(8)}px;
  padding: ${vs(10)}px ${hs(12)}px;
  margin: ${vs(6)}px 0px;
  elevation: 1;
  shadow-color: #000;
  shadow-opacity: 0.05;
  shadow-radius: ${ms(6)}px;
  shadow-offset: 0px ${vs(2)}px;

  /* Keep strictly inside parent */
  width: 100%;
  max-width: 100%;
  overflow: hidden;
`;

const Row = styled.View<{ gap?: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ gap }) => ms(gap ?? 8)}px;
`;

const LeftCol = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  min-width: 0;
`;

const RightCol = styled.View`
  flex: 5;
  min-width: 0; /* allow shrinking */
`;

const Small = styled.Text<{ color?: string; weight?: string }>`
  color: ${({ color }) => color ?? '#6b7280'};
  font-size: ${ms(12)}px;
  font-weight: ${({ weight }) => weight ?? '400'};
`;

const Title = styled.Text`
  color: #111827;
  font-size: ${ms(14)}px;
  font-weight: 600;
`;

const Subtle = styled.Text`
  color: #9ca3af;
  font-size: ${ms(12)}px;
`;

const StatusText = styled.Text`
  margin-top: ${vs(4)}px;
  color: #6b7280;
  font-size: ${ms(12)}px;
`;

const Icon = styled.Image<{ w?: number; h?: number; ml?: number }>`
  width: ${({ w }) => ms(w ?? 16)}px;
  height: ${({ h }) => ms(h ?? 16)}px;
  margin-left: ${({ ml }) => ms(ml ?? 0)}px;
  resize-mode: contain;
`;
const VDivider = styled.View`
  width: ${hs(1)}px;         
  background-color: black; 
  align-self: stretch;       
  opacity: 1;               
`;
const BadgeCircle = styled.View`
  width: ${ms(32)}px;
  height: ${ms(32)}px;
  border-radius: ${ms(16)}px;
  border-width: ${ms(2)}px;
  border-color: #ef4444;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text`
  color: #111827;
  font-weight: 700;
  font-size: ${ms(12)}px;
`;

const GreyLine = styled.View`
  height: 1px;
  background-color: #f3f4f6;
  margin: ${vs(10)}px 0;
`;

const Stars = ({ value }: { value: number }) => (
  <Row gap={4}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon key={i} w={12} h={12} ml={i ? 2 : 0} source={i < value ? starYellow : starGrey} />
    ))}
  </Row>
);

const ClockAgo = ({ text }: { text: string }) => (
  <Row gap={6}>
    <Icon source={clockGrey} w={14} h={14} />
    <Subtle numberOfLines={1} ellipsizeMode="tail">
      {text}
    </Subtle>
  </Row>
);

const StatusCluster = ({ status }: { status: Status }) => (
  <LeftCol>
    <Icon source={carByStatus[status]} w={50} h={18} />
    <StatusText numberOfLines={1} ellipsizeMode="tail">
      {statusTextMap[status]}
    </StatusText>
  </LeftCol>
);

const VehicleCard: React.FC<VehicleCardProps> = ({
  status,
  driverName,
  plate,
  driverRating,
  statusAgoText,
  address,
  speedLimit,
  model,
  modelDetails,
  serviceDueLabel = 'Service Due',
  serviceDueDate,
  onPress,
}) => {
  return (
    <CardWrap activeOpacity={0.85} onPress={onPress}>
      {/* Card 1 */}
      <Row gap={12}>
        <StatusCluster status={status} />
         <VDivider />

        <RightCol>
          {/* Line 1: Name/Plate + Stars */}
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flexShrink: 1, maxWidth: '70%', minWidth: 0 }}>
              <Title numberOfLines={1} ellipsizeMode="tail">
                {driverName}
              </Title>
              <Small color="#111827" weight="500" numberOfLines={1} ellipsizeMode="tail">
                {plate}
              </Small>
            </View>
            <Stars value={driverRating ?? 0} />
          </Row>

          {/* Line 2: Address + Clock */}
          <Row style={{ marginTop: vs(6), justifyContent: 'space-between' }}>
            <Subtle
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flexShrink: 1, maxWidth: '65%', minWidth: 0 }}
            >
              {address}
            </Subtle>
            <ClockAgo text={statusAgoText} />
          </Row>
        </RightCol>
      </Row>

      <GreyLine />

      {/* Card 2 */}
      <Row>
        {/* Left side: pin + address */}
        <Row style={{ flexShrink: 1, minWidth: 0 }} gap={8}>
          <Icon source={locationPin} w={16} h={16} />
          <Small color="#111827" weight="500" numberOfLines={1} ellipsizeMode="tail">
            {address}
          </Small>
        </Row>

        {/* Flexible spacer */}
        <View style={{ flexGrow: 1, minWidth: 0 }} />

        {/* Right side: speed badge */}
        <Row style={{ flexShrink: 0 }}>
          <BadgeCircle>
            <BadgeText numberOfLines={1}>{speedLimit}</BadgeText>
          </BadgeCircle>
        </Row>
      </Row>

      <GreyLine />

      {/* Card 3 */}
      <Row>
        <View style={{ flex: 1, paddingRight: hs(8), minWidth: 0 }}>
          <Small color="#6b7280" numberOfLines={1} ellipsizeMode="tail">
            Model
          </Small>
          <Title numberOfLines={1} ellipsizeMode="tail">
            {model ?? 'N/A'}
          </Title>
          {!!modelDetails && (
            <Subtle numberOfLines={1} ellipsizeMode="tail">
              {modelDetails}
            </Subtle>
          )}
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', paddingLeft: hs(8), minWidth: 0 }}>
          <Small color="#6b7280" numberOfLines={1} ellipsizeMode="tail">
            {serviceDueLabel}
          </Small>
          <Title numberOfLines={1} ellipsizeMode="tail">
            {serviceDueDate ?? '—'}
          </Title>
        </View>
      </Row>
    </CardWrap>
  );
};

export default VehicleCard;
