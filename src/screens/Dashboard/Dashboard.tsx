import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import AppHeader from '../../components/Header';
import HomeTabs from './components/HomeTab';
import MapListView from './components/Maps/Map';
import AccordionList from './components/AccordianList/AccordionList';
import HomeFilter from './components/HomeFilter/HomeFilter';
import { SelectVehiclePopup } from './components/VehicleSelectFilter';

import {
  DashboardProvider,
  useDashboardLiveTrack,
  useDashboardFilters,
  useDashboardProcessedGroups,
} from './context';

import { Vehicle } from './context/types';

// =======================
// STYLED COMPONENTS
// =======================

const LoadingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #ffffff;
  margin: 16px 18px 0 18px;
  border-radius: 8px;
`;

// =======================
// DASHBOARD CONTENT
// =======================

const DashboardContent: React.FC = () => {
  const [tabActive, setTabActive] = useState<'list' | 'map'>('list');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const hasInitializedSelection = useRef(false);

  const { liveTrackLoading, fetchLiveTrackData } =
    useDashboardLiveTrack();

  const { filterModalVisible, setFilterModalVisible } =
    useDashboardFilters();

  const { processedGroups } = useDashboardProcessedGroups();

  // =======================
  // DERIVED VEHICLES (NEW API)
  // =======================

  const availableVehicles = useMemo<Vehicle[]>(() => {
    return processedGroups.flatMap(group => group.vehicles);
  }, [processedGroups]);

  // =======================
  // FILTER HANDLERS
  // =======================

  const handleFilterClose = useCallback(() => {
    setFilterModalVisible(false);
  }, [setFilterModalVisible]);

  const handleFilterApply = useCallback(() => {
    setFilterModalVisible(false);
  }, [setFilterModalVisible]);

  const handleFilterReset = useCallback(() => {
    // Optional reset logic if needed
  }, []);

  // =======================
  // VEHICLE SELECTOR
  // =======================

  const openVehicleSelector = () => {
    setShowVehicleSelector(true);
  };

  const closeVehicleSelector = () => {
    setShowVehicleSelector(false);
  };

  const handleVehicleConfirm = (vehicles: Vehicle[]) => {
    setSelectedVehicles(vehicles);
    setShowVehicleSelector(false);
  };

  // =======================
  // EFFECTS
  // =======================

  useEffect(() => {
    fetchLiveTrackData();
  }, [fetchLiveTrackData]);

  useEffect(() => {
    if (
      availableVehicles.length > 0 &&
      !hasInitializedSelection.current
    ) {
      setSelectedVehicles(availableVehicles);
      hasInitializedSelection.current = true;
    }
  }, [availableVehicles]);

  // =======================
  // LOADING / EMPTY STATES
  // =======================

  if (liveTrackLoading && processedGroups.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          tabActive={tabActive}
          onVehicleSelect={openVehicleSelector}
        />
        <View style={styles.screen}>
          <HomeTabs
            tabActive={tabActive}
            onTabPress={setTabActive}
          />
          <LoadingContainer>
            <ActivityIndicator size="small" color="#003459" />
          </LoadingContainer>
        </View>
      </SafeAreaView>
    );
  }

  // =======================
  // RENDER
  // =======================

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        tabActive={tabActive}
        onVehicleSelect={openVehicleSelector}
      />

      <View style={styles.screen}>
        <HomeTabs
          tabActive={tabActive}
          onTabPress={setTabActive}
        />

        {tabActive === 'map' ? (
          <MapListView
            selectedVehicles={selectedVehicles}
            onFilterPress={() => setFilterModalVisible(true)}
          />
        ) : (
          <AccordionList
            onFilterPress={() => setFilterModalVisible(true)}
          />
        )}
      </View>

      {filterModalVisible && (
        <HomeFilter
          onClose={handleFilterClose}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
      )}

      <SelectVehiclePopup
        visible={showVehicleSelector}
        vehicles={availableVehicles}
        selectedVehicles={selectedVehicles}
        onClose={closeVehicleSelector}
        onConfirm={handleVehicleConfirm}
        maxSelection={10}
      />
    </SafeAreaView>
  );
};

// =======================
// WRAPPER
// =======================

const Dashboard: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;

// =======================
// STYLES
// =======================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#003459',
  },
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
