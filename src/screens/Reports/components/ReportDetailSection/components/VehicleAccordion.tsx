import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import Icons from '../../../../../common/icons';
import type { VehicleItem, VehicleGroupedByBrand } from '../../../../../services/vehicles';

interface VehicleAccordionProps {
  vehicleGroups: VehicleGroupedByBrand[];
  expandedGroups: Record<string, boolean>;
  selectedVehicles: VehicleItem[];
  onGroupToggle: (manufacturer: string) => void;
  onVehicleToggle: (vehicle: VehicleItem) => void;
}

const VehicleAccordion: React.FC<VehicleAccordionProps> = ({
  vehicleGroups,
  expandedGroups,
  selectedVehicles,
  onGroupToggle,
  onVehicleToggle,
}) => {
  return (
    <Container>
      {vehicleGroups.map((group, groupIndex) => {
        const isExpanded = expandedGroups[group.name] ?? group.vehicles.length > 0;

        return (
          <VehicleGroup key={groupIndex}>
            <GroupHeader onPress={() => onGroupToggle(group.name)}>
              <GroupTitle>{group.name}</GroupTitle>
              <GroupArrow
                source={
                  isExpanded ? Icons.caret_up_blue : Icons.caret_down_blue
                }
                style={{
                  transform: [{ rotate: isExpanded ? '0deg' : '0deg' }],
                }}
              />
            </GroupHeader>

            {isExpanded && (
              <VehicleList>
                {group.vehicles.map(vehicle => (
                  <VehicleItemContainer
                    key={vehicle.id}
                    onPress={() => onVehicleToggle(vehicle)}
                  >
                    <CheckboxContainer
                      isSelected={selectedVehicles.some(v => v.id === vehicle.id)}
                    >
                      {selectedVehicles.some(v => v.id === vehicle.id) && (
                        <Checkmark>✓</Checkmark>
                      )}
                    </CheckboxContainer>

                    <VehicleIcon source={Icons.car_blue} />
                    <VehicleName>{vehicle.vehicle_name || vehicle.vehicle_Number}</VehicleName>
                    <VehicleStatus>{vehicle.vehicle_type || 'N/A'}</VehicleStatus>
                  </VehicleItemContainer>
                ))}
              </VehicleList>
            )}
          </VehicleGroup>
        );
      })}
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: ${verticalScale(20)}px;
`;

const VehicleGroup = styled.View`
  margin-bottom: ${verticalScale(16)}px;
  border-radius: ${scale(8)}px;
  overflow: hidden;
`;

const GroupHeader = styled.TouchableOpacity`
  background-color: #e3f2fd;
  padding: ${verticalScale(12)}px ${scale(16)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GroupTitle = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: ${Colors.primary_blue_color};
`;

const GroupArrow = styled.Image`
  width: ${scale(20)}px;
  height: ${scale(12)}px;
`;

const VehicleList = styled.View`
  background-color: #ffffff;
  border: 1px solid #e5e5ea;
  border-top-width: 0;
`;

const VehicleItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(12)}px ${scale(16)}px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const CheckboxContainer = styled.View<{ isSelected: boolean }>`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
  border-radius: ${scale(4)}px;
  background-color: ${props =>
    props.isSelected ? Colors.primary_blue_color : 'transparent'};
  border-width: 2px;
  border-color: ${Colors.primary_blue_color};
  align-items: center;
  justify-content: center;
  margin-right: ${scale(12)}px;
`;

const Checkmark = styled.Text`
  color: #ffffff;
  font-size: ${moderateScale(12)}px;
  font-weight: bold;
`;

const VehicleIcon = styled.Image`
  width: ${scale(45)}px;
  height: ${scale(16)}px;
  margin-right: ${scale(12)}px;
`;

const VehicleName = styled.Text`
  flex: 1;
  font-size: ${moderateScale(14)}px;
  font-weight: 500;
  color: #333333;
`;

const VehicleStatus = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #666666;
  font-weight: 400;
`;

export default VehicleAccordion;
