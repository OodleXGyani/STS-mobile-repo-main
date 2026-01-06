import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const Container = styled.View<{ insets: any }>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  padding-top: ${props => props.insets.top}px;
  padding-bottom: ${props => props.insets.bottom}px;
  justify-content: flex-end;
`;

export const Content = styled.View<{ theme: any }>`
  background-color: ${props => props.theme.backgroundColor};
  border-top-left-radius: ${scale(20)}px;
  border-top-right-radius: ${scale(20)}px;
  max-height: 80%;
`;

export const Divider = styled.View<{ theme: any }>`
  height: 1px;
  background-color: ${props => props.theme.borderColor};
  margin: ${verticalScale(8)}px 0;
`;