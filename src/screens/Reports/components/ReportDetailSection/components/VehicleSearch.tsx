import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import Icons from '../../../../../common/icons';

interface VehicleSearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onReset: () => void;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({ 
  searchQuery, 
  onSearchChange, 
  onReset 
}) => (
  <Section>
    <SectionLabel>Select Vehicle</SectionLabel>
    <SearchRow>
      <SearchContainer>
        <SearchInput
          placeholder="Search vehicles..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#999"
        />
        <SearchIcon source={Icons.search_blue} />
      </SearchContainer>
      <ResetButton onPress={onReset}>
        <ResetText>Reset</ResetText>
      </ResetButton>
    </SearchRow>
  </Section>
);

const Section = styled.View`
  margin-bottom: ${verticalScale(24)}px;
`;

const SectionLabel = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #333333;
  margin-bottom: ${verticalScale(12)}px;
`;

const SearchRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchContainer = styled.View`
  position: relative;
  flex: 3;
`;

const SearchInput = styled.TextInput`
  background-color: #f5f5f5;
  padding: ${verticalScale(14)}px ${scale(16)}px;
  padding-right: ${scale(50)}px;
  border-radius: ${scale(8)}px;
  font-size: ${moderateScale(14)}px;
  color: #333333;
`;

const SearchIcon = styled.Image`
  position: absolute;
  right: ${scale(16)}px;
  top: ${verticalScale(14)}px;
  width: ${scale(20)}px;
  height: ${scale(20)}px;
`;

const ResetButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ResetText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: ${Colors.primary_blue_color};
  font-weight: 500;
`;

export default VehicleSearch;
