import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';

interface SearchResultMarkerProps {
  title: string;
  isSelected?: boolean;
}

const MarkerContainer = styled.View<{ isSelected: boolean }>`
  background-color: ${props => props.isSelected ? Colors.vehicle_status_color_on : Colors.primary_blue_color};
  border-radius: ${moderateScale(20)}px;
  padding-horizontal: ${moderateScale(12)}px;
  padding-vertical: ${moderateScale(6)}px;
  border-width: 3px;
  border-color: white;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-offset: 0px 2px;
  shadow-radius: 4px;
  elevation: 5;
  min-width: ${moderateScale(80)}px;
  align-items: center;
`;

const MarkerText = styled.Text`
  color: white;
  font-size: ${moderateScale(12)}px;
  font-weight: bold;
  text-align: center;
`;

const SearchResultMarker: React.FC<SearchResultMarkerProps> = ({ 
  title, 
  isSelected = false 
}) => {
  return (
    <MarkerContainer isSelected={isSelected}>
      <MarkerText numberOfLines={2}>
        {title}
      </MarkerText>
    </MarkerContainer>
  );
};

export default SearchResultMarker;
