import React from 'react';
import { ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';

interface FilterButtonProps {
  type: 'apply' | 'reset' | 'close';
  onPress: () => void;
  title?: string;
  loading?: boolean;
}

const CloseButton = styled.TouchableOpacity`
  background-color: ${Colors.primary_blue_color};
  width: ${scale(42)}px;
  height: ${scale(42)}px;
  border-radius: ${scale(21)}px;
  align-items: center;
  justify-content: center;
  margin-top: ${verticalScale(-24.7)}px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const CloseIcon = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'apply' | 'reset' }>`
  padding-vertical: ${verticalScale(8)}px;
  padding-horizontal: ${moderateScale(16)}px;
  border-radius: ${moderateScale(8)}px;
  background-color: ${props =>
    props.variant === 'apply' ? `${Colors.primary_blue_color}` : 'transparent'};
  min-width: ${scale(100)}px;
  align-items: center;
  justify-content: center;
`;

const ActionButtonText = styled.Text<{ variant: 'apply' | 'reset' }>`
  font-size: ${moderateScale(16)}px;
  font-weight: 400;
  color: ${props => (props.variant === 'apply' ? '#FFFFFF' : '#000000')};
`;

export const FilterButton: React.FC<FilterButtonProps> = ({
  type,
  onPress,
  title,
  loading,
}) => {
  const handlePress = () => {
    console.log(`🔘 FilterButton pressed: ${type}`, { title, loading });
    onPress();
  };

  if (type === 'close') {
    return (
      <CloseButton onPress={handlePress}>
        <CloseIcon>×</CloseIcon>
      </CloseButton>
    );
  }

  return (
    <ActionButton variant={type} onPress={handlePress}>
      {loading ? (
        <ActivityIndicator color={type === 'apply' ? '#FFFFFF' : '#007AFF'} />
      ) : (
        <ActionButtonText variant={type}>{title}</ActionButtonText>
      )}
    </ActionButton>
  );
};
