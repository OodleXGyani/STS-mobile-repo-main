import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import Icons from '../../../../../common/icons';

interface ReportHeaderProps {
  title: string;
  onBackPress: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ title, onBackPress }) => (
  <Header>
    <BackButton onPress={onBackPress}>
      <BackIcon source={Icons.backArrow} />
    </BackButton>
    <HeaderTitle>{title}</HeaderTitle>
    <StatusBar />
  </Header>
);

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(10)}px ${scale(16)}px;
  background-color: ${Colors.primary_blue_color};
  justify-content: space-between;
`;

const BackButton = styled.TouchableOpacity`
  padding: ${scale(8)}px;
  width: ${scale(40)}px;
  align-items: center;
`;

const BackIcon = styled.Image`
  width: ${scale(24)}px;
  height: ${scale(24)}px;
  tint-color: #ffffff;
`;

const HeaderTitle = styled.Text`
  flex: 1;
  font-size: ${moderateScale(18)}px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin-horizontal: ${scale(8)}px;
`;

const StatusBar = styled.View`
  width: ${scale(40)}px;
  height: ${scale(20)}px;
  background-color: transparent;
`;

export default ReportHeader;
