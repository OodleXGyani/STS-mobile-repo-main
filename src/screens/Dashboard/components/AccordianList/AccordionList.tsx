import React from 'react';
import { ScrollView, RefreshControl, StyleSheet } from 'react-native';

import { Screen, Content } from './accordian-styles';
import {
  VehicleGroupHeader,
  VehicleItem,
  FilterBar,
} from './components';

import { useAccordionState } from './hooks/useAccordionState';
import {
  ICONS,
  DISPLAYED_STATUSES,
  STATUS_COLORS,
  CAR_BY_STATUS,
} from './constants';

import { StatusSummary, Vehicle } from '../../context/types';

interface AccordionListProps {
  onFilterPress: () => void;
}

/**
 * Safe default totals so UI never crashes on first load
 */
const EMPTY_TOTALS: StatusSummary = {
  on: 0,
  idle: 0,
  off: 0,
  longoff: 0,
  overspeed: 0,
  no_signal: 0,
  filtered: 0,
  total: 0,
};

const AccordionList: React.FC<AccordionListProps> = ({ onFilterPress }) => {
  const {
    groups,
    totals,
    opened,
    toggle,
    refreshLiveTrackData,
    currentGroupBy,
    liveTrackLoading,
  } = useAccordionState();

  const handleRefresh = async () => {
    try {
      console.log('🔄 Pull to refresh');
      await refreshLiveTrackData();
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    }
  };

  return (
    <Screen>
      <Content>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={liveTrackLoading}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
        >
          {groups.map(group => (
            <React.Fragment key={group.key}>
              <VehicleGroupHeader
                group={group}
                isOpen={!!opened[group.key]}
                onToggle={toggle}
                displayedStatuses={DISPLAYED_STATUSES}
                statusColors={STATUS_COLORS}
                caretIcon={ICONS.caretDown}
                groupBy={currentGroupBy}
              />

              {opened[group.key] &&
                group.vehicles.map((vehicle: Vehicle) => (
                  <VehicleItem
                    key={vehicle.id}
                    vehicle={vehicle}
                    carByStatus={CAR_BY_STATUS}
                    starGrey={ICONS.starGrey}
                    starYellow={ICONS.starYellow}
                    clockGrey={ICONS.clockGrey}
                    noSignalBlue={ICONS.noSignalBlue}
                  />
                ))}
            </React.Fragment>
          ))}
        </ScrollView>
      </Content>

      <FilterBar
        onFilterPress={onFilterPress}
        filterIcon={ICONS.filterIcon}
        totals={totals ?? EMPTY_TOTALS}
        displayedStatuses={DISPLAYED_STATUSES}
        statusColors={STATUS_COLORS}
        currentGroupBy={currentGroupBy}
      />
    </Screen>
  );
};

export default AccordionList;

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 70,
  },
});
