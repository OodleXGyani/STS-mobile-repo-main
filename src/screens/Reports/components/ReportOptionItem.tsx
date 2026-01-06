import React from 'react';
import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Button = styled(TouchableOpacity)`
  background-color: #e3edf7;
  border-radius: ${moderateScale(12)}px;
  padding-vertical: ${verticalScale(8)}px;
  padding-horizontal: ${scale(16)}px;
  margin-bottom: ${verticalScale(12)}px;
  align-items: center;
  flex-direction: row;
`;

const IconContainer = styled.View`
  margin-right: ${scale(12)}px;
  height: ${moderateScale(32)}px;
  width: ${moderateScale(32)}px;
  justify-content: center;
  align-items: center;
`;

const ReportIcon = styled.Image`
  width: ${moderateScale(20)}px;
  height: ${moderateScale(20)}px;
  resize-mode: contain;
`;

const Label = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: #094067;
  font-weight: 500;
  flex: 1;
`;

interface ReportOptionItemProps {
  icon: ImageSourcePropType;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

const ReportOptionItem: React.FC<ReportOptionItemProps> = ({
  icon,
  label,
  onPress,
  disabled = false
}) => {
  return (
    <Button
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <IconContainer>
        <ReportIcon source={icon} />
      </IconContainer>
      <Label>{label}</Label>
    </Button>
  );
};

export default ReportOptionItem;
