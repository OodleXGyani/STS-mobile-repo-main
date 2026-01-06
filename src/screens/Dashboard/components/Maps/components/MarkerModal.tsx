import React from 'react';
import { Alert, Modal, Share, TouchableWithoutFeedback } from 'react-native';
import { moderateScale, scale } from 'react-native-size-matters';
import styled from 'styled-components/native';
import { useRef, useEffect } from 'react';
import { showSafeAlert } from '../../../../../utils/AlertUtils';
import { Colors } from '../../../../../constants/colors';
import { getTimeAgo } from '../../../../../utils';
import { Vehicle } from '../../VehicleSelectFilter/types';
import {
  formatTime,
} from '../../../../../components/DatePicker/utils';

interface MarkerModalProps {
  visible: boolean;
  onClose: () => void;
  vehicleData?: Vehicle; // New prop for dynamic vehicle data
  // Legacy props for backward compatibility
  speed?: string;
  rating?: number; // 0-5 star rating
  vehicleName?: string;
  vehicleNumber?: string;
  timeAgo?: string;
  location?: string;
  circleValue?: string | number;
  vehicleIcon?: any;
  driverIcon?: any;
  starGreyIcon?: any;
  starYellowIcon?: any;
  clockIcon?: any;
  locationIcon?: any;
  shareIcon?: any;
  infoIcon?: any;
  onButtonPress?: () => void;
}

const car = require('../../../../../assets/icons/vehicles/car/car_blue.png');
const driver = require('../../../../../assets/icons/driver_grey.png');
const starGrey = require('../../../../../assets/icons/star_full_grey.png');
const starYellow = require('../../../../../assets/icons/star_full_yellow.png');
const clock = require('../../../../../assets/icons/clock_grey.png');
const location = require('../../../../../assets/icons/location_grey.png');
const share = require('../../../../../assets/icons/share_white.png');
const message = require('../../../../../assets/icons/message_white.png');
const phone = require('../../../../../assets/icons/call_white.png');
const info = require('../../../../../assets/icons/info_white.png');

