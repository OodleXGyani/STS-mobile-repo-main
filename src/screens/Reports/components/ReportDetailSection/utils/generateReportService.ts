/**
 * Report generation service
 *
 * Consolidates all report generation logic with:
 * - Unified mutation calls
 * - Integrated retry mechanism for weekly summary
 * - Error handling and propagation
 */

import { useSelector } from 'react-redux';
import { selectCustomerId } from '../../../../../store/authSlice';
import { REPORT_TYPES, ReportType } from '../../../../../constants/reportTypes';
import {
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
  useGetReportJobStatusQuery,
  DailySummaryPayload,
  WeeklySummaryPayload,
  MonthlySummaryPayload,
  TripSummaryPayload,
  PositionActivityPayload,
  SpeedViolationPayload,
  HarshViolationPayload,
  VehicleScoringPayload,
  GeofencePolygonPayload,
  VehiclePathPayload,
  ReportJobStatusResponse,
} from '../../../../../services/reports';
import { buildReportPayload } from './buildReportPayload';
import { getApiBaseUrl } from '../../../../../services/constants';
import * as Keychain from 'react-native-keychain';

// ============================================================================
// POLLING CONFIGURATION FOR ASYNC QUEUED REPORTS
// ============================================================================

/**
 * Polling configuration for report job status checks
 */
const POLLING_CONFIG = {
  INTERVAL_MS: 4000,        // Poll every 4 seconds
  MAX_DURATION_MS: 40000,   // Max 40 seconds total
};

/**
 * Report job status enum
 *
 * Per specification, "Done" is the ONLY success state
 * "Completed" is NOT accepted
 */
enum JobStatus {
  QUEUED = 'Queued',
  PROCESSING = 'Processing',
  DONE = 'Done',        // The ONLY success state per specification
  FAILED = 'Failed',
}

// ============================================================================
// POLLING FUNCTION FOR ASYNC REPORT GENERATION
// ============================================================================

/**
 * Fetches report job status from the API
 *
 * Position Activity Reports: When completed, the API returns the data directly as an array
 * Other Reports: Return a status object with { status, result, errorMessage }
 *
 * @param jobId - The report job ID to check
 * @returns Report job status response OR direct array data for completed reports
 * @throws Error if API request fails
 */
