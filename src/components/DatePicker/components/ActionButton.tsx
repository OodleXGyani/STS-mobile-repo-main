import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface ActionButtonsProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText: string;
  cancelText: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  theme
}) => {
  return (
    <ActionContainer>
      <CancelButton onPress={onCancel}>
        <CancelButtonText theme={theme}>{cancelText}</CancelButtonText>
      </CancelButton>
      
      <ConfirmButton onPress={onConfirm} theme={theme}>
        <ConfirmButtonText>{confirmText}</ConfirmButtonText>
      </ConfirmButton>
    </ActionContainer>
  );
};

const ActionContainer = styled.View`
  flex-direction: row;
  padding: ${scale(16)}px;
  border-top-width: 1px;
  border-top-color: #E5E5EA;
  gap: ${scale(12)}px;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: ${verticalScale(14)}px;
  align-items: center;
  border-radius: ${scale(8)}px;
  border-width: 1px;
  border-color: #E5E5EA;
`;

const CancelButtonText = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(16)}px;
  font-weight: 500;
  color: ${props => props.theme.textColor};
`;

const ConfirmButton = styled.TouchableOpacity<{ theme: any }>`
  flex: 1;
  padding: ${verticalScale(14)}px;
  align-items: center;
  border-radius: ${scale(8)}px;
  background-color: ${props => props.theme.primaryColor};
`;

const ConfirmButtonText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #FFFFFF;
`;
