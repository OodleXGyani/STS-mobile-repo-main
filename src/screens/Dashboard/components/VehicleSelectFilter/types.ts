// =======================
// VEHICLE STATUS (NEW API)
// =======================

export type VehicleStatus =
  | 'Moving'
  | 'Idle'
  | 'Off'
  | 'NoSignal'
  | 'Overspeed';

// =======================
// VEHICLE MODEL (MATCHES API 1:1)
// =======================

export interface Vehicle {
  id: number;

  // Identifiers
  unitAlias: string;
  vehicleNumber: string;

  // Driver info
  driverName?: string | null;
  driverPhone?: string;
  driverEmployeeId?: string;

  // Movement / status
  speed: string;
  speedLimit: string;
  statusTime: string;
  status: VehicleStatus;
  signalStrength: string;

  // Location
  coordinates: [number, number];
  rotation: number;
  location: string;

  // Vehicle info
  vehicleType: string;

  // Optional
  fridgeTemperature?: number;
}

// =======================
// POPUP PROPS
// =======================

export interface SelectVehiclePopupProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedVehicles: Vehicle[]) => void;
  selectedVehicles?: Vehicle[];
  maxSelection?: number;
  vehicles?: Vehicle[];
}
