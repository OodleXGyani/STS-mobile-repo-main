import styled from "styled-components/native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.white};
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${verticalScale(20)}px;
`;

export const Icon = styled.Image`
  height: ${scale(100)}px;
  width: ${scale(100)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

export const Message = styled.Text`
  font-size: ${scale(16)}px;
  color: ${Colors.default_font_color};
  text-align: center;
`;