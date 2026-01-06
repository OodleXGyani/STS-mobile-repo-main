import styled from 'styled-components/native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { shadows } from './shadows';

export const FilterSection = styled.View`
  background-color: #FFFFFF;
  padding: ${moderateScale(10)}px;
  margin-bottom: ${verticalScale(16)}px;
  border-radius: ${moderateScale(12)}px;
`;

// Apply shadow using style prop for better performance
export const FilterSectionWithShadow = styled.View`
  background-color: #FFFFFF;
  padding: ${moderateScale(10)}px;
  margin-bottom: ${verticalScale(16)}px;
  border-radius: ${moderateScale(12)}px;
`;

export const SectionHeader = styled.View`
  padding-bottom: ${verticalScale(12)}px;
  border-bottom-width: 1px;
  border-bottom-color: #E5E5E5;
  margin-bottom: ${verticalScale(5)}px;
`;

export const SectionTitle = styled.Text`
  font-size: ${moderateScale(12)}px;
  font-weight: 600;
  color: #333333;
`;

export const SectionContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;
