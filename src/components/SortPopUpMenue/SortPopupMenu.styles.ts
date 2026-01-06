// components/SortPopupMenu/SortPopupMenu.styles.ts
import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';



export const SectionTitle = styled.Text`
  font-weight: bold;
  font-size: ${moderateScale(14)}px;
  margin-bottom: ${moderateScale(10)}px;
  color: #1a3557;
  text-align:center;
`;

export const Section = styled.View`
  margin-bottom: ${moderateScale(18)}px;
`;
export const Divider = styled.View`
  height: ${moderateScale(1)}px;
  background-color: #d3d3d3;
  margin-bottom: ${moderateScale(8)}px;
`;
