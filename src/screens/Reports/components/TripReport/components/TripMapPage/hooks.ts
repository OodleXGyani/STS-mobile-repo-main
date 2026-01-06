import { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MapLayerMenuState } from '../../../../../Dashboard/components/Maps/components/MapSortMenue/MapLayerMenueTypes';
import { TripMapData, TripMarker, TripPath } from '../../types';
import { calculateMapRegion, logDebugInfo } from './utils';

/**
 * TripMapPage Custom Hooks
 * 
 * This file contains custom hooks for the TripMapPage component,
 * separated for better maintainability and reusability.
 */

/**
 * Hook for managing map layer state
 */
export const useMapLayerState = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuState, setMenuState] = useState<MapLayerMenuState>({
    mapLayer: 'google',
    showGeoFence: false,
    showTraffic: false,
  });

  return {
    menuVisible,
    setMenuVisible,
    menuState,
    setMenuState,
  };
};

/**
 * Hook for managing map region calculation
 */
export const useMapRegion = (tripData: TripMapData) => {
  const mapRegion = useMemo(() => {
    return calculateMapRegion(tripData);
  }, [tripData.path.coordinates]);

  return mapRegion;
};

/**
 * Hook for handling navigation actions
 */
export const useNavigationHandlers = () => {
  const navigation = useNavigation();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    handleBackPress,
  };
};

/**
 * Hook for handling marker interactions
 */
export const useMarkerHandlers = () => {
  const handleMarkerPress = useCallback((marker: TripMarker) => {
    logDebugInfo('Marker pressed:', marker);
    // Could show additional info modal or navigate to marker details
  }, []);

  return {
    handleMarkerPress,
  };
};

/**
 * Hook for handling path interactions
 */
export const usePathHandlers = (tripData: TripMapData) => {
  const handlePathPress = useCallback(() => {
    logDebugInfo('Path pressed:', tripData.path);
    // Could show path details or statistics
  }, [tripData.path]);

  return {
    handlePathPress,
  };
};
