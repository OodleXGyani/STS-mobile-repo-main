import styled from 'styled-components/native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import {Colors} from '../constants/colors';

export const Container = styled(View)`
  flex: 1;
  background-color: rgba(0, 52, 89, 0.4);
`;

export const UserSection = styled(View)`
  flex: 1.5;
  justify-content: center;
  align-items: center;
  padding: ${verticalScale(20)}px;
  border-bottom-width: 0.2px;
  border-bottom-color: #ADD8E6;
`;

export const UserIconHolder = styled(View)`
  width: ${scale(120)}px;
  height: ${scale(120)}px;
  border-radius: ${scale(60)}px;
  border-width: 1px;
  border-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  padding: ${moderateScale(10)}px;
`;

export const UserIcon = styled(Image)`
  width: ${scale(80)}px;
  height: ${scale(80)}px;
`;

export const UserTextHolder = styled(View)`
  padding-horizontal: ${moderateScale(10)}px;
  margin-top: ${verticalScale(10)}px;
  align-items: center;
`;

export const UserName = styled(Text)`
  color: ${Colors.white};
  font-size: ${moderateScale(16)}px;
  font-weight: bold;
`;

export const UserDate = styled(Text)`
  color: ${Colors.white};
  font-size: ${moderateScale(12)}px;
  margin-top: ${verticalScale(4)}px;
`;

export const UserEmail = styled(Text)`
  color: ${Colors.white};
  font-size: ${moderateScale(12)}px;
  margin-top: ${verticalScale(4)}px;
  max-width: ${scale(150)}px;
`;

export const RoutesSection = styled(View)`
  flex: 3;
`;

export const LogoutSection = styled(View)`
  flex: 0.5;
  justify-content: flex-end;
  padding-bottom: ${moderateScale(20)}px;
  border-top-width: 0.2px;
  border-top-color: #ADD8E6; /* Light blue color */
`;

export const LogoutButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${verticalScale(12)}px;
  padding-horizontal: ${moderateScale(20)}px;
`;

export const LogoutIcon = styled(Image)`
  width: ${scale(26)}px;
  height: ${scale(26)}px;
`;

export const LogoutText = styled(Text)`
  color: ${Colors.white};
  font-size: ${moderateScale(16)}px;
  margin-left: ${moderateScale(20)}px;
`;

export const OptionSeparator = styled(View)`
  height: ${verticalScale(2)}px;
  background-color: ${Colors.main_nav_border_color};
  margin-vertical: ${verticalScale(10)}px;
  width: 100%;
`;
