import { ReactNode } from "react";

export type DashboardStackParamList = {
  DashboardMain: undefined;
  DetailPage: { 
    item: Vehicle
  };
};

export type DrawerParamList = {
  Home: undefined;
  Settings: undefined;
};

export type VehicleStatus = 'on' | 'idle' | 'off' | 'longoff' | 'no_signal';

export type Vehicle = {
  id: number;
  key: string;
  name: string;
  driver_name: string | null;
  driver_phone: string;
  driver_employee_id: string;
  speed: string;
  speed_limit: string;
  status_time: string;
  coordinates: [number, number];
  has_signal: boolean;
  rotation: number;
  radius: string;
  status: VehicleStatus;
  signal_strength: string;
  location: string;
  location_full: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_Number: string;
  vehicle_last_registration_date: string | null;
  vehicle_next_registration_date: string | null;
  area: string;
  block: string;
  road: string | null;
  temperature: number;
};
