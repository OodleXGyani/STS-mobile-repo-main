/**
 * Status Normalizer
 * Handles conversion and mapping of vehicle status values
 */

// Status enum definition (will be imported from types.ts once it's updated)
export enum VehicleStatus {
  MOVING = 'Moving',
  IDLE = 'Idle',
  OFF = 'Off',
  NO_SIGNAL = 'NoSignal',
}

/**
 * Normalize vehicle status from API to canonical enum form
 * Input: "Moving", "Idle", "Off", "NoSignal" (title case from API)
 * Output: VehicleStatus enum value
 * Default: VehicleStatus.OFF
 */
export function normalizeStatus(status: string | null | undefined): VehicleStatus {
  if (!status) return VehicleStatus.OFF;

  const trimmed = status.trim();

  switch (trimmed) {
    case 'Moving':
      return VehicleStatus.MOVING;
    case 'Idle':
      return VehicleStatus.IDLE;
    case 'Off':
      return VehicleStatus.OFF;
    case 'NoSignal':
      return VehicleStatus.NO_SIGNAL;
    default:
      return VehicleStatus.OFF;
  }
}

/**
 * Get display text for status
 * Maps enum values to user-friendly labels
 */
export const STATUS_DISPLAY_NAMES: Record<VehicleStatus, string> = {
  [VehicleStatus.MOVING]: 'Running',
  [VehicleStatus.IDLE]: 'Idle',
  [VehicleStatus.OFF]: 'Engine Off',
  [VehicleStatus.NO_SIGNAL]: 'No Signal',
};

export function getStatusDisplayName(status: VehicleStatus | string): string {
  const normalized = typeof status === 'string' ? normalizeStatus(status) : status;
  return STATUS_DISPLAY_NAMES[normalized] ?? 'Unknown';
}

/**
 * Get color for status
 * Maps enum values to UI colors
 */
export const STATUS_COLORS: Record<VehicleStatus, string> = {
  [VehicleStatus.MOVING]: '#22C55E',   // Green
  [VehicleStatus.IDLE]: '#FACC15',     // Yellow
  [VehicleStatus.OFF]: '#9CA3AF',      // Grey
  [VehicleStatus.NO_SIGNAL]: '#3B82F6', // Blue
};

export function getStatusColor(status: VehicleStatus | string): string {
  const normalized = typeof status === 'string' ? normalizeStatus(status) : status;
  return STATUS_COLORS[normalized] ?? '#9CA3AF';
}

/**
 * Get icon name for status
 */
export const STATUS_ICONS: Record<VehicleStatus, string> = {
  [VehicleStatus.MOVING]: 'car-green',
  [VehicleStatus.IDLE]: 'car-yellow',
  [VehicleStatus.OFF]: 'car-grey',
  [VehicleStatus.NO_SIGNAL]: 'car-no-signal',
};

export function getStatusIcon(status: VehicleStatus | string): string {
  const normalized = typeof status === 'string' ? normalizeStatus(status) : status;
  return STATUS_ICONS[normalized] ?? 'car-grey';
}

/**
 * Check if vehicle is considered "active" (moving or idle)
 */
export function isVehicleActive(status: VehicleStatus | string): boolean {
  const normalized = typeof status === 'string' ? normalizeStatus(status) : status;
  return normalized === VehicleStatus.MOVING || normalized === VehicleStatus.IDLE;
}

/**
 * Get status icon rotation for animation
 */
export function getStatusRotation(status: VehicleStatus | string): number {
  const normalized = typeof status === 'string' ? normalizeStatus(status) : status;
  return normalized === VehicleStatus.MOVING ? 45 : 0;
}
