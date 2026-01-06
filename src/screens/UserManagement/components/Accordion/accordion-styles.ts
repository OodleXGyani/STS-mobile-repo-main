import styled from 'styled-components/native';
import { Image } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const Container = styled.View`
  margin-bottom: ${verticalScale(1)}px;
  overflow: hidden;
`;

export const HeaderButton = styled.TouchableOpacity`
  padding: ${moderateScale(15)}px;
  background-color: skyblue;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #000;
`;

export const ArrowIcon = styled.Image`
  width: ${scale(16)}px;
  height: ${verticalScale(16)}px;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${moderateScale(12)}px;
  border-bottom-width: ${scale(1)}px;
  border-bottom-color: #ddd;
  justify-content: space-between;
`;

export const DetailsRow = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Name = styled.Text`
  font-size: ${moderateScale(14)}px;
  flex: 1;
  max-width: ${scale(90)}px;
`;

export const Email = styled.Text`
  font-size: ${moderateScale(14)}px;
  flex: 1;
  text-align: center;
  max-width: ${scale(70)}px;
`;

export const Mobile = styled.Text`
  font-size: ${moderateScale(14)}px;
  flex: 1;
  text-align: right;
  max-width: ${scale(80)}px;
  padding-right: ${scale(20)}px;
`;

export const EditButton = styled.TouchableOpacity``;

export const EditIcon = styled(Image)`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
  margin-left: ${scale(8)}px;
`;
