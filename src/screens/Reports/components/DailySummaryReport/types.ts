/**
 * Daily Summary Report Types and Interfaces
 * 
 * This file contains all type definitions for the Daily Summary Report components,
 * similar to the Trip Report structure but adapted for daily summary data.
 */

// Daily summary location data structure
export interface DailyLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  address?: string;
  speed?: number;
  heading?: number;
}

// Daily summary marker types for different locations
export type DailyMarkerType = 'start' | 'end' | 'waypoint' | 'stop' | 'alert';

// Individual daily summary marker
export interface DailyMarker {
  id: string;
  type: DailyMarkerType;
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

// Daily summary path data structure
export interface DailyPath {
  id: string;
  coordinates: DailyLocation[];
  color?: string;
  strokeWidth?: number;
}

// Daily summary metrics
export interface DailyMetrics {
  totalDistance: number; // in kilometers
  totalTime: number; // in seconds
  idleTime: number; // in seconds
  maxSpeed: number; // in km/h
  averageSpeed: number; // in km/h
  stopTime: number; // in seconds
  numberOfStops: number;
  fuelConsumption?: number; // in liters
  engineHours?: number; // in hours
}

// Vehicle information for daily summary
export interface DailyVehicleInfo {
  id: string;
  plateNumber: string;
  type: string;
  status: 'on' | 'off' | 'idle' | 'moving';
  model?: string;
  year?: number;
}

// Driver information for daily summary
export interface DailyDriverInfo {
  id: string;
  name: string;
  licenseNumber?: string;
  phoneNumber?: string;
}

// Main daily summary data structure
export interface DailySummaryData {
  summaryId: string;
  date: string; // YYYY-MM-DD format
  vehicle: DailyVehicleInfo;
  driver: DailyDriverInfo;
  startTime: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  markers: DailyMarker[];
  path: DailyPath;
  metrics: DailyMetrics;
  status: 'completed' | 'in_progress' | 'cancelled';
  // Additional daily summary properties
  totalTrips?: number;
  totalStops?: number;
  workingHours?: number;
  breakTime?: number;
}

// Daily summary card for UI display
export interface DailySummaryCard {
  id: number;
  date: string;
  vehiclePlate: string;
  vehicleType: string;
  driverName: string;
  totalDistance: number;
  totalTime: number;
  idleTime: number;
  maxSpeed: number;
  totalTrips: number;
  workingHours: number;
  breakTime: number;
  operationTime: number;
  stopTime: number;
  fuelConsumption?: number;
  engineHours?: number;
  totalSpeedViolation: number; // Total Speed Violations
  // Daily summary specific data
  dailyData: {
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    totalStops: number;
    averageSpeed: number;
  }[];
}

// Fleet statistics for daily summary
export interface DailyFleetStats {
  MeanOperationTime: number;
  MeanIdleTime: number;
  MeanDistanceTravelled: number;
  MeanFuelConsumption?: number;
  MeanEngineHours?: number;
  TotalVehicles: number;
  ActiveVehicles: number;
}
