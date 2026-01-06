import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Container
export const Container = styled.View<{ insets: any }>`
  flex: 1;
  background-color: #ffffff;
  padding-top: ${moderateScale(16)}px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-offset: 0px ${moderateScale(4)}px;
  shadow-radius: ${moderateScale(8)}px;
  elevation: 8;
`;

// Header
export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${verticalScale(14)}px ${scale(10)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

export const HeaderTitle = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #333333;
  text-align: center;
`;

export const CloseButton = styled.TouchableOpacity`
  width: ${scale(32)}px;
  height: ${scale(32)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${scale(16)}px;
  background-color: #003459;
`;

export const CloseButtonText = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: #ffffff;
  font-weight: bold;
`;

// Search Bar
export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin: ${verticalScale(16)}px ${scale(20)}px;
  padding: ${verticalScale(12)}px ${scale(16)}px;
  background-color: #f5f5f5;
  border-radius: ${scale(8)}px;
`;

export const SearchIcon = styled.Text`
  font-size: ${moderateScale(16)}px;
  margin-right: ${scale(8)}px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: ${moderateScale(16)}px;
  color: #333333;
`;

export const ClearButton = styled.TouchableOpacity`
  padding: ${scale(4)}px;
`;

export const ClearButtonText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #9e9e9e;
`;

// Filter Section
export const FilterContainer = styled.View`
  padding: ${verticalScale(16)}px ${scale(20)}px;
`;

export const FilterTitle = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: #666666;
  margin-bottom: ${verticalScale(8)}px;
`;

export const TypeFilters = styled.ScrollView`
  margin-bottom: ${verticalScale(16)}px;
`;

export const StatusFilters = styled.ScrollView`
  margin-bottom: ${verticalScale(16)}px;
`;

export const FilterChip = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(8)}px ${scale(12)}px;
  margin-right: ${scale(8)}px;
  border-radius: ${scale(16)}px;
  background-color: ${props => (props.isSelected ? '#2196F3' : '#F5F5F5')};
`;

export const FilterChipIcon = styled.Text`
  font-size: ${moderateScale(14)}px;
  margin-right: ${scale(4)}px;
`;

export const FilterChipText = styled.Text<{ isSelected: boolean }>`
  font-size: ${moderateScale(12)}px;
  color: ${props => (props.isSelected ? '#FFFFFF' : '#666666')};
  font-weight: ${props => (props.isSelected ? '600' : '400')};
`;

export const StatusIndicator = styled.View<{ color: string }>`
  width: ${scale(8)}px;
  height: ${scale(8)}px;
  border-radius: ${scale(4)}px;
  background-color: ${props => props.color};
  /* margin-right: ${scale(4)}px; */
`;

// Selection Info
export const SelectionInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${verticalScale(16)}px ${scale(20)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

export const SelectionText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #666666;
`;

export const SelectAllButton = styled.TouchableOpacity`
  padding: ${verticalScale(8)}px ${scale(16)}px;
  background-color: transparent;
  border-radius: ${scale(16)}px;
`;

export const SelectAllButtonText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #003459;
  font-weight: 600;
`;

// Vehicle List
export const VehicleList = styled.FlatList`
  flex: 1;
`;

// Vehicle Item
export const ItemContainer = styled.TouchableOpacity<{
  isSelected: boolean;
  disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(16)}px ${scale(20)}px;
  background-color: ${props => (props.isSelected ? '#E3F2FD' : '#FFFFFF')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

export const CheckboxContainer = styled.View`
  margin-right: ${scale(16)}px;
  width: ${scale(20)}px;
`;

export const Checkbox = styled.View<{ isSelected: boolean; disabled: boolean }>`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
  border-width: 2px;
  border-color: ${props => (props.isSelected ? '#2196F3' : '#CCCCCC')};
  background-color: ${props => (props.isSelected ? '#2196F3' : '#FFFFFF')};
  border-radius: ${scale(4)}px;
  justify-content: center;
  align-items: center;
`;

export const Checkmark = styled.Text`
  color: #ffffff;
  font-size: ${moderateScale(12)}px;
  font-weight: bold;
`;

export const VehicleInfo = styled.View`
  flex: 1;
  margin-left: ${scale(16)}px;
`;

export const VehicleHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(4)}px;
`;

export const VehicleName = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #333333;
  flex: 1;
`;

export const PlateNumber = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #666666;
  margin-bottom: ${verticalScale(4)}px;
`;

export const DriverInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DriverName = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #666666;
  margin-right: ${scale(8)}px;
`;

export const LocationText = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #999999;
`;

export const StatusSection = styled.View`
  align-items: center;
  width: ${scale(60)}px;
  margin-left: ${scale(5)}px;
`;

export const StatusText = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #666666;
  margin-bottom: ${verticalScale(2)}px;
`;

export const LastUpdate = styled.Text`
  font-size: ${moderateScale(10)}px;
  color: #999999;
`;

// Action Buttons
export const ActionContainer = styled.View`
  flex-direction: row;
  padding: ${verticalScale(16)}px ${scale(20)}px;
  background-color: #003459;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: ${verticalScale(16)}px;
  margin-right: ${scale(12)}px;
  border-width: 1px;
  border-color: #ffffff;
  border-radius: ${scale(8)}px;
  align-items: center;
  background-color: transparent;
`;

export const CancelButtonText = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: #ffffff;
  font-weight: 500;
`;

export const ConfirmButton = styled.TouchableOpacity<{ disabled: boolean }>`
  flex: 1;
  padding: ${verticalScale(16)}px;
  background-color: ${props => (props.disabled ? '#CCCCCC' : '#FFFFFF')};
  border-radius: ${scale(8)}px;
  align-items: center;
`;

export const ConfirmButtonText = styled.Text<{ disabled: boolean }>`
  font-size: ${moderateScale(16)}px;
  color: ${props => (props.disabled ? '#999999' : '#003459')};
  font-weight: 600;
`;
