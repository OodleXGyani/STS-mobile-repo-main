import React from 'react';
import {
  GroupHeader,
  GroupTitle,
  CountsContainer,
  CountWrapper,
  CountText,
  CountBar,
  Caret,
} from '../accordian-styles';
import { VehicleStatus } from '../types';
import { ProcessedGroup } from '../../../context/types';

interface Props {
  group: ProcessedGroup;
  isOpen: boolean;
  onToggle: (groupName: string) => void;
  displayedStatuses: readonly VehicleStatus[];
  statusColors: Record<string, string>;
  caretIcon: any;
  groupBy?: string;
}

export const VehicleGroupHeader: React.FC<Props> = ({
  group,
  isOpen,
  onToggle,
  displayedStatuses,
  statusColors,
  caretIcon,
}) => {
  return (
    <GroupHeader onPress={() => onToggle(group.name)}>
      <GroupTitle>{group.name}</GroupTitle>

      <CountsContainer>
        {displayedStatuses.map(status => {
          const count = Array.isArray(group.vehicles)
            ? group.vehicles.filter(v => v.status === status).length
            : 0;

          return (
            <CountWrapper key={status}>
              <CountText>{count}</CountText>
              <CountBar color={statusColors[status]} />
            </CountWrapper>
          );
        })}
      </CountsContainer>

      <Caret
        source={caretIcon}
        style={{
          transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
          width: 15,
          height: 10,
        }}
      />
    </GroupHeader>
  );
};
