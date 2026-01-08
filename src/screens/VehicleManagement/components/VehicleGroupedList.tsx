import React, { useState, useMemo } from 'react';
import { ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../constants/colors';
import Icons from '../../../common/icons';
import { useGetUserVehiclesQuery, VehicleGroup, VehicleItem } from '../../../services/vehicles';
import { useDebounce } from '../../../hooks/useDebounce';

interface VehicleGroupedListProps {
  searchQuery: string;
  sortBy: 'name' | 'reg_no';
  sortType: 'asc' | 'desc';
}

const VehicleGroupedList: React.FC<VehicleGroupedListProps> = ({
  searchQuery,
  sortBy,
  sortType,
}) => {
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: userVehicleResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserVehiclesQuery({
    pageIndex: 1,
    pageSize: 1000,
    searchText: debouncedSearch,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Extract groups directly from backend response
  const vehicleGroups: VehicleGroup[] = useMemo(() => {
    if (!userVehicleResponse) {
      console.log('🚗 [VehicleGroupedList] No response yet');
      return [];
    }

    console.log('🚗 [VehicleGroupedList] Raw response:', userVehicleResponse);
    console.log('🚗 [VehicleGroupedList] Response type:', typeof userVehicleResponse, 'is Array:', Array.isArray(userVehicleResponse));

    let groupsArray: any[] = [];

    // Format 1: Wrapped object with "groups" field (pre-grouped from backend)
    if ('groups' in userVehicleResponse && Array.isArray(userVehicleResponse.groups)) {
      console.log('✅ [VehicleGroupedList] Using wrapped groups format:', userVehicleResponse.groups.length, 'groups');
      groupsArray = userVehicleResponse.groups;
    }
    // Format 2: Direct array of groups with "name" field (pre-grouped from backend)
    else if (Array.isArray(userVehicleResponse)) {
      console.log('✅ [VehicleGroupedList] Direct array format detected:', userVehicleResponse.length, 'groups');
      groupsArray = userVehicleResponse;
    }
    // Format 3: Wrapped response with "data" field containing groups
    else if ('data' in userVehicleResponse && Array.isArray(userVehicleResponse.data)) {
      console.log('✅ [VehicleGroupedList] Using data field format:', userVehicleResponse.data.length, 'groups');
      groupsArray = userVehicleResponse.data;
    }
    // Format 4: Flat vehicles list that needs to be grouped by vehicleGroup field
    else if ('items' in userVehicleResponse && Array.isArray(userVehicleResponse.items)) {
      console.log('✅ [VehicleGroupedList] Detected items array format with', userVehicleResponse.items.length, 'vehicles');

      // Group vehicles by their vehicleGroup field
      const vehiclesMap = new Map<string, any[]>();

      userVehicleResponse.items.forEach((vehicle: any) => {
        const groupName = vehicle.vehicleGroup || 'Ungrouped';
        if (!vehiclesMap.has(groupName)) {
          vehiclesMap.set(groupName, []);
        }
        vehiclesMap.get(groupName)!.push(vehicle);
      });

      // Convert map to array of groups
      let groupId = 1;
      groupsArray = Array.from(vehiclesMap.entries()).map(([groupName, vehicles]) => ({
        name: groupName,
        group_id: groupId++,
        vehicles: vehicles,
      }));

      console.log('✅ [VehicleGroupedList] Grouped items format:', Array.from(vehiclesMap.keys()).map(k => `${k}(${vehiclesMap.get(k)!.length})`).join(', '));
    }
    // Format 5: Response with direct vehicles list
    else if ('vehicles' in userVehicleResponse && Array.isArray(userVehicleResponse.vehicles)) {
      console.log('✅ [VehicleGroupedList] Using vehicles field format');
      groupsArray = [{ name: 'All Vehicles', vehicles: userVehicleResponse.vehicles }];
    }
    else {
      console.warn('⚠️ [VehicleGroupedList] Unexpected response format:', userVehicleResponse);
      console.warn('Available keys:', Object.keys(userVehicleResponse));
      return [];
    }

    // Transform groups to VehicleGroup format
    let groupId = 1;
    const result = groupsArray.map((group: any) => {
      const transformedVehicles: VehicleItem[] = (group.vehicles || []).map((v: any) => ({
        id: v.id,
        vehicle_type: v.vehicle_type || 'Other',
        vehicle_model: v.vehicle_model || null,
        vehicle_number: v.vehicle_Number || v.vehicle_number || 'N/A',
        vehicle_name: v.vehicle_name || 'N/A',
        device: {
          device_name: v.device_name || 'N/A',
        },
      }));

      return {
        group_id: groupId++,
        // Use group_name if available, otherwise fallback to name
        group_name: group.group_name || group.name || 'Unknown',
        vehicle_count: transformedVehicles.length,
        vehicles: transformedVehicles,
      };
    });

    console.log('📊 [VehicleGroupedList] Final vehicle groups:', result.length, 'groups');
    return result;
  }, [userVehicleResponse]);

  // Apply sorting to vehicles within each group
  const sortedVehicleGroups: VehicleGroup[] = useMemo(() => {
    return vehicleGroups.map(group => ({
      ...group,
      vehicles: [...group.vehicles].sort((a, b) => {
        if (sortBy === 'reg_no') {
          const numA = Number(a.vehicle_number) || 0;
          const numB = Number(b.vehicle_number) || 0;
          return sortType === 'asc' ? numA - numB : numB - numA;
        } else {
          const valA = (a.vehicle_name || '').toLowerCase();
          const valB = (b.vehicle_name || '').toLowerCase();
          if (valA < valB) return sortType === 'asc' ? -1 : 1;
          if (valA > valB) return sortType === 'asc' ? 1 : -1;
          return 0;
        }
      }),
    }));
  }, [vehicleGroups, sortBy, sortType]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  if (error) {
    return (
      <Container>
        <ErrorText>Failed to load vehicles</ErrorText>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <LoaderContainer>
          <ActivityIndicator size="large" color={Colors.primary_blue_color} />
        </LoaderContainer>
      </Container>
    );
  }

  const hasNoVehicles = !sortedVehicleGroups || sortedVehicleGroups.length === 0;

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <Container>
        {hasNoVehicles ? (
          <EmptyText>No vehicles found</EmptyText>
        ) : (
          sortedVehicleGroups.map(group => {
            const groupKey = String(group.group_id);
            const isGroupExpanded = expandedGroups[groupKey] ?? true;

            return (
              <GroupContainer key={group.group_id}>
                {/* Main Group Header */}
                <GroupHeader onPress={() => toggleGroup(groupKey)}>
                  <GroupHeaderContent>
                    <GroupTitle>{group.group_name}</GroupTitle>
                    <GroupCount>({group.vehicle_count})</GroupCount>
                  </GroupHeaderContent>
                  <GroupArrow
                    source={
                      isGroupExpanded ? Icons.caret_up_white : Icons.caret_down_white
                    }
                  />
                </GroupHeader>

                {/* Vehicles List - render directly from backend group */}
                {isGroupExpanded && (
                  <VehicleListContainer>
                    {group.vehicles.map(vehicle => (
                      <VehicleItemRow key={vehicle.id}>
                        <VehicleIcon
                          source={Icons.car_blue}
                          resizeMode="contain"
                        />
                        <VehicleInfo>
                          <VehicleName numberOfLines={1}>
                            {vehicle.vehicle_name || 'N/A'}
                          </VehicleName>
                          <VehicleRegNo numberOfLines={1}>
                            {vehicle.vehicle_number || 'N/A'}
                          </VehicleRegNo>
                        </VehicleInfo>
                        <VehicleType>{vehicle.vehicle_type}</VehicleType>
                      </VehicleItemRow>
                    ))}
                  </VehicleListContainer>
                )}
              </GroupContainer>
            );
          })
        )}
      </Container>
    </ScrollView>
  );
};

// Styled Components
const Container = styled.View`
  flex: 1;
  padding: ${verticalScale(10)}px ${scale(12)}px;
`;

const LoaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #d32f2f;
  text-align: center;
  margin-top: ${verticalScale(20)}px;
`;

const EmptyText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #999999;
  text-align: center;
  margin-top: ${verticalScale(20)}px;
`;

const GroupContainer = styled.View`
  margin-bottom: ${verticalScale(16)}px;
  border-radius: ${scale(8)}px;
  overflow: hidden;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const GroupHeader = styled.TouchableOpacity`
  background-color: ${Colors.primary_blue_color};
  padding: ${verticalScale(14)}px ${scale(16)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GroupHeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const GroupTitle = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 700;
  color: #ffffff;
`;

const GroupCount = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: #ffffff;
  margin-left: ${scale(8)}px;
`;

const GroupArrow = styled.Image`
  width: ${scale(20)}px;
  height: ${scale(12)}px;
`;

const VehicleListContainer = styled.View`
  background-color: #ffffff;
`;

const VehicleItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(12)}px ${scale(16)}px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const VehicleIcon = styled.Image`
  width: ${scale(32)}px;
  height: ${scale(20)}px;
  margin-right: ${scale(12)}px;
`;

const VehicleInfo = styled.View`
  flex: 1;
  margin-right: ${scale(12)}px;
`;

const VehicleName = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 600;
  color: #222222;
  margin-bottom: ${verticalScale(4)}px;
`;

const VehicleRegNo = styled.Text`
  font-size: ${moderateScale(11)}px;
  font-weight: 400;
  color: #888888;
`;

const VehicleType = styled.Text`
  font-size: ${moderateScale(11)}px;
  font-weight: 500;
  color: ${Colors.primary_blue_color};
  padding: ${verticalScale(4)}px ${scale(8)}px;
  background-color: #e3f2fd;
  border-radius: ${scale(4)}px;
  overflow: hidden;
`;

export default VehicleGroupedList;
