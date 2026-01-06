import React, { useCallback } from 'react';
import { ScrollView, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { verticalScale, moderateScale } from 'react-native-size-matters';

// Import modular components
import {
  FilterHeader,
  FilterActions,
  StatusFilterSection,
  LocationFilterSection,
  VehicleTypeFilterSection,
} from './components';

// Import context hook instead of local hook
import { useDashboardFilters } from '../../context';
import { useFilterData, useStatusItems } from './data';

// Import types
import { FilterActions as FilterActionsType } from './types';

// ===== STYLED COMPONENTS =====
const FilterContainer = styled.View`
  position: absolute;
  width: 100%;
  top: ${moderateScale(100)};
  height: 92%;
  padding-top: ${verticalScale(22)}px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const FilterContent = styled.View`
  flex: 1;
  background-color: #eceaea;
  padding-vertical: ${verticalScale(10)}px;
  padding-horizontal: ${moderateScale(20)}px;
  border-top-left-radius: ${moderateScale(20)}px;
  border-top-right-radius: ${moderateScale(20)}px;
`;

const TestSummary = styled.View`
  background-color: #f0f8ff;
  padding: ${moderateScale(12)}px;
  margin-bottom: ${verticalScale(16)}px;
  border-radius: ${moderateScale(8)}px;
  border-left-width: 4px;
  border-left-color: #007aff;
`;

const TestSummaryText = styled.Text`
  font-size: ${moderateScale(12)}px;
  color: #333333;
  font-weight: 500;
`;

// ===== MAIN COMPONENT =====
const HomeFilter: React.FC<FilterActionsType> = ({
  onClose,
  onApply,
  onReset,
}) => {
  // Use context for filter state management instead of local hook
  const {
    filters,
    toggleStatusFilter,
    toggleLocationFilter,
    toggleVehicleTypeFilter,
    updateGovernorateSelection,
    resetFilters,
    applyFilters: contextApplyFilters,
  } = useDashboardFilters();

  // Get dynamic data from Dashboard context
  const filterData = useFilterData();
  const statusItems = useStatusItems();

  const handleApply = useCallback(async () => {
    try {
      const appliedFilters = await contextApplyFilters();
      onApply(appliedFilters);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    }
  }, [contextApplyFilters, onApply]);

  const handleReset = useCallback(() => {
    resetFilters();
    onReset();
  }, [resetFilters, onReset]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Calculate total selections for test display
  const totalSelections =
    filters.status.length +
    filters.location.length +
    filters.vehicleType.length;

  return (
    <FilterContainer>
      <FilterContent>
        <FilterHeader onClose={handleClose} />

        <FilterActions
          onApply={handleApply}
          onReset={handleReset}
          isLoading={false} // Loading state is now managed by context
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusFilterSection
            statusItems={statusItems}
            selectedStatus={filters.status}
            onStatusToggle={toggleStatusFilter}
          />

          <LocationFilterSection
            locationSummary={filterData.locationSummary}
            selectedGovernorate={filters.governorateSelected}
            selectedAreas={filters.location}
            onGovernorateChange={updateGovernorateSelection}
            onAreaToggle={toggleLocationFilter}
          />

          <VehicleTypeFilterSection
            vehicleTypes={filterData.vehicleTypes}
            selectedTypes={filters.vehicleType}
            onTypeToggle={toggleVehicleTypeFilter}
          />
        </ScrollView>
      </FilterContent>
    </FilterContainer>
  );
};

export default HomeFilter;
