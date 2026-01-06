import { api } from "./api";
import { buildSmarttrack2Url } from "./smarttrack2Config";

// Report item interface matching API response fields
export interface ReportItem {
  id: number;
  name: string;
  description: string | null;
  title: string;
  template: string;
}

// Reports API response - assuming array directly returned (no pagination fields shown)
export interface ReportResponse {
  items: ReportItem[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}


// Params for the reports API - supports pagination and optional searchText
export interface GetReportsParams {
  pageIndex?: number;
  pageSize?: number;
  searchText?: string;
}

// Payload for dynamic report POST request
export interface ReportPayload {
  DataType: string; // e.g. "vehicle"
  EndDate: string; // e.g. "#08/27/2025 11:59:59 PM#"
  ExcludeGeofence: boolean;
  Items: string; // CSV of device names or IDs
  Period: string; // e.g. "2"
  StartDate: string; // e.g. "#08/27/2025 12:00:00 AM#"
}

// Response for dynamic report POST request
export interface ReportResponseData {
  Id: number;
  HistoryData: any[]; // Replace with more precise typing if available
}

// Params for GetReport query
export interface GetReportParams {
  id: number;
  type: string;
  pageIndex?: number;
  pageSize?: number;
  searchText?: string;
}

// Response for GetReport query
export interface GetReportResponse {
  Items: any[]; // Use precise item type if possible
  TotalCount: number;
  PageIndex: number;
  PageSize: number;
}

// Specific report payload interfaces
export interface DailySummaryPayload {
  startDate: string;
  endDate: string;
  vehicle: string;
}

export interface WeeklySummaryPayload {
  startDate: string;
  vehicle: string;
}

export interface MonthlySummaryPayload {
  startDate: string;
  vehicle: string;
}

export interface TripSummaryPayload {
  startDate: string;
  endDate: string;
  items: number[];  // Array of integer vehicle IDs (not comma-separated string)
  datatype: "vehicle" | "driver";
}

export interface PositionActivityPayload {
  startTime: string;      // ISO 8601 format: 2025-11-06T00:00:00Z
  endTime: string;        // ISO 8601 format: 2025-11-07T23:59:00Z
  items: number[];        // Array of integer vehicle IDs
  reportType: 'vehicle';  // Backend expects 'vehicle' not 'PositionActivity'
  excludeGeofence: boolean;  // Boolean false for default behavior
}

export interface SpeedViolationPayload {
  StartDate: string;
  EndDate: string;
  ReportType: "overspeedkm" | "excesslimit_precentage" | "overspeed_and_excesslimit";
  InputValue: string;
  Items: string | number[];  // Can be comma-separated string or array of vehicle IDs
  DataType: "Vehicle" | "Driver";
}

export interface HarshViolationPayload {
  StartDate: string;
  EndDate: string;
  DataType: "Vehicle" | "Driver";
  Items: string | number[];  // Can be comma-separated string or array of vehicle IDs
}

export interface VehicleScoringPayload {
  scoreDate: string;
  vehicle: string;
  f1_OverSpeeding: number;
  f2_ExcessOverSpeeding: number;
  f3_SeatBleatViolation: number;
  f4_HarshCornering: number;
  f5_HarshBraking: number;
}

export interface GeofencePolygonPayload {
  StartDate: string;
  EndDate: string;
  Vehicle: string;
}

export interface VehiclePathPayload {
  Vehicle: string;
  StartDate: string;
  EndDate: string;
}

// Specific report response interfaces
export interface DailySummaryResponse {
  data: {
    id: null;
    DailySummaryModelList: any[];
  };
}

export interface WeeklySummaryResponse {
  data: {
    id: null;
    WeeklySummaryModelList: any[];
  };
}

export interface MonthlySummaryResponse {
  data: {
    id: null;
    SummaryMonthlyData: any[];
    MonthlyFleetStatistics: any[];
  };
}

export interface TripSummaryResponse {
  data: {
    TripData: any[];
  };
}

export interface PositionActivityResponse {
  id: number;
  status: 'Queued' | 'Processing' | 'Done' | 'Failed';
  result?: any[];
  errorMessage?: string;
}

export interface SpeedViolationResponse {
  data: {
    SpeedViolationData: any[];
  };
}

export interface HarshViolationResponse {
  data: {
    HarshViolationData: any[];
  };
}

export interface VehicleScoringResponse {
  data: {
    VehicleScoringData: any[];
  };
}

export interface GeofencePolygonResponse {
  data: {
    GeofenceData: any[];
  };
}

export interface VehiclePathResponse {
  data: any[];
}

// Report job request/response types for async queued reports
export interface ReportJobResponse {
  id: number;
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed';
  reportName: string;
  result: null; // Always null on initial POST
  errorMessage: string | null;
}

export interface ReportJobStatusResponse {
  id: number;
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed';
  reportName: string;
  result?: any; // Contains final data when status = 'Completed'
  errorMessage?: string;
}

// Create a separate API instance for reports with custom base query
export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccessibleReports: builder.query<ReportResponse, GetReportsParams>({
      query: ({ pageIndex = 1, pageSize = 10, searchText = "" } = {}) => ({
        url: '/reports',
        method: "GET",
        params: { pageIndex, pageSize, searchText },
      }),
    }),


    postReport: builder.mutation<ReportResponseData, { reportType: string; payload: ReportPayload }>({
      query: ({ reportType, payload }) => ({
        url: `/smarttrack2/report/reports/${reportType}`,
        method: "POST",
        body: payload,
      }),
    }),
    getReport: builder.query<GetReportResponse, GetReportParams>({
      query: ({ id, type, pageIndex = 1, pageSize = 10, searchText = "." }) => ({
        url: "/smarttrack2/report/reports/GetReport",
        method: "GET",
        params: { id, type, pageIndex, pageSize, searchText },
      }),
    }),

