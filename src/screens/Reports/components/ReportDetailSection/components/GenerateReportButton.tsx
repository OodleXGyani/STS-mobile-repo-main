import React from 'react';
import { TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import Icons from '../../../../../common/icons';

interface GenerateReportButtonProps {
  onPress: () => void;
  isGeneratingReport: boolean;
}

const GenerateReportButton: React.FC<GenerateReportButtonProps> = ({
  onPress,
  isGeneratingReport,
}) => (
  <Button onPress={onPress}>
    {isGeneratingReport ? (
      <>
        <ActivityIndicator size="small" color={Colors.white} />
        <ButtonText>Generating ....</ButtonText>
      </>
    ) : (
      <>
        <ButtonIcon source={Icons.report_white} />
        <ButtonText>Generate Report</ButtonText>
      </>
    )}
  </Button>
);

const Button = styled.TouchableOpacity`
  background-color: ${Colors.primary_blue_color};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${verticalScale(5)}px;
  margin: ${scale(5)}px;
  border-radius: ${scale(8)}px;
`;

const ButtonIcon = styled.Image`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
  tint-color: #ffffff;
`;

const ButtonText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #ffffff;
  margin-left: ${scale(8)}px;
`;

export default GenerateReportButton;
