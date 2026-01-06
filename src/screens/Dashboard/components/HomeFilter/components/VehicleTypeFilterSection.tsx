import React from 'react';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { VehicleType } from '../types';
import { FilterSection, SectionHeader, SectionTitle, SectionContent, shadows } from '../styles';
import { Colors } from '../../../../../constants/colors';

const TypeButton = styled.TouchableOpacity<{ isSelected: boolean }>`
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

const TypeLabel = styled.Text<{ isSelected: boolean }>`
  font-size: ${moderateScale(12)}px;
  color: ${props => props.isSelected ? '#FFFFFF' : `${Colors.primary_blue_color}`};
  margin-right: ${scale(14)}px;
`;

const TypeCounter = styled.View`
  height: ${scale(28)}px;
  width: ${scale(28)}px;
  border-radius: ${scale(14)}px;
  border-width: 1px;
  border-color: ${Colors.primary_blue_color};
  background-color: #FFFFFF;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -1px;
  margin-top: -1.5px;
`;

const TypeCounterText = styled.Text`
  font-size: ${moderateScale(11)}px;
  color: ${Colors.primary_blue_color};
`;

interface VehicleTypeFilterSectionProps {
  vehicleTypes: VehicleType[];
  selectedTypes: string[];
  onTypeToggle: (vehicleType: string) => void;
}

export const VehicleTypeFilterSection: React.FC<VehicleTypeFilterSectionProps> = ({
  vehicleTypes,
  selectedTypes,
  onTypeToggle
}) => {
  console.log('🟡 VehicleTypeFilterSection rendered with:', { vehicleTypes, selectedTypes });
  
  return (
    <FilterSection style={shadows.medium}>
      <SectionHeader>
        <SectionTitle>Vehicle Type {selectedTypes.length > 0 ? `(${selectedTypes.length} selected)` : ''}</SectionTitle>
      </SectionHeader>
      <SectionContent>
        {vehicleTypes.map(item => (
          <TypeButton
            key={item.vehicle_type}
            isSelected={selectedTypes.includes(item.vehicle_type)}
            onPress={() => {
              console.log('🟡 Vehicle type toggled:', item.vehicle_type);
              onTypeToggle(item.vehicle_type);
            }}
          >
            <TypeLabel isSelected={selectedTypes.includes(item.vehicle_type)}>
              {item.vehicle_type}
            </TypeLabel>
            <TypeCounter>
              <TypeCounterText>{item.no_vehicles}</TypeCounterText>
            </TypeCounter>
          </TypeButton>
        ))}
      </SectionContent>
    </FilterSection>
  );
};
