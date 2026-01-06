/**
 * Weekly Summary Report Types and Interfaces
 * 
 * This file contains all type definitions for the Weekly Summary Report components,
 * similar to the Daily Summary Report structure but adapted for weekly summary data.
 */

// Weekly summary location data structure
export interface WeeklyLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
  speed?: number;
  heading?: number;
}

// Weekly summary marker types for different locations
export type WeeklyMarkerType = 'start' | 'end' | 'waypoint' | 'stop' | 'alert';

// Individual weekly summary marker
export interface WeeklyMarker {
  id: string;
  type: WeeklyMarkerType;
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

// Weekly summary path data structure
export interface WeeklyPath {
  id: string;
  coordinates: WeeklyLocation[];
  color?: string;
  strokeWidth?: number;
}

// Weekly summary metrics
export interface WeeklyMetrics {
  totalDistance: number; // in kilometers
  totalTime: number; // in seconds
  idleTime: number; // in seconds
  maxSpeed: number; // in km/h
  averageSpeed: number; // in km/h
  stopTime: number; // in seconds
  numberOfStops: number;
  fuelConsumption?: number; // in liters
  engineHours?: number; // in hours
  workingDays?: number; // number of working days in the week
  totalTrips?: number; // total trips in the week
}

// Vehicle information for weekly summary
export interface WeeklyVehicleInfo {
  id: string;
  plateNumber: string;
  type: string;
  status: 'on' | 'off' | 'idle' | 'moving';
  model?: string;
  year?: number;
}

// Driver information for weekly summary
export interface WeeklyDriverInfo {
  id: string;
  name: string;
  licenseNumber?: string;
  phoneNumber?: string;
}

// Main weekly summary data structure
export interface WeeklySummaryData {
  summaryId: string;
  weekStartDate: string; // YYYY-MM-DD format
  weekEndDate: string; // YYYY-MM-DD format
  vehicle: WeeklyVehicleInfo;
  driver: WeeklyDriverInfo;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  markers: WeeklyMarker[];
  path: WeeklyPath;
  metrics: WeeklyMetrics;
  status: 'completed' | 'in_progress' | 'cancelled';
  // Additional weekly summary properties
  totalTrips?: number;
  totalStops?: number;
  workingDays?: number;
  breakTime?: number;
  totalSpeedViolations?: number;
}

// Weekly summary card for UI display - matches API response structure
export interface WeeklySummaryCard {
  id?: number;
  AverageRowId: number;
  VehicleName: string;
  SummaryDate: string;
  AverageProcessDate: string;
  AverageIdleTime: number;
  AverageStopTime: number;
  AverageOperationTime: number;
  AverageGeofenceViolation: number;
  AverageSpeedOver100: number;
  AverageSpeedOver80: number;
  AverageNoOfStops: number;
  AverageNoOfIdlePeriods: number;
  AverageFuelFill: number;
  AverageFuelConsume: number;
  AverageAttachedUnitOptTime: number;
  AverageTotalDistance: number;
  SummaryRowId: number;
  SummaryProcessDate: string;
  SummaryIdleTime: number;
  SummaryStopTime: number;
  SummaryOperationTime: number;
  SummaryGeofenceViolation: number;
  SummarySpeedOver100: number;
  SummarySpeedOver80: number;
  SummaryNoOfStops: number;
  SummaryNoOfIdlePeriods: number;
  SummaryFuelFill: number;
  SummaryFuelConsume: number;
  SummaryAttachedUnitOptTime: number;
  SummaryTotalDistance: number;
  FormatedDate: string;
  DriverName: string;
}

// Fleet statistics for weekly summary
export interface WeeklyFleetStats {
  MeanOperationTime: number;
  MeanIdleTime: number;
  MeanDistanceTravelled: number;
  MeanFuelConsumption?: number;
  MeanEngineHours?: number;
  MeanWorkingDays: number;
  TotalVehicles: number;
  ActiveVehicles: number;
}
