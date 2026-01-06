/**
 * Centralized report name mapping for unified /report-requests API
 * 
 * Maps internal report type constants to API report_name identifiers
 * Uses 'as const' for strict type safety
 * 
 * This is the single source of truth for which report_name to send to backend
 */

// Existing 10 reports
const EXISTING_REPORTS = {
  DAILY_SUMMARY: 'daily',
  WEEKLY_SUMMARY: 'weekly',
  MONTHLY_SUMMARY: 'monthly',
  TRIP_REPORT: 'trip',
  POSITION_ACTIVITY: 'history',
  SPEED_VIOLATION: 'speed_violation',
  HARSH_VIOLATION: 'harsh',
  VEHICLE_SCORING: 'vehicle_scoring',
  GEOFENCE_POLYGON: 'geofence_speed',
  VEHICLE_PATH: 'vehicle_path',
} as const;

// New 12 reports from API docs (not yet implemented in UI)
const NEW_REPORTS = {
  IDLE_REPORT: 'idle',
  PANIC_ALARM_REPORT: 'panic_alarm',
  IGNITION_OFF_REPORT: 'ignition_off',
  TIME_IN_OUT_REPORT: 'time_in_out',
  TEMPERATURE_REPORT: 'temperature',
  STOPPAGE_REPORT: 'stoppage',
  UNTAGGED_DRIVER_REPORT: 'untagged_driver',
  OUT_OF_WORKING_HOUR_REPORT: 'outoff_workinghour',
  SPEED_DURATION_REPORT: 'speed_duration',
  SEATBELT_VIOLATION_REPORT: 'seatbelt_violation',
  DRIVER_SCORING_REPORT: 'driver_scoring',
  PANIC_BUTTON_REPORT: 'panic_button',
} as const;

/**
 * Master mapping from internal report type to API report_name
 * Used in buildReportPayload() to set report_name field
 * 
 * ✅ Uses 'as const' for strict literal typing
 * ✅ Ensures no string widening or typos
 * ✅ Single source of truth for API names
 */
export const REPORT_NAME_MAP = {
  ...EXISTING_REPORTS,
  ...NEW_REPORTS,
} as const;

/**
 * Derive strict union type from REPORT_NAME_MAP
 * This type ensures only valid report names are used
 * 
 * Example: 
 *   type ReportName = 'daily' | 'weekly' | 'monthly' | ... (all 22 names)
 */
export type ReportName = typeof REPORT_NAME_MAP[keyof typeof REPORT_NAME_MAP];

/**
 * Type guard to validate if a string is a valid report name
 */
export function isValidReportName(value: unknown): value is ReportName {
  const validNames = Object.values(REPORT_NAME_MAP);
  return typeof value === 'string' && validNames.includes(value as ReportName);
}

/**
 * Get report name by internal key
 */
export function getReportName(key: keyof typeof REPORT_NAME_MAP): ReportName {
  return REPORT_NAME_MAP[key];
}

/**
 * Get all implemented report names (existing 10 reports with UI)
 */
export function getImplementedReportNames(): ReportName[] {
  return Object.values(EXISTING_REPORTS);
}

/**
 * Get all new report names (future 12 reports without UI yet)
 */
export function getNewReportNames(): ReportName[] {
  return Object.values(NEW_REPORTS);
}

/**
 * Check if a report name is from the existing/implemented set
 */
export function isImplementedReport(reportName: ReportName): boolean {
  return getImplementedReportNames().includes(reportName);
}
