import { useMemo, useState } from 'react';
import { useDashboardLiveTrack, useDashboardSort } from '../../../context';
import { ProcessedGroup, Group } from '../../../context/types';

export const useAccordionState = () => {
  const { liveTrackData, refreshLiveTrackData, liveTrackLoading } =
    useDashboardLiveTrack();
  const { sort } = useDashboardSort();

  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const currentGroupBy = sort?.groupBy ?? 'status';

  /**
   * Transform groups from API to ProcessedGroup format
   * Groups already contain normalized vehicles from the normalizer
   */
  const groups: ProcessedGroup[] = useMemo(() => {
    if (!liveTrackData?.groups) return [];

    return liveTrackData.groups.map(group => ({
      key: group.id,                         // Vehicle ID (unitAlias)
      name: group.name,
      count: group.vehicles?.length ?? 0,    // Count of vehicles in group
      vehicles: group.vehicles ?? [],        // Already normalized vehicles
    }));
  }, [liveTrackData]);

  const toggle = (groupKey: string) => {
    setOpened(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  return {
    groups,
    totals: liveTrackData?.summary,
    opened,
    toggle,
    refreshLiveTrackData,
    currentGroupBy,
    liveTrackLoading,
  };
};
