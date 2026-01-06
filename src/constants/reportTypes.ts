// ============================================================================
// REPORT TYPES CONSTANTS
// ============================================================================

/**
 * Available report types in the SmartTrack application
 * These constants are used for comparison, navigation, and type checking
 */

// Report Type Identifiers
export const REPORT_TYPES = {
  // Summary Reports
  DAILY_SUMMARY: 'Daily Summary Report',
  WEEKLY_SUMMARY: 'Weekly Summary Report',
  MONTHLY_SUMMARY: 'Monthly Summary Report',
  
  // Activity Reports
  TRIP_REPORT: 'Trip Report',
  POSITION_ACTIVITY: 'Position Activity Report',
  
  // Violation Reports
  SPEED_VIOLATION: 'Speed Violation Report',
  HARSH_VIOLATION: 'Harsh Violation Report',
  
  // Analysis Reports
  VEHICLE_SCORING: 'Vehicle Scoring Report',
  GEOFENCE_POLYGON: 'Geofence Polygon Report',
  
  // Path Reports
  VEHICLE_PATH: 'Vehicle Path Report',
} as const;

// Report Type Keys (for easier access)
export const REPORT_TYPE_KEYS = {
  DAILY_SUMMARY: 'DAILY_SUMMARY',
  WEEKLY_SUMMARY: 'WEEKLY_SUMMARY',
  MONTHLY_SUMMARY: 'MONTHLY_SUMMARY',
  TRIP_REPORT: 'TRIP_REPORT',
  POSITION_ACTIVITY: 'POSITION_ACTIVITY',
  SPEED_VIOLATION: 'SPEED_VIOLATION',
  HARSH_VIOLATION: 'HARSH_VIOLATION',
  VEHICLE_SCORING: 'VEHICLE_SCORING',
  GEOFENCE_POLYGON: 'GEOFENCE_POLYGON',
  VEHICLE_PATH: 'VEHICLE_PATH',
} as const;

// Report Categories
export const REPORT_CATEGORIES = {
  SUMMARY: 'SUMMARY',
  ACTIVITY: 'ACTIVITY',
  VIOLATION: 'VIOLATION',
  ANALYSIS: 'ANALYSIS',
  PATH: 'PATH',
} as const;

// Report Type to Category Mapping
export const REPORT_CATEGORY_MAP = {
  [REPORT_TYPES.DAILY_SUMMARY]: REPORT_CATEGORIES.SUMMARY,
  [REPORT_TYPES.WEEKLY_SUMMARY]: REPORT_CATEGORIES.SUMMARY,
  [REPORT_TYPES.MONTHLY_SUMMARY]: REPORT_CATEGORIES.SUMMARY,
  [REPORT_TYPES.TRIP_REPORT]: REPORT_CATEGORIES.ACTIVITY,
  [REPORT_TYPES.POSITION_ACTIVITY]: REPORT_CATEGORIES.ACTIVITY,
  [REPORT_TYPES.SPEED_VIOLATION]: REPORT_CATEGORIES.VIOLATION,
  [REPORT_TYPES.HARSH_VIOLATION]: REPORT_CATEGORIES.VIOLATION,
  [REPORT_TYPES.VEHICLE_SCORING]: REPORT_CATEGORIES.ANALYSIS,
  [REPORT_TYPES.GEOFENCE_POLYGON]: REPORT_CATEGORIES.ANALYSIS,
  [REPORT_TYPES.VEHICLE_PATH]: REPORT_CATEGORIES.PATH,
} as const;

// Report API Endpoints Mapping
export const REPORT_API_ENDPOINTS = {
  [REPORT_TYPES.DAILY_SUMMARY]: '/Reports/DailySummary',
  [REPORT_TYPES.WEEKLY_SUMMARY]: '/Reports/WeeklySummary',
  [REPORT_TYPES.MONTHLY_SUMMARY]: '/Reports/MonthlySummary',
  [REPORT_TYPES.TRIP_REPORT]: '/Reports/Trip',
  [REPORT_TYPES.POSITION_ACTIVITY]: '/Reports/History',
  [REPORT_TYPES.SPEED_VIOLATION]: '/Reports/SpeedViolation',
  [REPORT_TYPES.HARSH_VIOLATION]: '/Reports/HarshViolation',
  [REPORT_TYPES.VEHICLE_SCORING]: '/Reports/VehicleScoring',
  [REPORT_TYPES.GEOFENCE_POLYGON]: '/reports/GeofenceInPolygon',
  [REPORT_TYPES.VEHICLE_PATH]: '/Reports/VehiclePath',
} as const;

// Report Hook Names Mapping
export const REPORT_HOOK_NAMES = {
  [REPORT_TYPES.DAILY_SUMMARY]: 'useGetDailySummaryReportMutation',
  [REPORT_TYPES.WEEKLY_SUMMARY]: 'useGetWeeklySummaryReportMutation',
  [REPORT_TYPES.MONTHLY_SUMMARY]: 'useGetMonthlySummaryReportMutation',
  [REPORT_TYPES.TRIP_REPORT]: 'useGetTripSummaryReportMutation',
  [REPORT_TYPES.POSITION_ACTIVITY]: 'useGetPositionActivityReportMutation',
  [REPORT_TYPES.SPEED_VIOLATION]: 'useGetSpeedViolationReportMutation',
  [REPORT_TYPES.HARSH_VIOLATION]: 'useGetHarshViolationReportMutation',
  [REPORT_TYPES.VEHICLE_SCORING]: 'useGetVehicleScoringReportMutation',
  [REPORT_TYPES.GEOFENCE_POLYGON]: 'useGetGeofencePolygonReportMutation',
  [REPORT_TYPES.VEHICLE_PATH]: 'useGetVehiclePathReportMutation',
} as const;

