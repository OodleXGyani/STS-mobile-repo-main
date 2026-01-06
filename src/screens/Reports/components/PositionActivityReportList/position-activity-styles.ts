import styled from "styled-components/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Colors } from "../../../../constants/colors";

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${verticalScale(6)}px ${scale(10)}px;
  background-color: #003459;
`;

export const BackIcon = styled.Image`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${moderateScale(14)}px;
  text-align: center;
  color: #fff;
`;

export const DetailsContainer = styled.View`
  flex: 1;
  /* padding: ${scale(10)}px; */
  background-color: #fff;
`;

export const FlatRow = styled.View`
  background-color: white;
  color: ${Colors.default_font_color};
`;

export const ItemContainer = styled.View`
  flex-direction: row;
  background-color: #fff;
  padding: ${scale(10)}px;
  border-radius: ${scale(8)}px;
`;

export const LeftContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

export const RightContainer = styled.View`
  flex: 2;
  justify-content: space-between;
  padding-left: ${scale(8)}px;
`;

export const ItemHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${verticalScale(4)}px;
`;

export const ItemId = styled.Text`
  font-size: ${moderateScale(14)}px;
`;

export const ItemTime = styled.Text`
  font-size: ${moderateScale(14)}px;
`;

export const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${scale(6)}px;
`;

export const LocationIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${scale(16)}px;
  height: ${scale(16)}px;
  margin-right: ${scale(7)}px;
`;


export const LocationText = styled.Text`
  font-size: ${moderateScale(14)}px;
`;

export const ItemFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const MapButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  color: ${Colors.default_font_color};
  background-color: ${Colors.list_item_separator_color};
  padding: ${scale(5)}px ${scale(50)}px;
  border-radius: ${scale(4)}px;
`;

export const MapButtonText = styled.Text`
  margin-left: ${scale(4)}px;
`

export const MapIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${scale(14)}px;
  height: ${scale(14)}px;
`;

export const CarIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${scale(50)}px;
  height: ${scale(50)}px;
`;


export const SpeedText = styled.Text`
  font-size: ${moderateScale(13)}px;
  color: lightgreen;
  margin-top: ${verticalScale(-4)}px;
`;
