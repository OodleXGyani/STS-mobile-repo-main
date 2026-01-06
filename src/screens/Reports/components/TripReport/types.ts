/**
 * Trip Report Types and Interfaces
 * 
 * This file contains all type definitions for the Trip Report components,
 * including the TripMapSection and related data structures.
 * 
 * Based on the trip summary report documentation structure and
 * dashboard map component patterns.
 * 
 * References:
 * - Trip Summary Documentation: TRIP_SUMMARY_REPORT_DOCUMENTATION.md
 * - Dashboard Map Types: src/screens/Dashboard/components/Maps/components/MapSortMenue/MapLayerMenueTypes.ts
 * - Vehicle Types: src/screens/Dashboard/components/VehicleSelectFilter/types.ts
 */

// Trip location data structure
export interface TripLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
  speed?: number;
  heading?: number;
}

// Trip marker types for different locations
export type TripMarkerType = 'start' | 'end' | 'waypoint' | 'stop' | 'alert';

// Individual trip marker
export interface TripMarker {
  id: string;
  type: TripMarkerType;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description?: string;
  timestamp: string;
  address?: string;
  speed?: number;
  heading?: number;
  // Additional marker properties
  icon?: string;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

// Trip path data structure
export interface TripPath {
  id: string;
  coordinates: TripLocation[];
  color?: string;
  strokeWidth?: number;
  strokePattern?: number[]; // For dashed lines
  zIndex?: number;
}

// Trip statistics and metrics
export interface TripMetrics {
  totalDistance: number; // in kilometers
  totalTime: number; // in seconds
  idleTime: number; // in seconds
  maxSpeed: number; // in km/h
  averageSpeed: number; // in km/h
  stopTime: number; // in seconds
  numberOfStops: number;
  fuelConsumption?: number; // in liters
}

// Driver information
export interface DriverInfo {
  id: string;
  name: string;
  licenseNumber?: string;
  phoneNumber?: string;
  email?: string;
}

// Vehicle information
export interface VehicleInfo {
  id: string;
  plateNumber: string;
  type: string;
  model?: string;
  year?: number;
  color?: string;
  status: 'on' | 'off' | 'idle' | 'running' | 'start' | 'stop' | 'no_signal' | 'longoff';
}

// Complete trip data structure
export interface TripMapData {
  tripId: string;
  vehicle: VehicleInfo;
  driver: DriverInfo;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  markers: TripMarker[];
  path: TripPath;
  metrics: TripMetrics;
  // Additional trip properties
  status: 'completed' | 'in_progress' | 'cancelled';
  route?: string; // Route name or description
  purpose?: string; // Trip purpose
  notes?: string; // Additional notes
  // Legacy properties for backward compatibility
  vehiclePlate?: string;
  driverName?: string;
  totalDistance?: number;
  totalTime?: number;
}

// Map layer configuration
export interface MapLayerConfig {
  type: 'google' | 'sts' | 'stsTransparent' | 'stsHybrid';
  showTraffic: boolean;
  showGeofences: boolean;
  showBuildings: boolean;
  showLabels: boolean;
}

// Map interaction callbacks
export interface MapInteractionCallbacks {
  onMarkerPress?: (marker: TripMarker) => void;
  onPathPress?: (path: TripPath) => void;
  onRegionChange?: (region: any) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
}

// TripMapSection component props
export interface TripMapSectionProps {
  tripData: TripMapData;
  initialRegion?: any;
  mapHeight?: number;
  showLayerSelector?: boolean;
  showTripInfo?: boolean;
  showMetrics?: boolean;
  layerConfig?: Partial<MapLayerConfig>;
  callbacks?: MapInteractionCallbacks;
  // Styling options
  customStyles?: {
    containerStyle?: any;
    mapStyle?: any;
    headerStyle?: any;
    markerStyle?: any;
  };
}

// Trip report card data structure
export interface TripReportCard {
  id: string;
  vehiclePlate: string;
  vehicleType: string;
  driverName: string;
  totalTrips: number;
  totalDistance: number;
  totalTime: number;
  idleTime: number;
  maxSpeed: number;
  trips: TripDetail[];
}

// Individual trip detail
export interface TripDetail {
  id: string;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  maxSpeed: number;
  idleTime: number;
  // Map data for this specific trip
  mapData?: TripMapData;
}

// Fleet statistics
export interface FleetStats {
  MeanOperationTime: number;
  MeanIdleTime: number;
  MeanDistanceTravelled: number;
  totalVehicles: number;
  totalTrips: number;
  totalDistance: number;
  averageSpeed: number;
}

// Trip report filter options
export interface TripReportFilters {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  vehicles: string[]; // Vehicle IDs
  drivers?: string[]; // Driver IDs
  status?: ('completed' | 'in_progress' | 'cancelled')[];
  minDistance?: number;
  maxDistance?: number;
  minDuration?: number;
  maxDuration?: number;
}

// Trip report state
export interface TripReportState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  data: TripReportCard[];
  filters: TripReportFilters;
  selectedTrip?: TripMapData;
  mapVisible: boolean;
}

// Export utility types
export type TripStatus = TripMapData['status'];
export type VehicleStatus = VehicleInfo['status'];
export type MarkerType = TripMarkerType;

// Constants for trip markers
export const TRIP_MARKER_TYPES = {
  START: 'start' as const,
  END: 'end' as const,
  WAYPOINT: 'waypoint' as const,
  STOP: 'stop' as const,
  ALERT: 'alert' as const,
} as const;

// Constants for vehicle statuses
export const VEHICLE_STATUSES = {
  ON: 'on' as const,
  OFF: 'off' as const,
  IDLE: 'idle' as const,
  RUNNING: 'running' as const,
  START: 'start' as const,
  STOP: 'stop' as const,
  NO_SIGNAL: 'no_signal' as const,
  LONGOFF: 'longoff' as const,
} as const;

// Constants for trip statuses
export const TRIP_STATUSES = {
  COMPLETED: 'completed' as const,
  IN_PROGRESS: 'in_progress' as const,
  CANCELLED: 'cancelled' as const,
} as const;

// Default map layer configuration
export const DEFAULT_MAP_LAYER_CONFIG: MapLayerConfig = {
  type: 'google',
  showTraffic: false,
  showGeofences: false,
  showBuildings: true,
  showLabels: true,
};

// Default trip metrics
export const DEFAULT_TRIP_METRICS: TripMetrics = {
  totalDistance: 0,
  totalTime: 0,
  idleTime: 0,
  maxSpeed: 0,
  averageSpeed: 0,
  stopTime: 0,
  numberOfStops: 0,
  fuelConsumption: 0,
};
