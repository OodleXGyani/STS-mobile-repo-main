import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { 
  ActionContainer, 
  CancelButton, 
  CancelButtonText, 
  ConfirmButton, 
  ConfirmButtonText 
} from './styles';

interface ActionButtonsProps {
  selectedCount: number;
  maxSelection: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedCount,
  maxSelection,
  onCancel,
  onConfirm,
}) => {
  const canConfirm = selectedCount > 0;

  return (
    <ActionContainer>
      <CancelButton onPress={onCancel}>
        <CancelButtonText>Cancel</CancelButtonText>
      </CancelButton>
      
      <ConfirmButton onPress={onConfirm} disabled={!canConfirm}>
        <ConfirmButtonText disabled={!canConfirm}>
          Filter ({selectedCount}/{maxSelection})
        </ConfirmButtonText>
      </ConfirmButton>
    </ActionContainer>
  );
};