    // All report endpoints use /report-requests
    // Daily Summary Report
    getDailySummaryReport: builder.mutation<DailySummaryResponse, DailySummaryPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'daily',
          payload: params,
        },
      }),
    }),
    // Weekly Summary Report
    getWeeklySummaryReport: builder.mutation<WeeklySummaryResponse, WeeklySummaryPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'weekly',
          payload: params,
        },
      }),
    }),
    // Monthly Summary Report
    getMonthlySummaryReport: builder.mutation<MonthlySummaryResponse, MonthlySummaryPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'monthly',
          payload: params,
        },
      }),
    }),
    // Trip Summary Report
    getTripSummaryReport: builder.mutation<TripSummaryResponse, TripSummaryPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'trip',
          payload: params,
        },
      }),
    }),
    // Position Activity Report
    getPositionActivityReport: builder.mutation<PositionActivityResponse, PositionActivityPayload>({
      query: (params) => {
        // Backend expects: { report_name: "history", payload: { startTime, endTime, items, reportType, excludeGeofence } }
        const fullPayload = {
          report_name: 'history',  // Backend expects 'history' for position activity reports
          payload: {
            startTime: params.startTime,
            endTime: params.endTime,
            items: params.items,
            reportType: params.reportType,  // Backend expects 'vehicle'
            excludeGeofence: params.excludeGeofence,
          },
        };
        console.log('📤 Position Activity POST /report-requests payload:', fullPayload);
        return {
          url: '/report-requests',
          method: "POST",
          body: fullPayload,
        };
      },
    }),
    // Speed Violation Report
    getSpeedViolationReport: builder.mutation<SpeedViolationResponse, SpeedViolationPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'speed_violation',
          payload: params,
        },
      }),
    }),
    // Harsh Violation Report
    getHarshViolationReport: builder.mutation<HarshViolationResponse, HarshViolationPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'harsh',
          payload: params,
        },
      }),
    }),
    // Vehicle Scoring Report
    getVehicleScoringReport: builder.mutation<VehicleScoringResponse, VehicleScoringPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'vehicle_scoring',
          payload: params,
        },
      }),
    }),
    // Geofence Polygon Report
    getGeofencePolygonReport: builder.mutation<GeofencePolygonResponse, GeofencePolygonPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'geofence_speed',
          payload: params,
        },
      }),
    }),
    // Vehicle Path Report
    getVehiclePathReport: builder.mutation<VehiclePathResponse, VehiclePathPayload>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'vehicle_path',
          payload: params,
        },
      }),
    }),
    // Idle Report
    getIdleReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'idle',
          payload: params,
        },
      }),
    }),
    // Panic Alarm Report
    getPanicAlarmReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'panic_alarm',
          payload: params,
        },
      }),
    }),
    // Ignition Off Report
    getIgnitionOffReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'ignition_off',
          payload: params,
        },
      }),
    }),
    // Time In/Out Report
    getTimeInOutReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'time_in_out',
          payload: params,
        },
      }),
    }),
    // Temperature Report
    getTemperatureReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'temperature',
          payload: params,
        },
      }),
    }),
    // Stoppage Report
    getStoppageReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'stoppage',
          payload: params,
        },
      }),
    }),
    // Untagged Driver Report
    getUntaggedDriverReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'untagged_driver',
          payload: params,
        },
      }),
    }),
    // Out of Working Hour Report
    getOutOfWorkingHourReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'outoff_workinghour',
          payload: params,
        },
      }),
    }),
    // Speed Duration Report
    getSpeedDurationReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'speed_duration',
          payload: params,
        },
      }),
    }),
    // Seatbelt Violation Report
    getSeatbeltViolationReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'seatbelt_violation',
          payload: params,
        },
      }),
    }),
    // Driver Scoring Report
    getDriverScoringReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'driver_scoring',
          payload: params,
        },
      }),
    }),
    // Panic Button Report
    getPanicButtonReport: builder.mutation<any, any>({
      query: (params) => ({
        url: '/report-requests',
        method: "POST",
        body: {
          report_name: 'panic_button',
          payload: params,
        },
      }),
    }),
    // Poll report job status for async queued reports
    getReportJobStatus: builder.query<ReportJobStatusResponse, number>({
      query: (jobId) => ({
        url: `/report-requests/${jobId}`,
        method: "GET",
      }),
      pollingInterval: 0, // We control polling manually in the service
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAccessibleReportsQuery,
  usePostReportMutation,
  useGetReportQuery,
  useGetDailySummaryReportMutation,
  useGetWeeklySummaryReportMutation,
  useGetMonthlySummaryReportMutation,
  useGetTripSummaryReportMutation,
  useGetPositionActivityReportMutation,
  useGetSpeedViolationReportMutation,
  useGetHarshViolationReportMutation,
  useGetVehicleScoringReportMutation,
  useGetGeofencePolygonReportMutation,
  useGetVehiclePathReportMutation,
  useGetIdleReportMutation,
  useGetPanicAlarmReportMutation,
  useGetIgnitionOffReportMutation,
  useGetTimeInOutReportMutation,
  useGetTemperatureReportMutation,
  useGetStoppageReportMutation,
  useGetUntaggedDriverReportMutation,
  useGetOutOfWorkingHourReportMutation,
  useGetSpeedDurationReportMutation,
  useGetSeatbeltViolationReportMutation,
  useGetDriverScoringReportMutation,
  useGetPanicButtonReportMutation,
  useGetReportJobStatusQuery,
} = reportsApi;
