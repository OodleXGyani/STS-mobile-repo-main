export type VehicleStatus = 'on' | 'idle' | 'off' | 'longoff' | 'no_signal';

export interface Vehicle {
  id: number;
  key: string;
  name: string;
  driver_name: string;
  driver_rating?: number;
  location: string;
  status_time: string;
  status: VehicleStatus;
  group: string;
}

export interface VehicleGroup {
  name: string;
  summary: Record<VehicleStatus, number>;
  vehicles: Vehicle[];
}