async function fetchReportJobStatus(jobId: number): Promise<any> {
  try {
    let token: string | null = null;

    // Try to get token from Keychain (same logic as baseQuery)
    const authToken = await Keychain.getGenericPassword({
      service: 'smarttrack_auth_token',
    });

    if (authToken !== false && authToken.password) {
      token = authToken.password;
    } else {
      const fallbackToken = await Keychain.getGenericPassword({
        service: 'smarttrack_auth',
      });
      if (fallbackToken !== false && fallbackToken.password) {
        token = fallbackToken.password;
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/report-requests/${jobId}`;

    console.log(`📥 Fetching job status from: ${url}`);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      timeout: 10000, // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Debug: Log response type
    if (Array.isArray(data)) {
      console.log(`📊 Job ${jobId} returned array data (completed):`, data.length, 'records');
    } else {
      console.log(`📊 Job ${jobId} returned status object:`, data.status);
    }

    return data;
  } catch (error) {
    console.error(`❌ Failed to fetch job status for ${jobId}:`, error);
    throw error;
  }
}

/**
 * Polls report job status until completion or timeout
 *
 * Handles two response formats:
 * 1. Status Object: { status: "Queued|Processing|Completed|Failed", result?: any, errorMessage?: string }
 * 2. Direct Array Data: [{ X, Y, Time, Status, Vehicle, ... }] - returned when job completes
 *
 * The API returns a queued job with an ID. This function polls the status
 * endpoint every 2 seconds until the report is completed, failed, or timeout occurs.
 *
 * @param jobId - The report job ID from initial POST /report-requests
 * @returns Final report data (array or object) when status = 'Completed' or response is an array
 * @throws Error if status = 'Failed' or polling times out (40 seconds)
 */
async function pollReportCompletion(jobId: number): Promise<any> {
  const startTime = Date.now();
  let pollCount = 0;

  while (Date.now() - startTime < POLLING_CONFIG.MAX_DURATION_MS) {
    try {
      pollCount++;
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

      console.log(`🔄 Poll #${pollCount} - Checking job ${jobId} status... (${elapsedSeconds}s elapsed)`);

      const response = await fetchReportJobStatus(jobId);

      // 🎯 KEY: Check if response is a direct array (Position Activity Report completed)
      // When the API returns an array directly, it means the job is completed
      if (Array.isArray(response)) {
        console.log(`✅ Report job ${jobId} completed. Received direct array data (${response.length} records).`);
        if (response.length > 0) {
          console.log('📦 First record sample:', response[0]);
        } else {
          console.log('⚠️ EMPTY ARRAY RETURNED - Backend returned 0 records for the query');
        }
        return response; // Return array as-is, no transformation
      }

      // Otherwise, response should be a status object
      const statusResponse = response as ReportJobStatusResponse;
      console.log(`📊 Job ${jobId} status:`, statusResponse.status);

      // Check if report is completed via status
      // ✅ STRICT: Only accept "Done" as success state per specification
      if (statusResponse.status === JobStatus.DONE) {
        console.log(`✅ Report job ${jobId} completed (status: ${statusResponse.status}). Extracting data...`);
        console.log('📦 Status Response Result:', statusResponse.result);
        console.log('🔍 RESULT TYPE CHECK:', {
          type: typeof statusResponse.result,
          isArray: Array.isArray(statusResponse.result),
          isObject: statusResponse.result !== null && typeof statusResponse.result === 'object',
          keys: statusResponse.result && typeof statusResponse.result === 'object' ? Object.keys(statusResponse.result) : 'N/A',
          structure: JSON.stringify(statusResponse.result, null, 2).substring(0, 500),
        });
        // For non-array responses, return the result property
        // Empty array [] is a valid success
        return statusResponse.result;
      }

      // Check if report generation failed
      if (statusResponse.status === JobStatus.FAILED) {
        const errorMsg = statusResponse.errorMessage || 'Unknown error';
        console.error(`❌ Report job ${jobId} failed:`, errorMsg);
        throw new Error(`Report generation failed: ${errorMsg}`);
      }

      // Still processing or queued - continue polling
      if (statusResponse.status === JobStatus.QUEUED || statusResponse.status === JobStatus.PROCESSING) {
        console.log(`⏳ Report job ${jobId} is ${statusResponse.status.toLowerCase()}. Polling again in ${POLLING_CONFIG.INTERVAL_MS}ms...`);
        await new Promise(resolve => setTimeout(resolve, POLLING_CONFIG.INTERVAL_MS));
        continue;
      }

      // Unknown status - treat as error
      throw new Error(`Unexpected report job status: ${statusResponse.status}. Expected: Queued, Processing, or Done`);
    } catch (error) {
      // Network or parsing error during poll
      if (error instanceof Error && !error.message.includes('Report generation')) {
        console.warn(`⚠️ Poll error on job ${jobId}:`, error.message);
        throw error;
      }
      throw error;
    }
  }

  // Timeout exceeded
  console.error(`❌ Report job ${jobId} polling exceeded ${POLLING_CONFIG.MAX_DURATION_MS / 1000}s timeout`);
  throw new Error('Report generation timeout: Processing took too long (exceeded 40 seconds). Please try again.');
}

export function useGenerateReport() {
  const customerId = useSelector(selectCustomerId);

  const [dailySummary, dailySummaryState] = useGetDailySummaryReportMutation();
  const [weeklySummary, weeklySummaryState] =
    useGetWeeklySummaryReportMutation();
  const [monthlySummary, monthlySummaryState] =
    useGetMonthlySummaryReportMutation();
  const [tripReport, tripReportState] = useGetTripSummaryReportMutation();
  const [positionActivity, positionActivityState] =
    useGetPositionActivityReportMutation();
  const [speedViolation, speedViolationState] =
    useGetSpeedViolationReportMutation();
  const [harshViolation, harshViolationState] =
    useGetHarshViolationReportMutation();
  const [vehicleScoring, vehicleScoringState] =
    useGetVehicleScoringReportMutation();
  const [geofencePolygon, geofencePolygonState] =
    useGetGeofencePolygonReportMutation();
  const [vehiclePath, vehiclePathState] = useGetVehiclePathReportMutation();

  /**
   * Transforms weekly report response to expected component format
   *
   * The API returns:
   * {
   *   id: number,
   *   status: string,
   *   reportName: string,
   *   result: [{
   *     VehicleName: string,
   *     TotalDistance: number,
   *     AverageIdleTime: number,
   *     AverageOperationTime: number,
   *     ...other fields...
   *   }],
   *   ...
   * }
   *
   * But the component expects:
   * {
   *   WeeklySummaryModelList: [{
   *     VehicleName: string,
   *     SummaryTotalDistance: number,
   *     SummaryIdleTime: number,
   *     SummaryOperationTime: number,
   *     ...
   *   }]
   * }
   *
   * This function maps the API field names to component expected field names.
   *
   * @param apiResponse - The full API response object or result array
   * @returns Transformed response with WeeklySummaryModelList property and normalized field names
   */
  function transformWeeklySummaryReportResponse(apiResponse: any): any {
    console.log('🔄 [transformWeeklySummaryReportResponse] Starting transformation...');
    console.log('🔄 [transformWeeklySummaryReportResponse] Input type:', typeof apiResponse);
    console.log('🔄 [transformWeeklySummaryReportResponse] Is array?', Array.isArray(apiResponse));

    if (!apiResponse) {
      console.warn('⚠️ [transformWeeklySummaryReportResponse] Response is null/undefined');
      return { WeeklySummaryModelList: [] };
    }

    let vehicleDataArray: any[] = [];

    // Extract vehicle data array based on response format
    if (Array.isArray(apiResponse)) {
      console.log(`✅ [transformWeeklySummaryReportResponse] Response is already an array with ${apiResponse.length} records`);
      vehicleDataArray = apiResponse;
    } else if (apiResponse.result && Array.isArray(apiResponse.result)) {
      console.log(`✅ [transformWeeklySummaryReportResponse] Found 'result' property with ${apiResponse.result.length} records`);
      console.log('📦 [transformWeeklySummaryReportResponse] First record sample:', JSON.stringify(apiResponse.result[0], null, 2).substring(0, 300));
      vehicleDataArray = apiResponse.result;
    } else if (apiResponse.WeeklySummaryModelList && Array.isArray(apiResponse.WeeklySummaryModelList)) {
      console.log(`✅ [transformWeeklySummaryReportResponse] Already has correct format with ${apiResponse.WeeklySummaryModelList.length} records`);
      return apiResponse;
    } else {
      console.warn('⚠️ [transformWeeklySummaryReportResponse] Unexpected response structure');
      console.warn('Response keys:', Object.keys(apiResponse || {}));
      return { WeeklySummaryModelList: [] };
    }

    // Normalize field names to match component expectations
    // Map API field names to component expected field names
    const normalizedData = vehicleDataArray.map((vehicle: any) => ({
      ...vehicle,
      // Normalize distance field
      SummaryTotalDistance: vehicle.SummaryTotalDistance ?? vehicle.TotalDistance ?? 0,
      // Normalize idle time field - API sends AverageIdleTime, component expects SummaryIdleTime
      SummaryIdleTime: vehicle.SummaryIdleTime ?? vehicle.AverageIdleTime ?? 0,
      // Normalize stop time field - API sends AverageStopTime, component expects SummaryStopTime
      SummaryStopTime: vehicle.SummaryStopTime ?? vehicle.AverageStopTime ?? 0,
      // Normalize operation time field - API sends AverageOperationTime, component expects SummaryOperationTime
      SummaryOperationTime: vehicle.SummaryOperationTime ?? vehicle.AverageOperationTime ?? 0,
      // Keep all other fields as-is for display
    }));

    console.log('🔄 [transformWeeklySummaryReportResponse] Normalized first record:',
      JSON.stringify(normalizedData[0], null, 2).substring(0, 300));
    console.log(`✅ [transformWeeklySummaryReportResponse] Transformation complete - ${normalizedData.length} records`);

    return { WeeklySummaryModelList: normalizedData };
  }

  /**
   * Transforms monthly report response array to expected component format
   *
   * The API returns an array of vehicle summaries, but the component expects:
   * {
   *   SummaryMonthlyData: [vehicles array],
   *   MonthlyFleetStatistics: [fleet statistics]
   * }
   *
   * This function calculates fleet-wide statistics from individual vehicle data.
   *
   * @param vehicleDataArray - Array of vehicle summary objects from API
   * @returns Transformed response with SummaryMonthlyData and MonthlyFleetStatistics
   */
  function transformMonthlyReportResponse(vehicleDataArray: any[]): any {
    if (!Array.isArray(vehicleDataArray) || vehicleDataArray.length === 0) {
      console.warn('⚠️ [transformMonthlyReportResponse] Invalid or empty vehicle data array');
      return { SummaryMonthlyData: [], MonthlyFleetStatistics: [] };
    }

    console.log('🔄 [transformMonthlyReportResponse] Transforming monthly report response...');
    console.log('📊 Vehicle count:', vehicleDataArray.length);

    // Calculate fleet statistics from vehicle data
    const vehicleCount = vehicleDataArray.length;

    // Sum totals for mean calculations
    let totalOperationTime = 0;
    let totalIdleTime = 0;
    let totalDistanceTravelled = 0;
    let maxTotalOperationTime = 0;
    let maxTotalIdleTime = 0;
    let maxTotalDistanceTravelled = 0;

    vehicleDataArray.forEach((vehicle: any) => {
      totalOperationTime += vehicle.TotalOperationTime || 0;
      totalIdleTime += vehicle.TotalIdleTime || 0;
      totalDistanceTravelled += vehicle.TotalDistanceTravelled || 0;

      maxTotalOperationTime = Math.max(maxTotalOperationTime, vehicle.TotalOperationTime || 0);
      maxTotalIdleTime = Math.max(maxTotalIdleTime, vehicle.TotalIdleTime || 0);
      maxTotalDistanceTravelled = Math.max(maxTotalDistanceTravelled, vehicle.TotalDistanceTravelled || 0);
    });

    // Calculate means
    const meanOperationTime = Math.round(totalOperationTime / vehicleCount);
    const meanIdleTime = Math.round(totalIdleTime / vehicleCount);
    const meanDistanceTravelled = Math.round(totalDistanceTravelled / vehicleCount);
    const meanTotalOperationTime = meanOperationTime;
    const meanTotalIdleTime = meanIdleTime;
    const meanTotalDistanceTravelled = meanDistanceTravelled;

    console.log('📈 Calculated fleet statistics:', {
      meanOperationTime,
      meanIdleTime,
      meanDistanceTravelled,
      maxTotalOperationTime,
      maxTotalIdleTime,
      maxTotalDistanceTravelled,
      meanTotalOperationTime,
      meanTotalIdleTime,
      meanTotalDistanceTravelled,
    });

    // Create the expected response structure
    const transformedResponse = {
      SummaryMonthlyData: vehicleDataArray,
      MonthlyFleetStatistics: [
        {
          MeanOperationTime: meanOperationTime,
          MeanIdleTime: meanIdleTime,
          MeanDistanceTravelled: meanDistanceTravelled,
          MaxTotalOperationTime: maxTotalOperationTime,
          MaxTotalIdleTime: maxTotalIdleTime,
          MaxTotalDistanceTravelled: maxTotalDistanceTravelled,
          MeanTotalOperationTime: meanTotalOperationTime,
          MeanTotalIdleTime: meanTotalIdleTime,
          MeanTotalDistanceTravelled: meanTotalDistanceTravelled,
        },
      ],
    };

    console.log('✅ [transformMonthlyReportResponse] Transformation complete');
    return transformedResponse;
  }

  /**
   * Transforms geofence polygon report response to expected component format
   *
   * The API returns data in GeofenceData property, but GeoFenceReportList expects InPolygonData.
   * This function maps: { GeofenceData: [...] } → { InPolygonData: [...] }
   *
   * @param response - Raw API response with GeofenceData property
   * @returns Transformed response with InPolygonData property for UI consumption
   */
  function transformGeofencePolygonResponse(response: any): any {
    console.log('🔄 [transformGeofencePolygonResponse] Starting transformation...');
    console.log('🔄 [transformGeofencePolygonResponse] Input response type:', typeof response);
    console.log('🔄 [transformGeofencePolygonResponse] Input response keys:',
      response && typeof response === 'object' ? Object.keys(response) : 'N/A');

    if (!response || typeof response !== 'object') {
      console.warn('⚠️ [transformGeofencePolygonResponse] Invalid response - not an object');
      return { InPolygonData: [] };
    }

    // Check if response has GeofenceData property
    if (response.GeofenceData && Array.isArray(response.GeofenceData)) {
      console.log(`✅ [transformGeofencePolygonResponse] Found GeofenceData with ${response.GeofenceData.length} records`);

      if (response.GeofenceData.length > 0) {
        console.log('📦 [transformGeofencePolygonResponse] First record sample:',
          JSON.stringify(response.GeofenceData[0], null, 2).substring(0, 300));
      }

      // Transform: Map GeofenceData → InPolygonData
      const transformed = {
        InPolygonData: response.GeofenceData,
      };

      console.log('✅ [transformGeofencePolygonResponse] Transformation complete - ready for GeoFenceReportList');
      return transformed;
    }

    // Check if it's already in the correct format
    if (response.InPolygonData && Array.isArray(response.InPolygonData)) {
      console.log(`✅ [transformGeofencePolygonResponse] Response already has InPolygonData (${response.InPolygonData.length} records)`);
      return response;
    }

    // Check if it's a direct array (unlikely but handle it)
    if (Array.isArray(response)) {
      console.log(`📋 [transformGeofencePolygonResponse] Response is a direct array with ${response.length} records`);
      return { InPolygonData: response };
    }

    console.warn('⚠️ [transformGeofencePolygonResponse] Unexpected response structure');
    console.warn('Response keys:', Object.keys(response));
    return { InPolygonData: [] };
  }

  /**
   * Normalizes API response by unwrapping nested data property
   * Handles both wrapped { data: {...} } and top-level responses
   *
   * @param response - Raw API response
   * @returns Normalized response object
   */
  function normalizeReportResponse(response: any): any {
    console.log('🔄 [normalizeReportResponse] Raw response type:', typeof response);
    console.log('🔄 [normalizeReportResponse] Is array?', Array.isArray(response));

    if (response === null || response === undefined) {
      console.warn('⚠️ [normalizeReportResponse] Response is null/undefined');
      return response;
    }

    // If response is an array, return as-is (direct trip data)
    if (Array.isArray(response)) {
      console.log('🔄 [normalizeReportResponse] Response is array, returning as-is');
      return response;
    }

    // If response has a 'data' property, unwrap it
    if (response.data !== undefined) {
      console.log('🔄 [normalizeReportResponse] Response has "data" property, unwrapping...');
      console.log('🔄 [normalizeReportResponse] Unwrapped data type:', typeof response.data);
      console.log('🔄 [normalizeReportResponse] Unwrapped data keys:', Object.keys(response.data || {}));
      return response.data;
    }

    // Otherwise return as-is
    console.log('🔄 [normalizeReportResponse] No "data" property, returning response as-is');
    console.log('🔄 [normalizeReportResponse] Response object keys:', Object.keys(response || {}));
    return response;
  }

  /**
   * Main report generation function
   *
   * Builds payload with validation, then calls appropriate mutation.
   * Weekly summary reports are automatically retried due to backend issue.
   * All responses are normalized to handle both wrapped and unwrapped formats.
   *
   * @param reportType - Type of report to generate
   * @param selectedVehicles - IDs/names of vehicles to include
   * @param startDate - ISO-8601 formatted start date
   * @param endDate - ISO-8601 formatted end date (optional)
   * @param scoringWeights - Optional scoring weights for vehicle scoring report
   * @returns Report data from API (normalized)
   * @throws ReportPayloadValidationError if payload validation fails
   * @throws API error if mutation fails
   */
  async function generateReport(
    reportType: string,
    selectedVehicles: string[],
    startDate: string,
    endDate?: string,
    scoringWeights?: {
      f1_OverSpeeding?: number;
      f2_ExcessOverSpeeding?: number;
      f3_SeatBeltViolation?: number;
      f4_HarshCornering?: number;
      f5_HarshBraking?: number;
    },
  ) {
    const payload = buildReportPayload(
      reportType as ReportType,
      selectedVehicles,
      startDate,
      endDate,
      customerId,
      scoringWeights,
    );

    switch (reportType) {
      case REPORT_TYPES.DAILY_SUMMARY:
        {
          console.log('📤 POST /report-requests (daily summary):', { reportName: 'daily', payload });
          const postResponse = await dailySummary(payload as DailySummaryPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.WEEKLY_SUMMARY:
        {
          console.log('📤 POST /report-requests (weekly summary):', { reportName: 'weekly', payload });
          const postResponse = await weeklySummary(payload as WeeklySummaryPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          // Transform the weekly report response: API returns { result: [...] },
          // but component expects { WeeklySummaryModelList: [...] }
          const normalizedResult = normalizeReportResponse(result);
          console.log('🔍 [WEEKLY_SUMMARY] Normalized result type:', typeof normalizedResult);
          console.log('🔍 [WEEKLY_SUMMARY] Is array?', Array.isArray(normalizedResult));
          console.log('🔍 [WEEKLY_SUMMARY] Has result property?', normalizedResult && 'result' in normalizedResult);

          const transformedResult = transformWeeklySummaryReportResponse(normalizedResult);
          console.log('✅ [WEEKLY_SUMMARY] Transformation complete');
          console.log('✅ [WEEKLY_SUMMARY] Has WeeklySummaryModelList?', !!transformedResult.WeeklySummaryModelList);
          console.log('✅ [WEEKLY_SUMMARY] Record count:', transformedResult.WeeklySummaryModelList ? transformedResult.WeeklySummaryModelList.length : 0);

          return transformedResult;
        }

      case REPORT_TYPES.MONTHLY_SUMMARY:
        {
          const monthlyPayload = payload as MonthlySummaryPayload;
          console.log('📤 POST /report-requests (monthly summary):', {
            report_name: 'adv_monthly_report',
            payload: {
              reportType: monthlyPayload.reportType,
              startTime: monthlyPayload.startTime,
              endTime: monthlyPayload.endTime,
              items: monthlyPayload.items,
              excludeGeofence: monthlyPayload.excludeGeofence,
            },
          });
          const postResponse = await monthlySummary(monthlyPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          // Transform the monthly report response: API returns array of vehicles,
          // but component expects {SummaryMonthlyData, MonthlyFleetStatistics}
          const normalizedResult = normalizeReportResponse(result);
          console.log('🔍 Normalized result is array?', Array.isArray(normalizedResult));

          if (Array.isArray(normalizedResult)) {
            console.log('📊 Transforming array response to include fleet statistics...');
            return transformMonthlyReportResponse(normalizedResult);
          }

          return normalizedResult;
        }

      case REPORT_TYPES.TRIP_REPORT:
        {
          const tripPayload = payload as TripSummaryPayload;
          console.log('📤 POST /report-requests (trip report):', {
            report_name: 'trip',
            startTime: tripPayload.startTime,
            endTime: tripPayload.endTime,
            items: tripPayload.items,
            reportType: tripPayload.reportType,
            excludeGeofence: tripPayload.excludeGeofence,
          });

          // Validate payload structure before sending
          if (!tripPayload.items || !Array.isArray(tripPayload.items)) {
            throw new Error('Invalid trip report payload: items must be an array of vehicle IDs');
          }
          if (tripPayload.items.length === 0) {
            throw new Error('Invalid trip report payload: items array cannot be empty');
          }
          if (!tripPayload.startTime || typeof tripPayload.startTime !== 'string') {
            throw new Error('Invalid trip report payload: startTime must be an ISO 8601 formatted date string');
          }
          if (!tripPayload.endTime || typeof tripPayload.endTime !== 'string') {
            throw new Error('Invalid trip report payload: endTime must be an ISO 8601 formatted date string');
          }
          if (tripPayload.reportType !== 'vehicle') {
            throw new Error(`Invalid trip report payload: reportType must be 'vehicle', got '${tripPayload.reportType}'`);
          }

          console.log('🔎 TRIP REPORT PAYLOAD DETAILS:', {
            items: tripPayload.items,
            itemsType: 'Array',
            itemsLength: tripPayload.items.length,
            startTime: tripPayload.startTime,
            endTime: tripPayload.endTime,
            reportType: tripPayload.reportType,
            excludeGeofence: tripPayload.excludeGeofence,
          });
          const postResponse = await tripReport(tripPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.POSITION_ACTIVITY:
        {
          const positionPayload = payload as PositionActivityPayload;
          console.log('📤 POST /report-requests (position activity):', {
            report_name: 'history',
            startTime: positionPayload.startTime,
            endTime: positionPayload.endTime,
            items: positionPayload.items,
            reportType: positionPayload.reportType,
            excludeGeofence: positionPayload.excludeGeofence,
          });

          // Validate payload structure before sending
          if (!positionPayload.items || !Array.isArray(positionPayload.items)) {
            throw new Error('Invalid position activity payload: items must be an array of vehicle IDs');
          }
          if (positionPayload.items.length === 0) {
            throw new Error('Invalid position activity payload: items array cannot be empty');
          }
          if (!positionPayload.startTime || typeof positionPayload.startTime !== 'string') {
            throw new Error('Invalid position activity payload: startTime must be an ISO 8601 formatted date string');
          }
          if (!positionPayload.endTime || typeof positionPayload.endTime !== 'string') {
            throw new Error('Invalid position activity payload: endTime must be an ISO 8601 formatted date string');
          }
          if (positionPayload.reportType !== 'vehicle') {
            throw new Error(`Invalid position activity payload: reportType must be 'vehicle', got '${positionPayload.reportType}'`);
          }

          console.log('🔎 POSITION ACTIVITY PAYLOAD DETAILS:', {
            items: positionPayload.items,
            itemsType: 'Array',
            itemsLength: positionPayload.items.length,
            startTime: positionPayload.startTime,
            endTime: positionPayload.endTime,
            reportType: positionPayload.reportType,
            excludeGeofence: positionPayload.excludeGeofence,
          });
          const postResponse = await positionActivity(positionPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          // 🎯 IMPORTANT: Position Activity polling returns the raw array directly
          // [{ X, Y, Time, Status, Vehicle, ... }, ...]
          // Do NOT transform - pass array as-is (empty array [] is valid success)
          if (Array.isArray(result)) {
            console.log(`📋 Position Activity Report: ${result.length} records received`);
            return result;
          }

          // Fallback for other response formats (shouldn't happen but handle gracefully)
          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.SPEED_VIOLATION:
        {
          console.log('📤 POST /report-requests (speed violation):', { reportName: 'speed_violation', payload });
          const postResponse = await speedViolation(payload as SpeedViolationPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.HARSH_VIOLATION:
        {
          console.log('📤 POST /report-requests (harsh violation):', { reportName: 'harsh', payload });
          const postResponse = await harshViolation(payload as HarshViolationPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.VEHICLE_SCORING:
        {
          console.log('📤 POST /report-requests (vehicle scoring):', { reportName: 'vehicle_scoring', payload });
          const postResponse = await vehicleScoring(payload as VehicleScoringPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.GEOFENCE_POLYGON:
        {
          console.log('📤 POST /report-requests (geofence polygon):', { reportName: 'geofence_speed', payload });
          const postResponse = await geofencePolygon(payload as GeofencePolygonPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          // Normalize the response first (unwrap data property if present)
          const normalizedResult = normalizeReportResponse(result);
          console.log('🔍 [GEOFENCE_POLYGON] Normalized response type:', typeof normalizedResult);
          console.log('🔍 [GEOFENCE_POLYGON] Normalized response keys:',
            normalizedResult && typeof normalizedResult === 'object' ? Object.keys(normalizedResult) : 'N/A');

          // Transform the geofence polygon response: API returns GeofenceData,
          // but GeoFenceReportList component expects InPolygonData
          const transformedResult = transformGeofencePolygonResponse(normalizedResult);
          console.log('✅ [GEOFENCE_POLYGON] Transformation complete');
          console.log('✅ [GEOFENCE_POLYGON] Final result has InPolygonData:', !!transformedResult.InPolygonData);
          console.log('✅ [GEOFENCE_POLYGON] InPolygonData record count:',
            transformedResult.InPolygonData ? transformedResult.InPolygonData.length : 0);

          return transformedResult;
        }

      case REPORT_TYPES.VEHICLE_PATH:
        {
          console.log('📤 POST /report-requests (vehicle path):', { reportName: 'vehicle_path', payload });
          const postResponse = await vehiclePath(payload as VehiclePathPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      default:
        throw new Error(`Unsupported report type: ${reportType}`);
    }
  }

  // Combine all mutation states into one place
  const states = {
    dailySummaryState,
    weeklySummaryState,
    monthlySummaryState,
    tripReportState,
    positionActivityState,
    speedViolationState,
    harshViolationState,
    vehicleScoringState,
    geofencePolygonState,
    vehiclePathState,
  };

  return { generateReport, states };
}
