import styled from "styled-components/native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { Colors } from "../../../../constants/colors";

export const DetailsContainer = styled.View`
 flex: 1;
 padding: 0 ${scale(10)}px;
 background-color: #fff;
`;

export const DetailsHeading = styled.Text`
 font-size: ${moderateScale(14)}px;
 padding-bottom: ${verticalScale(8)}px;
 padding-left: ${verticalScale(4)}px;
 border-bottom-width: 1px;
 border-bottom-color: rgb(212, 212, 220);
 margin-bottom: ${verticalScale(20)}px;
 margin-top: ${verticalScale(20)}px;
`;

export const InputGroup = styled.View`
 flex-direction: row;
 align-items: center;
 margin-bottom: ${verticalScale(15)}px;
`;

export const Label = styled.Text`
 width: 45%;
 font-size: ${moderateScale(14)}px;
 text-align: right;
 padding-right: ${scale(20)}px;
`;

export const Input = styled.TextInput`
 width: 50%;
 background-color: ${Colors.list_item_separator_color};
 padding: ${scale(10)}px;
 border-radius: ${scale(8)}px;
`;

export const UpdateButton = styled.TouchableOpacity`
 margin-top: ${verticalScale(30)}px;
 margin-bottom: ${verticalScale(40)}px;
 background-color: rgb(183, 224, 238);
 padding-top: ${verticalScale(7)}px;
 padding-bottom: ${verticalScale(7)}px;
 padding-left: ${scale(26)}px;
 padding-right: ${scale(26)}px;
 border-radius: ${scale(3)}px;
 align-items: center;
 align-self: center;
 flex-direction: row;
 justify-content: center;
`;

export const UpdateButtonText = styled.Text`
 color: ${Colors.default_font_color};
 font-size: ${moderateScale(14)}px;
`;

export const ErrorText = styled.Text`
 color: red;
 font-size: ${moderateScale(12)}px;
 margin-top: ${verticalScale(-10)}px;
 margin-bottom: ${verticalScale(10)}px;
 margin-left: ${scale(150)}px;
`;
