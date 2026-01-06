/**
 * Central metadata configuration for all reports
 * Defines which fields are required, optional, or special for each report type
 * Used for:
 * - Payload validation (which fields to include)
 * - UI field toggles (show/hide scoring weights, geofence toggle, etc.)
 * - Future extensibility (tags, categories, documentation)
 */

import { ReportName } from './reportNames';

type ReportMetaConfig = {
  // Payload configuration
  needsVehicleSelection: boolean;
  needsDateRange: boolean; // Both start AND end required
  needsExcludeGeofence: boolean;
  
  // Scoring weights (for scoring reports)
  needsScoringWeights: boolean;
  
  // Special fields
  needsCustomerId: boolean;
  needsFilterTypes: boolean;
  needsSpeedValues: boolean; // enteredSpeed, excessLimit, excessLimitPercent
  
  // UI hints
  supportsMap: boolean;
  supportsCharts: boolean;
  
  // Status
  isImplemented: boolean; // True if UI screen exists
  label: string; // Display name
  category: 'summary' | 'activity' | 'violation' | 'analysis' | 'device';
};

export const REPORT_META: Record<ReportName, ReportMetaConfig> = {
  // Existing reports (implemented with UI)
  daily: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: true,
    label: 'Daily Summary Report',
    category: 'summary',
  },
  weekly: {
    needsVehicleSelection: true,
    needsDateRange: false, // Only start time
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: true,
    label: 'Weekly Summary Report',
    category: 'summary',
  },
  monthly: {
    needsVehicleSelection: true,
    needsDateRange: false, // Only year and month
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: true,
    isImplemented: true,
    label: 'Monthly Summary Report',
    category: 'summary',
  },
  trip: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: true,
    label: 'Trip Report',
    category: 'activity',
  },
  history: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: true,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: true,
    label: 'Position Activity Report',
    category: 'activity',
  },
  speed_violation: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: true,
    needsSpeedValues: true,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: true,
    label: 'Speed Violation Report',
    category: 'violation',
  },
  harsh: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: true,
    label: 'Harsh Violation Report',
    category: 'violation',
  },
  vehicle_scoring: {
    needsVehicleSelection: true,
    needsDateRange: false, // Only date, not range
    needsExcludeGeofence: false,
    needsScoringWeights: true,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: true,
    isImplemented: true,
    label: 'Vehicle Scoring Report',
    category: 'analysis',
  },
  geofence_speed: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: true,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: true,
    label: 'Geofence Polygon Report',
    category: 'analysis',
  },
  vehicle_path: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: true,
    label: 'Vehicle Path Report',
    category: 'activity',
  },

  // New reports (not yet implemented in UI)
  idle: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Idle Report',
    category: 'device',
  },
  panic_alarm: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Panic Alarm Report',
    category: 'device',
  },
  ignition_off: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Ignition Off Report',
    category: 'device',
  },
  time_in_out: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Time In/Out Report',
    category: 'activity',
  },
  temperature: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: true,
    isImplemented: false,
    label: 'Temperature Report',
    category: 'device',
  },
  stoppage: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Stoppage Report',
    category: 'device',
  },
  untagged_driver: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Untagged Driver Report',
    category: 'activity',
  },
  outoff_workinghour: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Out of Working Hour Report',
    category: 'violation',
  },
  speed_duration: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: true,
    supportsMap: false,
    supportsCharts: true,
    isImplemented: false,
    label: 'Speed Duration Report',
    category: 'violation',
  },
  seatbelt_violation: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: false,
    isImplemented: false,
    label: 'Seatbelt Violation Report',
    category: 'violation',
  },
  driver_scoring: {
    needsVehicleSelection: false,
    needsDateRange: false,
    needsExcludeGeofence: false,
    needsScoringWeights: true,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: false,
    supportsCharts: true,
    isImplemented: false,
    label: 'Driver Scoring Report',
    category: 'analysis',
  },
  panic_button: {
    needsVehicleSelection: true,
    needsDateRange: true,
    needsExcludeGeofence: false,
    needsScoringWeights: false,
    needsCustomerId: false,
    needsFilterTypes: false,
    needsSpeedValues: false,
    supportsMap: true,
    supportsCharts: false,
    isImplemented: false,
    label: 'Panic Button Report',
    category: 'device',
  },
};

/**
 * Get metadata for a specific report name
 */
export function getReportMeta(reportName: ReportName): ReportMetaConfig {
  return REPORT_META[reportName];
}

/**
 * Get all implemented reports (have UI screens)
 */
export function getImplementedReports(): ReportName[] {
  return Object.entries(REPORT_META)
    .filter(([_, meta]) => meta.isImplemented)
    .map(([name]) => name as ReportName);
}

/**
 * Get all "coming soon" reports (don't have UI yet)
 */
export function getComingSoonReports(): ReportName[] {
  return Object.entries(REPORT_META)
    .filter(([_, meta]) => !meta.isImplemented)
    .map(([name]) => name as ReportName);
}

/**
 * Get reports by category
 */
export function getReportsByCategory(
  category: ReportMetaConfig['category']
): ReportName[] {
  return Object.entries(REPORT_META)
    .filter(([_, meta]) => meta.category === category)
    .map(([name]) => name as ReportName);
}
