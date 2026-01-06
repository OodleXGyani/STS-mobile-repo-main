import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../../constants/colors';
import { Constants } from '../../../../constants/constants';


export const Screen = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`;

export const Content = styled.View`
  flex: 1;
`;

export const GroupHeader = styled.TouchableOpacity`
  background-color: ${Colors.tertiary_blue_color_light};
  height: ${moderateScale(Constants.group_height)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${scale(10)}px;
  margin-bottom: ${verticalScale(6)}px;
`;

export const GroupTitle = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})`
  flex: 4;
  color: ${Colors.default_font_color};
  font-size: ${moderateScale(14)}px;
`;

export const CountsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: ${0.8 * 4};
  align-items: center;
`;

export const CountWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
`;

export const CountText = styled.Text`
  color: ${Colors.tertiary_font_color};
  font-size: ${moderateScale(14)}px;
  line-height: ${moderateScale(Constants.group_height)}px;
`;

export const CountBar = styled.View<{ color: string }>`
  position: absolute;
  bottom: 0;
  left: 15%;
  width: 100%;
  height: ${verticalScale(4)}px;
  background-color: ${({ color }) => color};
`;

export const Caret = styled.Image`
  width: ${scale(18)}px;
  height: ${scale(18)}px;
`;

export const VehicleItem = styled.TouchableOpacity`
  flex-direction: row;
  height: ${moderateScale(Constants.vehicle_item_height)}px;
  padding: ${scale(8)}px ${scale(10)}px;
  border-bottom-width: 1px;
  border-color: ${Colors.list_item_separator_color};
  background-color: ${Colors.white};
`;

export const ColLeft = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ColRight = styled.View`
  flex: 4;
`;

export const Row = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const VehicleName = styled.Text.attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})`
  color: ${Colors.default_font_color};
  font-size: ${moderateScale(14)}px;
  flex-shrink: 1;
`;

export const StatusText = styled.Text`
  margin-top: ${verticalScale(6)}px;
  color: #9ca3af;
  font-size: ${moderateScale(14)}px;
`;

export const SmallRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const SmallIcon = styled.Image`
  width: ${scale(14)}px;
  height: ${scale(14)}px;
`;

export const FilterBar = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${verticalScale(40)}px;
  background-color: #0b2942;
  flex-direction: row;
  align-items: center;
  padding: 0 ${scale(10)}px;
`;

export const FilterRight = styled.View`
  flex: 1;
  height: 100%;
  align-items: flex-end;
  justify-content: center;
`;

export const FilterCounts = styled.View`
  width: 80%;
  align-self: flex-end;
  flex-direction: row;
  justify-content: space-between;
`;

export const FilterText = styled.Text`
  color: #ffffff;
  font-size: ${moderateScale(14)}px;
  margin-left: ${scale(10)}px;
`;

export const FilterIcon = styled.Image`
  width: ${scale(18)}px;
  height: ${scale(18)}px;
`;

export const FilterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

export const FilterWWrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
`;

export const FilterCountText = styled(FilterText)`
  margin-bottom: ${verticalScale(2)}px;
`;

export const FilterCountBar = styled.View<{ color: string }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${verticalScale(4)}px;
  background-color: ${({ color }) => color};
`;

// Status colors moved to constants.ts for better organization
