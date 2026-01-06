// TestMap.styles.ts
import styled from 'styled-components/native';
import { scale, verticalScale } from 'react-native-size-matters';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const MapWrapper = styled.View`
  flex: 1;
`;

export const VehicleMarkerContainer = styled.View<{ online: boolean }>`
  background-color: ${({ online }) => (online ? 'green' : 'red')};
  border-radius: ${scale(12)}px;
  padding: ${scale(6)}px;
  border-width: 2px;
  border-color: #fff;
`;

export const VehicleNameText = styled.Text`
  color: white;
  font-weight: bold;
`;

export const VehicleInfoPopup = styled.View`
  position: absolute;
  bottom: ${verticalScale(40)}px;
  left: ${scale(20)}px;
  right: ${scale(20)}px;
  background-color: white;
  padding: ${scale(15)}px;
  border-radius: ${scale(8)}px;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-offset: 0px 2px;
  shadow-radius: 4px;
  elevation: 5;
`;

export const PopupTitle = styled.Text`
  font-weight: bold;
  font-size: ${scale(16)}px;
  margin-bottom: ${verticalScale(8)}px;
`;

export const CloseText = styled.Text`
  margin-top: ${verticalScale(10)}px;
  color: blue;
  text-decoration-line: underline;
  font-size: ${scale(14)}px;
`;

// Updated TriangleArrow component for better cross-platform compatibility
export const TriangleArrow = styled.View<{ color: string }>`
  width: 24px;
  height: 24px;
  background-color: ${props => props.color};
  border-radius: 2px;
  transform: rotate(45deg);
`;

// Alternative: Custom vehicle triangle with curved edges
export const VehicleTriangle = styled.View<{ color: string }>`
  width: 20px;
  height: 24px;
  background-color: ${props => props.color};
  border-top-left-radius: 20px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`;