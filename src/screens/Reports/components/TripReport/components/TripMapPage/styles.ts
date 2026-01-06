import styled from 'styled-components/native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../../../../constants/colors';

/**
 * TripMapPage Styled Components
 * 
 * This file contains all styled components for the TripMapPage,
 * separated from the main component for better maintainability.
 */

// Main page container
export const PageContainer = styled.View`
  flex: 1;
  background-color: ${Colors.primary_background_color};
`;

// Header styling
export const HeaderContainer = styled.View`
  background-color: ${Colors.primary_blue_color};
  padding-top: ${verticalScale(10)}px;
  padding-bottom: ${verticalScale(10)}px;
  padding-left: ${moderateScale(16)}px;
  padding-right: ${moderateScale(16)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const BackButton = styled.TouchableOpacity`
  /* padding: ${moderateScale(8)}px; */
  /* border-radius: ${moderateScale(20)}px; */
  /* background-color: rgba(255, 255, 255, 0.1); */
`;

export const HeaderTitle = styled.Text`
  font-size: ${moderateScale(18)}px;
  font-weight: bold;
  color: white;
  text-align: center;
  flex: 1;
`;

export const HeaderSpacer = styled.View`
  width: ${moderateScale(40)}px;
`;

// Map container styling
export const MapContainer = styled.View`
  flex: 1;
  position: relative;
`;

// Trip information overlay styling
export const TripInfoOverlay = styled.View`
  position: absolute;
  top: ${moderateScale(16)}px;
  left: ${moderateScale(16)}px;
  right: ${moderateScale(16)}px;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: ${moderateScale(12)}px;
  padding: ${moderateScale(12)}px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

export const TripInfoHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${moderateScale(8)}px;
`;

export const VehicleIcon = styled.View`
  margin-right: ${moderateScale(8)}px;
`;

export const TripInfoText = styled.View`
  flex: 1;
`;

export const VehiclePlate = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: bold;
  color: ${Colors.primary_blue_color};
`;

export const DriverName = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: ${Colors.tertiary_font_color};
  margin-top: ${moderateScale(2)}px;
`;

export const TripDetails = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${moderateScale(8)}px;
`;

export const TripDetailItem = styled.View`
  flex: 1;
  align-items: center;
`;

export const TripDetailLabel = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: ${Colors.tertiary_font_color};
  margin-bottom: ${moderateScale(2)}px;
`;

export const TripDetailValue = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: ${Colors.primary_blue_color};
`;

// Layer selector button styling
export const LayerButton = styled.TouchableOpacity`
  position: absolute;
  top: ${moderateScale(16)}px;
  right: ${moderateScale(16)}px;
  z-index: 1000;
  padding: ${moderateScale(12)}px;
  border-radius: ${moderateScale(24)}px;
`;

// Marker styling constants
export const MARKER_STYLES = {
  start: {
    width: 28,
    height: 28,
  },
  end: {
    width: 28,
    height: 28,
  },
  waypoint: {
    width: 24,
    height: 24,
  },
} as const;

// Map view styling
export const MAP_VIEW_STYLE = {
  flex: 1,
} as const;

// Safe area styling
export const SAFE_AREA_STYLE = {
  flex: 1,
  backgroundColor: Colors.primary_background_color,
} as const;
