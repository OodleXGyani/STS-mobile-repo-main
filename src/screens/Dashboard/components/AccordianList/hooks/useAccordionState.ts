import { useMemo, useState } from 'react';
import { useDashboardLiveTrack, useDashboardSort } from '../../../context';
import { ProcessedGroup, LiveTrackApiGroup } from '../../../context/types';

export const useAccordionState = () => {
  const { liveTrackData, refreshLiveTrackData, liveTrackLoading } =
    useDashboardLiveTrack();
  const { sort } = useDashboardSort();

  const [opened, setOpened] = useState<Record<string, boolean>>({});

  const currentGroupBy = sort?.groupBy ?? 'status';

  // ✅ CORRECT mapping based on REAL API
  const groups: ProcessedGroup[] = useMemo(() => {
    if (!liveTrackData?.groups) return [];

    return (liveTrackData.groups as LiveTrackApiGroup[]).map(group => ({
      key: group.id,                         // ✅ id exists
      name: group.name,
      count: group.vehicles?.length ?? 0,    // ✅ derive count
      vehicles: group.vehicles ?? [],        // ✅ vehicles exists
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
