import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  FilterBar as StyledFilterBar,
  FilterIcon,
  FilterText,
  FilterRight,
  FilterCounts,
  FilterContainer,
  FilterWWrapper,
  FilterCountText,
  FilterCountBar,
} from '../accordian-styles';
import { VehicleStatus, StatusSummary } from '../../../context/types';
import { STATUS_COLORS, STATUS_SUMMARY_FIELDS } from '../constants';

interface FilterBarProps {
  onFilterPress: () => void;
  filterIcon: any;
  totals: StatusSummary;
  displayedStatuses: VehicleStatus[];
  statusColors?: Record<VehicleStatus | string, string>;
  currentGroupBy?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterPress,
  filterIcon,
  totals,
  displayedStatuses,
  statusColors = STATUS_COLORS,
  currentGroupBy = 'status',
}) => {
  /**
   * Get dynamic filter button text based on current grouping
   */
  const getFilterText = (): string => {
    switch (currentGroupBy) {
      case 'area':
        return 'Filter Areas';
      case 'vehicleType':
        return 'Filter Vehicles';
      case 'status':
      default:
        return 'Filter Status';
    }
  };

  /**
   * Get count for a specific status from the summary
   */
  const getStatusCount = (status: VehicleStatus): number => {
    const fieldName = STATUS_SUMMARY_FIELDS[status];
    return (totals as any)[fieldName] ?? 0;
  };

  return (
    <StyledFilterBar>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={onFilterPress}
      >
        <FilterIcon source={filterIcon} />
        <FilterText>{getFilterText()}</FilterText>
      </TouchableOpacity>

      <FilterRight>
        <FilterCounts>
          <FilterContainer>
            {displayedStatuses.map(status => {
              const count = getStatusCount(status);
              const color = statusColors[status] || '#9CA3AF';

              return (
                <FilterWWrapper key={status}>
                  <FilterCountText>{count}</FilterCountText>
                  <FilterCountBar color={color} />
                </FilterWWrapper>
              );
            })}
          </FilterContainer>
        </FilterCounts>
      </FilterRight>
    </StyledFilterBar>
  );
};
