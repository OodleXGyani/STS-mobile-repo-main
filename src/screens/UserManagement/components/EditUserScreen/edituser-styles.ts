import styled from "styled-components/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Colors } from "../../../../constants/colors";

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${verticalScale(15)}px;
  padding-bottom: ${verticalScale(15)}px;
  padding-left: ${scale(10)}px;
  padding-right: ${scale(10)}px;
  background-color: #003459;
`;

export const BackIcon = styled.Image`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
`;

export const HeaderTitle = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #fff;
`;

export const DetailsContainer = styled.View`
  flex: 1;
  padding: ${scale(10)}px;
  background-color: #fff;
`;

export const DetailsHeading = styled.Text`
  font-size: ${moderateScale(14)}px;
  padding-bottom: ${verticalScale(8)}px;
  padding-left: ${verticalScale(8)}px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(212, 212, 220);
  margin-bottom: ${verticalScale(20)}px;
  margin-top: ${verticalScale(20)}px;
`;

export const InputGroup = styled.View`
  flex-direction: row;
  align-items: center;
  padding-left: ${verticalScale(50)}px;
  padding-right: ${verticalScale(20)}px;
  margin-bottom: ${verticalScale(1)}px;
`;

export const Label = styled.Text`
  font-size: ${moderateScale(14)}px;
  width: 25%;
`;

export const Input = styled.TextInput`
  flex: 1;
  background-color: ${Colors.list_item_separator_color};
  padding: ${scale(10)}px;
  border-radius: ${scale(8)}px;
`;

export const UpdateButton = styled.TouchableOpacity`
  margin-top: ${verticalScale(30)}px;
  background-color: rgb(183, 224, 238);
  padding-top: ${verticalScale(7)}px;
  padding-bottom: ${verticalScale(7)}px;
  padding-left: ${scale(20)}px;
  padding-right: ${scale(20)}px;
  border-radius: ${scale(4)}px;
  align-items: center;
  align-self: center;
`;

export const UpdateButtonText = styled.Text`
  color: #003459;
  font-size: ${moderateScale(12)}px;
`;

export const FieldWrapper = styled.View`
  margin-bottom: ${verticalScale(5)}px; 
`;

export const ErrorText = styled.Text`
  color: red;
  font-size: ${moderateScale(12)}px;
  margin-top: ${verticalScale(2)}px;
  margin-left: 38%;
`;