import React from 'react';
import styled from 'styled-components/native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { FilterButton } from './FilterButton';

const FilterActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${verticalScale(20)}px;
`;

interface FilterActionsProps {
  onApply: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  onApply,
  onReset,
  isLoading
}) => {
  return (
    <FilterActionsContainer>
      <FilterButton 
        type="apply" 
        onPress={onApply}
        title="Apply"
        loading={isLoading}
      />
      <FilterButton 
        type="reset" 
        onPress={onReset}
        title="Reset Filter"
      />
    </FilterActionsContainer>
  );
};
