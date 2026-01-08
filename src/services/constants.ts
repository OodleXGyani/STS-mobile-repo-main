// API Base URLs
export const API_BASE_URLS = {
  // Production/Test Environment
  SMARTTRACK_API: 'https://api.smarttrack-sts.com',

  // Development/Staging Environment (if needed)
  DEV_API: 'https://api.smarttrack-sts.com',

  //New AUTH API
  TEST_API_BASE_URL: 'https://test.smarttrack-sts.com/api',


  // Local Development (if needed)
  LOCAL_API: 'http://localhost:8080/api',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login', // ✅ NEW TEST AUTH
    LOGOUT: '/auth/logout',
  }
  ,

  // Drivers
  DRIVERS: {
    BASE: '/driver',
    GET_BY_ID: '/driver/getbyid', // Keeping legacy if needed, but RESTful is /driver/{id}
    GET_PAGED: '/driver/paged',

    // NEW ENDPOINTS
    GET_LICENSE: '/driver/license',
    GET_TAGS: '/driver/tags',
    GET_DELETED: '/driver/deleted',
    GET_HISTORY: '/driver/driver-vehicle-history',
    GET_SCORING_GROUP: '/driver/driver-scoring-group',

    DELETE_ASSIGNED_VEHICLE: '/driver/delete-assigned-vehicle',
    DELETE_SCORING_GROUP: '/driver/driver-scoring-group',
    DELETE_DRIVER: '/driver',

    CREATE_DRIVER: '/driver',
    CREATE_SCORING_GROUP: '/driver/driver-scoring-group',

    UPDATE_DRIVER: '/driver',
    UNDELETE_DRIVER: '/driver/undelete-driver',
    ASSIGN_TAG: '/driver/assign-tag',
    ASSIGN_VEHICLE: '/driver/assign-vehicle',
    UPDATE_SCORING_GROUP: '/driver/driver-scoring-group',
  },

  // Vehicles
  VEHICLES: {
    BASE: '/Vehicle',
    GET_ALL: '/Vehicle',
    GET_BY_ID: '/Vehicle/getbyid',
    CREATE: '/Vehicle/create',
    UPDATE: '/Vehicle/update',
    DELETE: '/Vehicle/delete',
    GET_BY_STATUS: '/Vehicle/getbystatus',
    GET_BY_LOCATION: '/Vehicle/getbylocation',
  },

  // Dashboard
  DASHBOARD: {
    BASE: '/dashboard',
    OVERVIEW: '/dashboard/overview',
    STATISTICS: '/dashboard/statistics',
    FILTERS: '/dashboard/filters',
  },

  // LiveTrack
  LIVETRACK: {
    BASE: '/LiveTrack',
    GET_DATA: '/LiveTrack',
  },

  // Geofences
  GEOFENCES: {
    BASE: '/geofence',
    SEARCH_POI: '/geofence/search_poi',
    GET_CORDS: '/geofence/get_cords',
    GET_BY_ID: '/geofence',
    CREATE: '/geofence',
    UPDATE: '/geofence',
    DELETE: '/geofence',
  },

  // Reports
  REPORTS: {
    BASE: '/reports',
    VEHICLE_ACTIVITY: '/reports/vehicle-activity',
    DRIVER_PERFORMANCE: '/reports/driver-performance',
    POSITION_ACTIVITY: '/reports/position-activity',
  },

  // User Management
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile/update',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // System Admin
  SYSTEM_ADMIN: {
    BASE: '/system-admin',
    SETTINGS: '/system-admin/settings',
    LOGS: '/system-admin/logs',
    BACKUP: '/system-admin/backup',
  },
} as const;

// API Response Status Codes
export const API_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// API Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission for this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
} as const;

// API Request Configuration
export const API_CONFIG = {
  // Timeouts
  TIMEOUT: 30000, // 30 seconds

  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second

  // Pagination Defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Cache Configuration
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 2 * 60 * 1000, // 2 minutes
} as const;

// Environment Configuration
export const ENVIRONMENT = {
  CURRENT: 'test',

  IS_PRODUCTION: false,
  IS_DEVELOPMENT: false,
  IS_TESTING: true,
} as const;


// Helper function to get the appropriate base URL based on environment
export const getApiBaseUrl = (): string => {
  return API_BASE_URLS.TEST_API_BASE_URL;
};



// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}${endpoint}`;
};

// Type exports for better type safety
export type ApiBaseUrl = typeof API_BASE_URLS[keyof typeof API_BASE_URLS];
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export type ApiStatusCode = typeof API_STATUS_CODES[keyof typeof API_STATUS_CODES];
export type ApiErrorMessage = typeof API_ERROR_MESSAGES[keyof typeof API_ERROR_MESSAGES];
