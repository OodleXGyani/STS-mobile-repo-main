import styled from "styled-components/native";
import { moderateScale, scale } from 'react-native-size-matters';

/**
 * Daily Summary Report Styled Components
 * 
 * Similar to TripReport styles but adapted for daily summary data
 */

export const VehiclePlateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const VehiclePlateText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const DailySummaryCards = styled.View`
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

// Daily summary specific styles
export const DateContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: ${moderateScale(8)}px;
`;

export const DateText = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: #666;
`;

export const SummaryStatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${moderateScale(8)}px;
`;

export const StatItem = styled.View`
  align-items: center;
  flex: 1;
`;

export const StatLabel = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #666;
  margin-bottom: ${moderateScale(2)}px;
`;

export const StatValue = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: bold;
  color: #333;
`;

// Timeline styles for daily summary
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

// Daily summary action buttons
export const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  background-color: #007AFF;
  padding: ${moderateScale(5)}px;
  align-items: center;
  gap: ${moderateScale(5)}px;
  align-self: flex-start;
  border-radius: ${moderateScale(5)}px;
`;

export const ActionButtonText = styled.Text`
  color: white;
  font-size: ${moderateScale(12)}px;
  font-weight: 500;
`;

// Daily summary header styles
export const DailyHeaderContainer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  background-color: #007AFF;
  justify-content: space-between;
`;

export const DailyHeaderTitle = styled.Text`
  font-size: ${moderateScale(18)}px;
  font-weight: bold;
  color: white;
  text-align: center;
`;

export const DailyHeaderSubtitle = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-top: ${moderateScale(4)}px;
`;

// Fleet average row for daily summary
export const FleetAvgRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${moderateScale(12)}px;
  background-color: #f8f9fa;
  border-bottom-width: 1px;
  border-bottom-color: #e9ecef;
`;

export const FleetRangeMarker = styled.View`
  flex: 1;
  align-items: flex-start;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #666;
  margin-bottom: ${moderateScale(4)}px;
  line-height: ${moderateScale(16)}px;
`;

export const SubLabel = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #333;
  margin-bottom: ${moderateScale(2)}px;
`;

// FirstColumn structure for daily summary cards
export const FirstColumn = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${moderateScale(8)}px;
  margin-bottom: ${moderateScale(8)}px;
  padding: ${moderateScale(5)}px;
  min-height: ${moderateScale(30)}px;
`;

export const TSVContainer = styled.View`
  background-color: #ff6b6b;
  padding: ${moderateScale(4)}px ${moderateScale(8)}px;
  border-radius: ${moderateScale(4)}px;
  margin-left: auto;
`;
