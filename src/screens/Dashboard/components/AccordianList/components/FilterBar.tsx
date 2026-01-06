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
import { VehicleStatus } from '../types';
import { StatusSummary } from '../../../context/types';

interface FilterBarProps {
  onFilterPress: () => void;
  filterIcon: any;
  totals: StatusSummary;
  displayedStatuses: readonly VehicleStatus[];
  statusColors: Record<string, string>;
  currentGroupBy?: string; // Add currentGroupBy prop
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFilterPress,
  filterIcon,
  totals,
  displayedStatuses,
  statusColors,
  currentGroupBy = 'status', // Default to status grouping
}) => {
  // Dynamic filter text based on grouping
  const getFilterText = () => {
    if (currentGroupBy === 'area') {
      return 'Filter Areas';
    } else if (currentGroupBy === 'vehicle') {
      return 'Filter Vehicles';
    } else {
      return 'Filter Status';
    }
  };


  return (
    <StyledFilterBar>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={onFilterPress}>
        <FilterIcon source={filterIcon} />

      <FilterText>{getFilterText()}</FilterText>
      </TouchableOpacity>

      <FilterRight>
        <FilterCounts>
          <FilterContainer>
            {displayedStatuses.map(status => (
              <FilterWWrapper key={status}>
                <FilterCountText>
                  {status === 'off'
                    ? `${totals.off}(${totals.longoff || 0})`
                    : totals[status]}
                </FilterCountText>
                <FilterCountBar color={statusColors[status]} />
              </FilterWWrapper>
            ))}
          </FilterContainer>
          
        </FilterCounts>
      </FilterRight>

    </StyledFilterBar>
  );
};
