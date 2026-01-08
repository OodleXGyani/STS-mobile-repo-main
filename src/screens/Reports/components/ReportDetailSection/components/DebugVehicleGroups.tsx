import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { VehicleGroup } from '../../../../../services/vehicles';

interface DebugVehicleGroupsProps {
  vehicleGroups: VehicleGroup[];
}

const DebugVehicleGroups: React.FC<DebugVehicleGroupsProps> = ({ vehicleGroups }) => {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <DebugButton onPress={() => setShowDebug(true)}>
        <DebugButtonText>🐛 Debug Info</DebugButtonText>
      </DebugButton>
    );
  }

  return (
    <ScrollView>
      <DebugContainer>
        <DebugCloseButton onPress={() => setShowDebug(false)}>
          <DebugCloseText>✕ Close</DebugCloseText>
        </DebugCloseButton>

        <DebugTitle>📊 Vehicle Groups Structure</DebugTitle>

        {vehicleGroups.map((group, groupIndex) => (
          <GroupDebugBox key={group.group_id}>
            <GroupDebugTitle>
              {groupIndex + 1}. {group.group_name} ({group.vehicle_count} vehicles)
            </GroupDebugTitle>
            <VehiclesPreview>
              {group.vehicles.slice(0, 3).map(v => (
                <VehiclePreviewItem key={v.id}>
                  • {v.vehicle_name} ({v.vehicle_number})
                </VehiclePreviewItem>
              ))}
              {group.vehicles.length > 3 && (
                <VehiclePreviewItem>
                  ... and {group.vehicles.length - 3} more
                </VehiclePreviewItem>
              )}
            </VehiclesPreview>
          </GroupDebugBox>
        ))}

        <DebugInfo>
          <DebugInfoTitle>ℹ️ Backend Response Structure:</DebugInfoTitle>
          <DebugInfoText>
            • Total Groups: {vehicleGroups.length}
          </DebugInfoText>
          <DebugInfoText>
            • Total Vehicles: {vehicleGroups.reduce((sum, g) => sum + g.vehicle_count, 0)}
          </DebugInfoText>
          <DebugInfoText>
            • Groups shown exactly as backend provides them
          </DebugInfoText>
        </DebugInfo>
      </DebugContainer>
    </ScrollView>
  );
};

const DebugButton = styled.TouchableOpacity`
  padding: ${verticalScale(10)}px ${scale(12)}px;
  background-color: #ff9800;
  border-radius: ${scale(6)}px;
  margin: ${verticalScale(10)}px ${scale(12)}px;
`;

const DebugButtonText = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
`;

const DebugContainer = styled.View`
  padding: ${verticalScale(16)}px ${scale(12)}px;
  background-color: #f5f5f5;
`;

const DebugCloseButton = styled.TouchableOpacity`
  align-self: flex-end;
  padding: ${verticalScale(8)}px ${scale(12)}px;
`;

const DebugCloseText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #d32f2f;
  font-weight: 600;
`;

const DebugTitle = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 700;
  color: #1976d2;
  margin-bottom: ${verticalScale(12)}px;
`;

const GroupDebugBox = styled.View`
  background-color: #ffffff;
  border-left-width: 4px;
  border-left-color: #1976d2;
  padding: ${verticalScale(12)}px ${scale(12)}px;
  margin-bottom: ${verticalScale(12)}px;
  border-radius: ${scale(4)}px;
`;

const GroupDebugTitle = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: ${verticalScale(8)}px;
`;

const VehiclesPreview = styled.View`
  margin-left: ${scale(8)}px;
`;

const VehiclePreviewItem = styled.Text`
  font-size: ${moderateScale(11)}px;
  color: #666666;
  margin-bottom: ${verticalScale(2)}px;
`;

const DebugInfo = styled.View`
  background-color: #e3f2fd;
  padding: ${verticalScale(12)}px ${scale(12)}px;
  border-radius: ${scale(4)}px;
  margin-top: ${verticalScale(12)}px;
`;

const DebugInfoTitle = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 700;
  color: #1565c0;
  margin-bottom: ${verticalScale(8)}px;
`;

const DebugInfoText = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #1565c0;
  margin-bottom: ${verticalScale(4)}px;
`;

export default DebugVehicleGroups;
