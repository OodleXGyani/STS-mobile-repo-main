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
import { VehicleStatus, ProcessedGroup } from '../../../context/types';

interface Props {
  group: ProcessedGroup;
  isOpen: boolean;
  onToggle: (groupName: string) => void;
  displayedStatuses: VehicleStatus[];
  statusColors: Record<VehicleStatus | string, string>;
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
  /**
   * Count vehicles in group by status
   */
  const getStatusCount = (status: VehicleStatus): number => {
    if (!Array.isArray(group.vehicles)) return 0;
    return group.vehicles.filter(v => v.status === status).length;
  };

  return (
    <GroupHeader onPress={() => onToggle(group.name)}>
      <GroupTitle>{group.name}</GroupTitle>

      <CountsContainer>
        {displayedStatuses.map(status => {
          const count = getStatusCount(status);
          const color = statusColors[status] || '#9CA3AF';

          return (
            <CountWrapper key={status}>
              <CountText>{count}</CountText>
              <CountBar color={color} />
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
