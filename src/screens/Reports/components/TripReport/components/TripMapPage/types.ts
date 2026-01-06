import { RouteProp } from '@react-navigation/native';
import { TripMapData } from '../../types';

/**
 * TripMapPage Type Definitions
 * 
 * This file contains all type definitions for the TripMapPage component,
 * separated for better maintainability and reusability.
 */

// Navigation types for the map page
export type TripMapPageRouteParams = {
  tripData: TripMapData;
  title?: string;
};

export type TripMapPageRouteProp = RouteProp<{
  TripMapPage: TripMapPageRouteParams;
}, 'TripMapPage'>;

// Marker component props
export interface MarkerComponentProps {
  marker: {
    id: string;
    type: 'start' | 'end' | 'waypoint' | 'stop' | 'alert';
    coordinate: {
      latitude: number;
      longitude: number;
    };
    title: string;
    description?: string;
    timestamp: string;
    address?: string;
  };
}

// Map region type
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Layer state type
export interface LayerState {
  mapLayer: string;
  showGeoFence: boolean;
  showTraffic: boolean;
}

// Formatting function types
export type TimeFormatter = (timeString: string) => string;
export type DistanceFormatter = (distance: number) => string;
export type DurationFormatter = (seconds: number) => string;
