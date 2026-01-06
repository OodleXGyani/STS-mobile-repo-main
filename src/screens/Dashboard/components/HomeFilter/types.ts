export interface FilterState {
  status: string[];
  location: string[];
  vehicleType: string[];
  governorateSelected: number;
}

export interface StatusItem {
  key: string;
  label: string;
  count: number;
  color: string;
}

export interface LocationSummary {
  govern_name: string;
  no_vehicles: number;
  areas: Array<{
    area_name: string;
    no_vehicles: number;
  }>;
}

export interface VehicleType {
  vehicle_type: string;
  no_vehicles: number;
}

export interface FilterData {
  summary: {
    on: number;
    idle: number;
    off: number;
    longoff: number;
    no_signal: number;
  };
  locationSummary: LocationSummary[];
  vehicleTypes: VehicleType[];
}

export interface FilterActions {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  onReset: () => void;
}
