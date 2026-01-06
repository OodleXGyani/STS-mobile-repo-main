import React from 'react';
import { View, Text } from 'react-native';
import {
  VehicleInfoPopup as StyledVehicleInfoPopup,
  PopupTitle,
  VehicleNameText,
  CloseText,
} from '../Map.styles';

interface VehicleInfoPopupProps {
  vehicle: {
    name: string;
    key: string;
    has_signal: boolean;
  };
  onClose: () => void;
}

export const VehicleInfoPopup: React.FC<VehicleInfoPopupProps> = ({
  vehicle,
  onClose,
}) => {

  return (
    <StyledVehicleInfoPopup>
      <PopupTitle>Vehicle Info</PopupTitle>
      <VehicleNameText>Name: {vehicle.name}</VehicleNameText>
      <VehicleNameText>Key: {vehicle.key}</VehicleNameText>
      <VehicleNameText>
        Status: {vehicle.has_signal ? 'Online' : 'Offline'}
      </VehicleNameText>
      <CloseText onPress={onClose}>Close</CloseText>
    </StyledVehicleInfoPopup>
  );
};
