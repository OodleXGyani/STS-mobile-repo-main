import React from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { LocationSummary } from '../types';
import { FilterSection, SectionHeader, SectionTitle, shadows } from '../styles';
import { Colors } from '../../../../../constants/colors';

const TabContainer = styled.TouchableOpacity<{ isActive: boolean }>`
  padding-horizontal: ${moderateScale(12)}px;
  padding-vertical: ${verticalScale(8)}px;
  margin: ${moderateScale(4)}px;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.isActive ? `${Colors.primary_blue_color}` : 'transparent'};
`;

const TabText = styled.Text<{ isActive: boolean }>`
  font-size: ${moderateScale(12)}px;
  font-weight: ${props => props.isActive ? '600' : '400'};
  color: ${props => props.isActive ? `${Colors.primary_blue_color}`: '#666666'};
`;

const AreaContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: ${verticalScale(5)}px;
`;

const AreaButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  justify-content: center;
  border-width: 1px;
  border-color:${Colors.primary_blue_color};
  border-radius: ${scale(26)}px;
  height: ${scale(27)}px;
  margin: ${moderateScale(8)}px;
  background-color: ${props => props.isSelected ? `${Colors.primary_blue_color}` : 'transparent'};
  align-items: center;
  padding-horizontal: ${moderateScale(20)}px;
`;

const AreaLabel = styled.Text<{ isSelected: boolean }>`
  font-size: ${moderateScale(12)}px;
  color: ${props => props.isSelected ? '#FFFFFF' : `${Colors.primary_blue_color}`};
  margin-right: ${scale(14)}px;
`;

const AreaCounter = styled.View`
  height: ${scale(28)}px;
  width: ${scale(28)}px;
  border-radius: ${scale(14)}px;
  border-width: 1px;
  border-color: ${Colors.primary_blue_color};;
  background-color: #FFFFFF;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -1px;
  margin-top: -1.5px;
`;

const AreaCounterText = styled.Text`
  font-size: ${moderateScale(11)}px;
  color: ${Colors.primary_blue_color};;
`;

interface LocationFilterSectionProps {
  locationSummary: LocationSummary[];
  selectedGovernorate: number;
  selectedAreas: string[];
  onGovernorateChange: (index: number) => void;
  onAreaToggle: (areaName: string) => void;
}

export const LocationFilterSection: React.FC<LocationFilterSectionProps> = ({
  locationSummary,
  selectedGovernorate,
  selectedAreas,
  onGovernorateChange,
  onAreaToggle
}) => {
  console.log('🔵 LocationFilterSection rendered with:', { 
    locationSummary, 
    selectedGovernorate, 
    selectedAreas 
  });
  
  return (
    <FilterSection style={shadows.medium}>
      <SectionHeader>
        <SectionTitle>
          Vehicle Location {selectedAreas.length > 0 ? `(${selectedAreas.length} areas selected)` : ''}
        </SectionTitle>
      </SectionHeader>
      
      <FlatList
        data={locationSummary}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `governorate_${index}`}
        renderItem={({ item, index }) => (
          <TabContainer
            isActive={index === selectedGovernorate}
            onPress={() => {
              console.log('🔵 Governorate changed to:', item.govern_name);
              onGovernorateChange(index);
            }}
          >
            <TabText isActive={index === selectedGovernorate}>
              {item.govern_name} ({item.no_vehicles})
            </TabText>
          </TabContainer>
        )}
      />

      {locationSummary[selectedGovernorate] && (
        <AreaContainer>
          {locationSummary[selectedGovernorate].areas.map((area, index) => (
            <AreaButton
              key={`area_${index}`}
              isSelected={selectedAreas.includes(area.area_name)}
              onPress={() => {
                console.log('🔵 Area toggled:', area.area_name);
                onAreaToggle(area.area_name);
              }}
            >
              <AreaLabel isSelected={selectedAreas.includes(area.area_name)}>
                {area.area_name}
              </AreaLabel>
              <AreaCounter>
                <AreaCounterText>{area.no_vehicles}</AreaCounterText>
              </AreaCounter>
            </AreaButton>
          ))}
        </AreaContainer>
      )}
    </FilterSection>
  );
};