const MarkerModal: React.FC<MarkerModalProps> = ({
  visible,
  onClose,
  vehicleData,
  // Legacy props for backward compatibility
  speed = '0 km/h',
  rating = 0,
  vehicleName = 'Toyota bmw',
  vehicleNumber = '123359899',
  timeAgo = '10 hours ago',
  location: locationText = 'Hidd Towm 1800 1588',
  circleValue = '30',
  vehicleIcon = car,
  driverIcon = driver,
  starGreyIcon = starGrey,
  starYellowIcon = starYellow,
  clockIcon = clock,
  locationIcon = location,
  shareIcon = share,
  infoIcon = info,
  onButtonPress,
}) => {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  // Use dynamic data if available, otherwise fall back to legacy props
  const displaySpeed = vehicleData?.speed || speed;
  const displayRating = vehicleData?.driver_name ? 0 : 0; // Rating = 1 if driver exists, else 0
  const displayVehicleName = vehicleData?.name || vehicleName;
  const displayVehicleNumber = vehicleData?.vehicle_Number || vehicleNumber;
  const displayTimeAgo = vehicleData?.status_time
    ? getTimeAgo(vehicleData.status_time)
    : timeAgo;
  const displayLocation = vehicleData?.location_full || locationText;
  const displayCircleValue =
    vehicleData?.speed_limit?.replace('Km/h', '') || circleValue;
  const renderStars = () => {
    return Array(5)
      .fill(null)
      .map((_, i) => (
        <StarImage
          key={i}
          source={i < displayRating ? starYellowIcon : starGreyIcon}
        />
      ));
  };

  const handleShare = async () => {
    try {
      if (!vehicleData?.coordinates) {
        showSafeAlert(mountedRef, 'No location available to share', '');
        return;
      }

      const msg = `
        Vehicle: ${vehicleData.name}
        Driver: ${vehicleData.driver_name}
        Speed: ${vehicleData.speed}
        Time: ${formatTime(new Date(vehicleData.status_time))}
        Location: ${vehicleData.location_full}
        View On Map: https://www.google.com/maps/search/?api=1&query=${
          vehicleData.coordinates[0]
        },${vehicleData.coordinates[1]}
      `;

      await Share.share({
        message: msg,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <Backdrop>
          <TouchableWithoutFeedback onPress={() => {}}>
            <ModalContainer>
              {/* Top */}
              <TopContainer>
                <TopLeftContainer>
                  <VehicleImage source={vehicleIcon} />
                  <SpeedText>{displaySpeed}</SpeedText>
                </TopLeftContainer>
                <TopRightContainer>
                  <UserRatingContainer>
                    <UserIcon source={driverIcon} />
                    <StarsContainer>{renderStars()}</StarsContainer>
                  </UserRatingContainer>
                  <VehicleInfoContainer>
                    <VehicleNameText ellipsizeMode="tail" numberOfLines={1}>
                      {displayVehicleName}
                    </VehicleNameText>
                    <VehicleNumberText ellipsizeMode="tail" numberOfLines={1}>
                      {displayVehicleNumber}
                    </VehicleNumberText>
                    <TimeContainer>
                      <ClockIcon source={clockIcon} />
                      <TimeText>{displayTimeAgo}</TimeText>
                    </TimeContainer>
                  </VehicleInfoContainer>
                </TopRightContainer>
              </TopContainer>

              {/* Middle */}
              <MiddleContainer>
                <LocationContainer>
                  <LocationIcon source={locationIcon} />
                  <LocationText>{displayLocation}</LocationText>
                </LocationContainer>
                <CircleContainer>
                  <CircleValue>{displayCircleValue}</CircleValue>
                </CircleContainer>
              </MiddleContainer>

              {/* Bottom */}
              <BottomContainer>
                <BottomItem onPress={handleShare}>
                  <BottomIcon source={shareIcon} />
                </BottomItem>
                <BottomItem onPress={onButtonPress}>
                  <BottomIcon source={message} />
                </BottomItem>
                <BottomItem onPress={onButtonPress}>
                  <BottomIcon source={phone} />
                </BottomItem>
                <BottomItem onPress={onButtonPress}>
                  <BottomIcon source={infoIcon} />
                </BottomItem>
              </BottomContainer>
            </ModalContainer>
          </TouchableWithoutFeedback>
        </Backdrop>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default MarkerModal;

const Backdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 90%;
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
`;

const TopContainer = styled.View`
  flex-direction: row;
  padding: ${scale(10)}px;
  border-bottom-width: 0.5px;
  border-bottom-color: grey;
`;

const TopLeftContainer = styled.View`
  width: 20%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-right: ${scale(10)}px;
  border-right-width: 1px;
  border-right-color: black;
`;

const TopRightContainer = styled.View`
  width: 80%;
  padding: ${scale(0)}px ${scale(10)}px;
`;

const VehicleImage = styled.Image`
  resizemode: contain;
  height: ${moderateScale(22)}px;
  width: ${moderateScale(60)}px;
`;

const SpeedText = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #333;
`;

const UserRatingContainer = styled.View`
  margin-top: ${scale(5)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const UserIcon = styled.Image`
  tintcolor: #000;
  height: 26px;
  width: 26px;
`;

const StarsContainer = styled.View`
  flex-direction: row;
  gap: 2px;
`;

const StarImage = styled.Image`
  height: 12px;
  width: 12px;
`;

const VehicleInfoContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${scale(10)}px;
`;

const VehicleNameText = styled.Text`
  max-width: 50px;
  font-size: 16px;
`;

const VehicleNumberText = styled.Text`
  max-width: 70px;
  font-size: 16px;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const ClockIcon = styled.Image`
  height: 14px;
  width: 14px;
`;

const TimeText = styled.Text`
  font-size: 14px;
  color: #666;
`;

const MiddleContainer = styled.View`
  padding: ${scale(10)}px ${scale(20)}px;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const LocationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  flex: 1;
`;

const LocationIcon = styled.Image`
  height: ${moderateScale(27)}px;
  width: ${moderateScale(20)}px;
  resizemode: contain;
`;

const LocationText = styled.Text`
  flex-shrink: 1;
  font-size: ${moderateScale(14)}px;
  color: #333;
`;

const CircleContainer = styled.View`
  width: ${scale(28)}px;
  height: ${scale(28)}px;
  border-radius: ${scale(30)}px;
  border: 3px solid red;
  align-items: center;
  justify-content: center;
  margin-left: ${scale(8)}px;
`;

const CircleValue = styled.Text`
  font-weight: bold;
  font-size: ${moderateScale(12)}px;
  color: #333;
`;

const BottomContainer = styled.View`
  flex-direction: row;
  width: 100%;
  gap: 1px;
`;

const BottomItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${scale(12)}px;
  background-color: ${Colors.primary_blue_color};
`;

const BottomIcon = styled.Image`
  height: 28px;
  width: 28px;
  resize-mode: contain;
`;
