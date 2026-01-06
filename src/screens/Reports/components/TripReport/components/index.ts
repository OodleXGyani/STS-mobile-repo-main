/**
 * Trip Report Components Export
 * 
 * This file exports all components related to the Trip Report feature,
 * providing a clean interface for importing components.
 */

// Main components
export { default as TripMapPage } from './TripMapPage';
export { default as LocationMarker } from './LocationMarker';

// TripMapPage sub-components and utilities
export * from './TripMapPage/types';
export * from './TripMapPage/utils';
export * from './TripMapPage/hooks';
export * from './TripMapPage/renderers';
export * from './TripMapPage/markers';
export * from './TripMapPage/styles';

// Re-export types for convenience
export type {
  TripMapData,
  TripMarker,
  TripPath,
  TripLocation,
  TripMarkerType,
  TripMetrics,
  DriverInfo,
  VehicleInfo,
  MapLayerConfig,
  MapInteractionCallbacks,
  TripMapSectionProps,
  TripReportCard,
  TripDetail,
  FleetStats,
  TripReportFilters,
  TripReportState,
} from '../types';

// Navigation is now handled by the main ReportsStackNavigator in drawer.tsx
