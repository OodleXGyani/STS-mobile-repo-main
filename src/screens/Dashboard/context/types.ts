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

export interface StatusSummary {
  on: number;
  idle: number;
  off: number;
  longoff: number;
  overspeed: number;
  no_signal: number;
  filtered: number;
  total: number;
}

// =======================
// VEHICLE (UNCHANGED – USED EVERYWHERE)
// =======================

export interface Vehicle {
  id: number;

  // normalized fields (used by UI)
  name?: string;
  vehicle_Number?: string;

  // API fields
  unitAlias?: string;
  vehicleNumber?: string;

  status: string;

  driverName?: string;
  driverPhone?: string;
  driverEmployeeId?: string;

  speed?: string;
  speedLimit?: string;
  statusTime?: string;

  coordinates: [number, number];
  rotation?: number;
  signalStrength?: string;
  location?: string;
  vehicleType?: string;
}


// =======================
// 🔴 OLD API TYPES (KEEP FOR SAFETY)
// =======================

export interface Group {
  name: string;
  id: string;
  summary: StatusSummary;
  vehicles: string[]; // old API vehicle keys
}

export interface Area {
  name: string;
  id: string;
  summary: StatusSummary;
  vehicles: string[];
}

// =======================
// 🟢 NEW API TYPES (LiveTrack)
// =======================

export interface LiveTrackApiGroup {
  id: string;                // ✅ present in API
  name: string;
  summary: StatusSummary;    // ✅ present in API
  vehicles: Vehicle[];       // ✅ present in API
}


// =======================
// LIVE TRACK RESPONSE (HYBRID SAFE)
// =======================

export interface LiveTrackData {
  // New API
  groups: LiveTrackApiGroup[];

  // Old API (optional – don’t break screens)
  vehicles?: Vehicle[];
  areas?: Area[];

  // Shared
  location_summary?: LocationSummary[];
  vehicle_types?: VehicleTypeSummary[];
  summary?: StatusSummary;
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
// ✅ PROCESSED GROUP (USED BY UI)
// =======================

export interface ProcessedGroup {
  key: string;
  name: string;
  count: number;
  vehicles: Vehicle[];
}
