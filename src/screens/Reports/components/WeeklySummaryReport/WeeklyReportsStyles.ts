import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../constants/colors';

export const Container = styled.View`
  flex: 1;
  background-color: ${Colors.background};

border:2px solid red;
  /* padding-top: ${verticalScale(22)}px; */
  /* padding-horizontal: ${scale(12)}px; */
`;

export const Title = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: ${Colors.white};
  font-weight: bold;
  margin-bottom: ${verticalScale(10)}px;
  text-align: center;
  
`;

export const FleetAvgRow = styled.View`
  background-color: ${Colors.tertiary_blue_color_light};
  
  padding: ${scale(8)}px;
  margin-bottom: ${verticalScale(10)}px;

  justify-content: space-around;
`;

export const FleetRangeMarker = styled.View`
   margin-bottom: ${verticalScale(10)}px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${scale(8)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(15)}px;
  color: ${Colors.fontDefault};
  font-weight: normal;
  margin-top: ${verticalScale(8)}px;
`;

export const SubLabel = styled.Text`

  font-size: ${moderateScale(13)}px;
  color: ${Colors.labelText};
  font-weight: 600;

`;

export const SummaryBox = styled.View`
  background-color: ${Colors.cardBackground};
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.list_item_separator_color};
  /* padding: ${scale(10)}px; */
  /* margin-bottom: ${verticalScale(12)}px; */
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(7)}px;
`;

export const MarkerBar = styled.View<{ color: string; filled: number }>`
  background-color: ${({ color }) => color};
  height: ${verticalScale(10)}px;
  width: ${({ filled }) => scale(filled)}px;
  position: relative;
  margin-bottom: ${verticalScale(4)}px;
  border-radius: ${scale(5)}px;
`;

export const Marker = styled.View<{ left: number }>`
  position: absolute;
  left: ${({ left }) => `${left}px`};
  top: -4px;
  width: ${scale(3)}px;
  height: ${verticalScale(11)}px;
  background-color: ${Colors.barTicker};
  border-radius: ${scale(1.5)}px;
`;

export const ToggleButton = styled.TouchableOpacity`
  background-color: ${Colors.tertiary_blue_color_light};
  align-self: flex-end;
  border-radius: ${scale(6)}px;
  padding-horizontal: ${scale(14)}px;
  padding-vertical: ${verticalScale(4)}px;
  margin-top: ${verticalScale(4)}px;
  margin-bottom: ${verticalScale(8)}px;
`;

export const ToggleButtonText = styled.Text`
  color: ${Colors.buttonText};
  font-size: ${moderateScale(13)}px;
  font-weight: 600;
`;
