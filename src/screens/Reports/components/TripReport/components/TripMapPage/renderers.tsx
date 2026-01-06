import React from 'react';
import { Polyline, UrlTile } from 'react-native-maps';
import { Colors } from '../../../../../../constants/colors';
import { TripMapData, TripMarker, TripPath } from '../../types';
import { StartMarker, EndMarker, WaypointMarker } from './markers';
import { MapLayerMenuState } from '../../../../../Dashboard/components/Maps/components/MapSortMenue/MapLayerMenueTypes';

/**
 * TripMapPage Renderer Functions
 * 
 * This file contains renderer functions for the TripMapPage component,
 * separated for better maintainability and reusability.
 */

/**
 * Render map layers based on layer state
 * Reference: src/screens/Dashboard/components/Maps/Map.tsx lines 130-196
 */
export const renderMapLayers = (menuState: MapLayerMenuState) => {
  return (
    <>
      {/* Google Maps Layer */}
      {menuState.mapLayer === 'google' && (
        <>
          {/* Standard Google Maps - no additional tiles needed */}
        </>
      )}

      {/* STS Transparent Tiles */}
      {menuState.mapLayer === 'stsTransparent' && (
        <UrlTile
          urlTemplate="https://maps.smarttrack-sts.com/sts_trans/{z}/{x}/{y}.png"
          maximumZ={19}
          minimumZ={0}
          zIndex={1}
          tileSize={256}
          flipY={false}
        />
      )}

      {/* STS Full Tiles */}
      {menuState.mapLayer === 'sts' && (
        <UrlTile
          urlTemplate="https://maps.smarttrack-sts.com/sts_full/{z}/{x}/{y}.png"
          maximumZ={19}
          minimumZ={0}
          zIndex={0}
          tileSize={256}
          flipY={false}
        />
      )}

      {/* STS Hybrid Tiles - STS map in satellite view */}
      {menuState.mapLayer === 'stsHybrid' && (
        <UrlTile
          urlTemplate="https://maps.smarttrack-sts.com/sts_full/{z}/{x}/{y}.png"
          maximumZ={19}
          minimumZ={0}
          zIndex={0}
          tileSize={256}
          flipY={false}
        />
      )}
    </>
  );
};

/**
 * Render trip markers based on type
 * Reference: IgMap documentation for custom templates and marker types
 */
export const renderTripMarkers = (tripData: TripMapData) => {
  return tripData.markers.map((marker) => {
    switch (marker.type) {
      case 'start':
        return (
          <StartMarker
            key={marker.id}
            marker={marker}
          />
        );
      case 'end':
        return (
          <EndMarker
            key={marker.id}
            marker={marker}
          />
        );
      // case 'waypoint':
      //   return (
      //     <WaypointMarker
      //       key={marker.id}
      //       marker={marker}
      //     />
      //   );
      default:
        return null;
    }
  });
};

/**
 * Render trip path polyline
 * Reference: dashboard map polyline implementation
 */
export const renderTripPath = (tripData: TripMapData, onPathPress: () => void) => {
  if (tripData.path.coordinates.length < 2) return null;

  const coordinates = tripData.path.coordinates.map(coord => ({
    latitude: coord.latitude,
    longitude: coord.longitude,
  }));

  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={tripData.path.color || Colors.primary_blue_color}
      strokeWidth={tripData.path.strokeWidth || 4}
      onPress={onPathPress}
    />
  );
};
