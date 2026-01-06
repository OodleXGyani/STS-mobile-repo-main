import styled from "styled-components/native";
import { Colors } from "../../../constants/colors";
import { moderateScale, scale } from "react-native-size-matters";

export const Screen = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

export const Icon = styled.Image`
  width: ${scale(50)}px;
  height: ${scale(50)}px;
  align-self: center;
`;

export const HeaderRow = styled(Row)`
  background-color: ${Colors.primary_blue_80_color};
`;

export const HeaderText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #fff;
  text-align: center;
  font-weight: 600;
`;

export const ColType = styled.View`
  flex: 0.8;
  justify-content: center;
  align-items: center;
`;

export const ColName = styled.View`
  flex: 2;
  justify-content: center;
  align-items: center;
`;

export const ColReg = styled.View`
  flex: 1.2;
  justify-content: center;
  align-items: center;
`;

export const NameText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #333;
  width: ${scale(100)}px;
  text-align: center;
`;

export const RegText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #333;
  width: ${scale(100)}px;
  text-align: center;
`;

export const ErrorText = styled.Text`
  color: red;
  font-size: ${moderateScale(14)}px;
`;

export const EmptyText = styled.Text`
  text-align: center;
  margin-top: 20px;
  color: gray;
  font-size: ${moderateScale(14)}px;
`;

// Loaders
export const LoaderContainer = styled.View`
  margin-top: 40px;
`;

export const OverlayLoader = styled.View`
  position: absolute;
  top: 80px;
  left: 0;
  right: 0;
  align-items: center;
  z-index: 10;
`;

export const FooterLoader = styled.View`
  margin: 16px;
`;

// Pagination
export const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  align-items: center;
`;

export const PaginationButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "#007AFF" : "#ccc")};
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-radius: 8px;
`;

export const PaginationButtonText = styled.Text`
  color: white;
  font-size: ${moderateScale(14)}px;
  font-weight: 500;
`;

export const PaginationLabel = styled.Text`
  color: #333; 
  font-size: ${moderateScale(14)}px;
  font-weight: 500;
`;