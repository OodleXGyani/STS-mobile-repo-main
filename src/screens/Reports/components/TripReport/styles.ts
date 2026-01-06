import styled from "styled-components/native";
import { moderateScale, scale } from 'react-native-size-matters';

export const VehiclePlateContainer= styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const VehiclePlateText= styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const TripReportCards= styled.View`
  border-bottom: 2px solid grey;

  padding: ${moderateScale(10)}px;
  background-color: white;
  border-radius: ${moderateScale(8)}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

// LocationMarker styles
export const ListContainer = styled.View`
  padding: ${moderateScale(5)}px;
`;

export const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  position: relative;
  min-height: ${scale(40)}px;
  padding: ${moderateScale(12)}px;
`;

export const IconWrapper = styled.View`
  width: ${scale(12)}px;
  align-items: center;
  justify-content: center;
`;

export const TimeText = styled.Text`
  font-size: ${scale(14)}px;
  margin-left: ${scale(8)}px;
  margin-right: ${scale(10)}px;
  color: #222;
`;

export const AddressText = styled.Text`
  font-size: ${scale(14)}px;
  color: #222;
`;

export const DashedLine = styled.View`
  position: absolute;
  left: ${scale(11)}px;
  top: ${scale(24)}px;
  width: 2px;
  height: ${scale(16)}px;
  background-color: #bdbdbd;
  z-index: -1;
`;

export const DashedLineContainer = styled.View`
  position: absolute;
  left: ${scale(5)}px;
  top: ${scale(20)}px;
  width: 2px;
  height: ${scale(16)}px;
  z-index: -1;
`;

export const DashSegment = styled.View`
  width: 2px;
  height: 3px;
  background-color: #bdbdbd;
  margin-bottom: 2px;
`;