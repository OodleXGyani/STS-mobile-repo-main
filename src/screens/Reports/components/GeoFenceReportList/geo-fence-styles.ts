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
  background-color: #fff;
`;

export const FlatRow = styled.View`
  background-color: white;
  color: ${Colors.default_font_color};
`;

export const ItemId = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: bold;
`;

export const ItemTime = styled.Text`
  font-size: ${moderateScale(13)}px;
  color: #666;
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

export const DurationText = styled.Text`
  font-size: ${moderateScale(13)}px;
  color: #444;
`;

export const StatusText = styled.Text`
  font-size: ${moderateScale(13)}px;
  color: #999;
`;

export const MapButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.list_item_separator_color};
  padding: ${scale(5)}px ${scale(30)}px;
  border-radius: ${scale(4)}px;
`;

export const MapButtonText = styled.Text`
  margin-left: ${scale(6)}px;
  font-size: ${moderateScale(13)}px;
  color: ${Colors.default_font_color};
`;

export const MapIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${scale(14)}px;
  height: ${scale(14)}px;
`;

export const CarIcon = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: ${scale(40)}px;
  height: ${scale(40)}px;
`;

export const ItemCard = styled.View`
  background-color: #fff;
  margin: ${scale(1)}px ${scale(0)}px;
  padding: ${scale(12)}px;
  border-radius: ${scale(10)}px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(6)}px;
`;

export const HeaderTextContainer = styled.View`
  margin-left: ${scale(10)}px;
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${scale(10)}px;
`;