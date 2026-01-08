// =======================
// STATUS ENUM
// =======================

/**
 * Vehicle status values as returned by the API
 * These are the canonical status values used throughout the app
 */
export enum VehicleStatus {
  MOVING = 'Moving',
  IDLE = 'Idle',
  OFF = 'Off',
  NO_SIGNAL = 'NoSignal',
}

// =======================
// CORE SHARED TYPES
// =======================

export interface LocationSummary {
  govern_name: string;
  no_vehicles: number;
  areas: {
    area_name: string;
    no_vehicles: number;
  }[];
}

export interface VehicleTypeSummary {
  vehicle_type: string;
  no_vehicles: number;
}

/**
 * StatusSummary matches the actual API response structure
 * Fields: moving, idle, off, noSignal, filtered
 * (not: on, longoff, overspeed, total)
 */
export interface StatusSummary {
  moving: number;
  idle: number;
  off: number;
  noSignal: number;
  filtered: number;
}

// =======================
// VEHICLE (API STRUCTURE)
// =======================

/**
 * Vehicle object as returned by the API
 * All fields are required as per API spec
 */
export interface Vehicle {
  // Vehicle identification
  id: number;
  unitAlias: string;                // vehicle identifier
  vehicleNumber: string;            // license plate or vehicle ID

  // Driver information
  driverName: string | null;        // null if no driver assigned
  driverPhone: string;              // phone number or "N/A"
  driverEmployeeId: string;         // employee ID or empty string

  // Status and location
  status: VehicleStatus;            // Current status (normalized to enum)
  lastStatus: VehicleStatus | null; // Previous status
  statusTime: string;               // ISO8601 timestamp

  coordinates: [number, number];    // [longitude, latitude]
  rotation: number;                 // heading in degrees (0-360)
  location: string;                 // human-readable location string

  // Vehicle details
  vehicleType: string;              // "car", "truck", etc
  signalStrength: string;           // "Strong", "Weak", etc
  fridgeTemperature: number;        // temperature in degrees (0 if N/A)

  // Speed information
  speed: string;                    // e.g. "45Km/h"
  speedLimit: string;               // e.g. "60Km/h"

  // Normalized fields for UI (optional - set by normalizer)
  name?: string;                    // display name (set from unitAlias or vehicleNumber)
  vehicle_Number?: string;          // normalized vehicle number
}

// =======================
// GROUP (ACTUAL API STRUCTURE)
// =======================

/**
 * Group object as returned by the API
 * In the current API, groups are identified by unitAlias (vehicle ID)
 * One vehicle per group typically
 */
export interface Group {
  id: string;                   // unitAlias
  name: string;                 // usually same as id
  summary: StatusSummary;       // status counts for this group
  vehicles: Vehicle[];          // direct array of vehicles
}

// =======================
// AREA (LEGACY - KEPT FOR BACKWARD COMPATIBILITY)
// =======================

export interface Area {
  name: string;
  id: string;
  summary: StatusSummary;
  vehicles: Vehicle[];
}

// =======================
// LIVE TRACK RESPONSE (API RESPONSE STRUCTURE)
// =======================

/**
 * Complete LiveTrack API response structure
 * This matches the actual API response returned by POST /LiveTrack
 */
export interface LiveTrackData {
  // Main data
  groups: Group[];
  summary: StatusSummary;

  // Optional fields from older API versions
  vehicles?: Vehicle[];
  areas?: Area[];
  location_summary?: LocationSummary[];
  vehicle_types?: VehicleTypeSummary[];
}

// =======================
// FILTER TYPES
// =======================

export interface FilterState {
  status: string[];
  location: string[];
  vehicleType: string[];
  governorateSelected?: number;
  search_text: string | null;
}

export interface StatusItem {
  key: string;
  label: string;
  count: number;
  color: string;
}

// =======================
// SORT TYPES
// =======================

export interface SortState {
  sortBy: 'name' | 'status' | 'speed';
  sortType: 'ascending' | 'descending';
  groupBy: 'status' | 'location' | 'vehicleType';
}

// =======================
// UI TYPES
// =======================

export interface UIState {
  selectedVehicle: Vehicle | null;
  selectedGroup: Group | null;
  selectedArea: Area | null;
  filterModalVisible: boolean;
  sortModalVisible: boolean;
}

// =======================
// PROCESSED GROUP (USED BY UI)
// =======================

export interface ProcessedGroup {
  key: string;
  name: string;
  count: number;
  vehicles: Vehicle[];
}