// Report Component Names Mapping
export const REPORT_COMPONENT_NAMES = {
  [REPORT_TYPES.DAILY_SUMMARY]: 'DailySummaryReport',
  [REPORT_TYPES.WEEKLY_SUMMARY]: 'WeeklySummaryReport',
  [REPORT_TYPES.MONTHLY_SUMMARY]: 'MonthlySummaryReport',
  [REPORT_TYPES.TRIP_REPORT]: 'TripReport',
  [REPORT_TYPES.POSITION_ACTIVITY]: 'PositionActivityReport',
  [REPORT_TYPES.SPEED_VIOLATION]: 'SpeedViolationReport',
  [REPORT_TYPES.HARSH_VIOLATION]: 'HarshViolationReport',
  [REPORT_TYPES.VEHICLE_SCORING]: 'VehicleScoringReport',
  [REPORT_TYPES.GEOFENCE_POLYGON]: 'GeofencePolygonReport',
  [REPORT_TYPES.VEHICLE_PATH]: 'VehiclePathReport',
} as const;

// Report Navigation Routes Mapping
export const REPORT_ROUTES = {
  [REPORT_TYPES.DAILY_SUMMARY]: 'DailySummaryReport',
  [REPORT_TYPES.WEEKLY_SUMMARY]: 'WeeklySummaryReport',
  [REPORT_TYPES.MONTHLY_SUMMARY]: 'MonthlySummaryReport',
  [REPORT_TYPES.TRIP_REPORT]: 'TripReport',
  [REPORT_TYPES.POSITION_ACTIVITY]: 'PositionActivityReport',
  [REPORT_TYPES.SPEED_VIOLATION]: 'SpeedViolationReport',
  [REPORT_TYPES.HARSH_VIOLATION]: 'HarshViolationReport',
  [REPORT_TYPES.VEHICLE_SCORING]: 'VehicleScoringReport',
  [REPORT_TYPES.GEOFENCE_POLYGON]: 'GeofencePolygonReport',
  [REPORT_TYPES.VEHICLE_PATH]: 'VehiclePathReport',
} as const;

// Report Features Mapping
export const REPORT_FEATURES = {
  [REPORT_TYPES.DAILY_SUMMARY]: {
    hasMap: false,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: true,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.WEEKLY_SUMMARY]: {
    hasMap: false,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: false,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.MONTHLY_SUMMARY]: {
    hasMap: false,
    hasCharts: true,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: false,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.TRIP_REPORT]: {
    hasMap: true,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: true,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.POSITION_ACTIVITY]: {
    hasMap: true,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: true,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.SPEED_VIOLATION]: {
    hasMap: true,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: true,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.HARSH_VIOLATION]: {
    hasMap: true,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: true,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.VEHICLE_SCORING]: {
    hasMap: false,
    hasCharts: true,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: false,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.GEOFENCE_POLYGON]: {
    hasMap: true,
    hasCharts: false,
    hasExport: true,
    hasFilters: true,
    requiresDateRange: true,
    requiresVehicleSelection: true,
  },
  [REPORT_TYPES.VEHICLE_PATH]: {
    hasMap: true,
    hasCharts: false,
    hasExport: false,
    hasFilters: false,
    requiresDateRange: true,
    requiresVehicleSelection: false,
  },
} as const;

// Type Definitions
export type ReportType = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];
export type ReportTypeKey = typeof REPORT_TYPE_KEYS[keyof typeof REPORT_TYPE_KEYS];
export type ReportCategory = typeof REPORT_CATEGORIES[keyof typeof REPORT_CATEGORIES];
export type ReportHookName = typeof REPORT_HOOK_NAMES[keyof typeof REPORT_HOOK_NAMES];
export type ReportComponentName = typeof REPORT_COMPONENT_NAMES[keyof typeof REPORT_COMPONENT_NAMES];
export type ReportRoute = typeof REPORT_ROUTES[keyof typeof REPORT_ROUTES];

// Utility Functions
export const getReportCategory = (reportType: ReportType): ReportCategory => {
  return REPORT_CATEGORY_MAP[reportType];
};

export const getReportApiEndpoint = (reportType: ReportType): string => {
  return REPORT_API_ENDPOINTS[reportType];
};

export const getReportHookName = (reportType: ReportType): ReportHookName => {
  return REPORT_HOOK_NAMES[reportType];
};

export const getReportComponentName = (reportType: ReportType): ReportComponentName => {
  return REPORT_COMPONENT_NAMES[reportType];
};

export const getReportRoute = (reportType: ReportType): ReportRoute => {
  return REPORT_ROUTES[reportType];
};

export const getReportFeatures = (reportType: ReportType) => {
  return REPORT_FEATURES[reportType];
};

export const isReportType = (value: string): value is ReportType => {
  return Object.values(REPORT_TYPES).includes(value as ReportType);
};

export const getReportsByCategory = (category: ReportCategory): ReportType[] => {
  return Object.entries(REPORT_CATEGORY_MAP)
    .filter(([, cat]) => cat === category)
    .map(([reportType]) => reportType as ReportType);
};

// Array of all report types for easy iteration
export const ALL_REPORT_TYPES = Object.values(REPORT_TYPES);

// Array of all report type keys for easy iteration
export const ALL_REPORT_TYPE_KEYS = Object.values(REPORT_TYPE_KEYS);

// Array of all report categories for easy iteration
export const ALL_REPORT_CATEGORIES = Object.values(REPORT_CATEGORIES);
