import React from 'react';
import styled from 'styled-components/native';
import { verticalScale } from 'react-native-size-matters';
import { FilterButton } from './FilterButton';

const FilterHeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${verticalScale(20)}px;
`;

interface FilterHeaderProps {
  onClose: () => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({ onClose }) => {
  return (
    <FilterHeaderContainer>
      <FilterButton type="close" onPress={onClose} />
    </FilterHeaderContainer>
  );
};
