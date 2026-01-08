/**
 * Report generation service
 *
 * Consolidates all report generation logic with:
 * - Unified mutation calls
 * - Integrated retry mechanism for weekly summary
 * - Error handling and propagation
 */

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
   * Retry mechanism for weekly summary reports
   *
   * Backend issue: Throws NullReferenceException on first request,
   * succeeds on second request. This is a known backend bug.
   *
   * This logic is intentionally placed in the service layer (not UI components)
   * to treat retries as business/transport logic, not presentation logic.
   *
   * @param mutationFn - The mutation function to retry
   * @param maxAttempts - Maximum number of retry attempts
   * @param delayMs - Delay between retries in milliseconds
   * @returns Result from successful mutation call
   * @throws Last error if all attempts fail
   */
  async function retryWeeklySummaryWithBackoff(
    mutationFn: () => Promise<any>,
    maxAttempts: number = 2,
    delayMs: number = 500
  ): Promise<any> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await mutationFn();
        if (attempt > 1) {
          console.log(`✅ Weekly summary succeeded on attempt ${attempt}`);
        }
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          console.warn(
            `⚠️ Weekly summary attempt ${attempt} failed, retrying...`,
            error
          );
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delayMs));
        } else {
          // Final attempt failed, log and propagate
          console.error(`❌ Weekly summary failed after ${maxAttempts} attempts`, error);
        }
      }
    }

    // All attempts exhausted, throw the last error
    throw lastError;
  }

  /**
   * Normalizes API response by unwrapping nested data property
   * Handles both wrapped { data: {...} } and top-level responses
   *
   * @param response - Raw API response
   * @returns Normalized response object
   */
  function normalizeReportResponse(response: any): any {
    // If response has a 'data' property, unwrap it
    // Otherwise return as-is
    return response?.data ?? response;
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
   * @returns Report data from API (normalized)
   * @throws ReportPayloadValidationError if payload validation fails
   * @throws API error if mutation fails
   */
  async function generateReport(
    reportType: string,
    selectedVehicles: string[],
    startDate: string,
    endDate?: string,
  ) {
    const payload = buildReportPayload(
      reportType as ReportType,
      selectedVehicles,
      startDate,
      endDate,
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
          // Use internal retry mechanism for weekly summary due to backend bug
          const raw = await retryWeeklySummaryWithBackoff(
            () => weeklySummary(payload as WeeklySummaryPayload).unwrap()
          );
          const normalized = normalizeReportResponse(raw);

          // Validate weekly summary has expected data before returning
          if (!normalized || !normalized.WeeklySummaryModelList) {
            throw new Error(
              'Weekly summary report returned empty or invalid data. Please try again.'
            );
          }

          return normalized;
        }

      case REPORT_TYPES.MONTHLY_SUMMARY:
        {
          console.log('📤 POST /report-requests (monthly summary):', { reportName: 'monthly', payload });
          const postResponse = await monthlySummary(payload as MonthlySummaryPayload).unwrap();
          const jobId = postResponse.id;
          console.log('📥 POST response received:', { jobId, status: postResponse.status });

          // Poll for completion
          const result = await pollReportCompletion(jobId);
          console.log('✅ Polling complete, got final result');

          return normalizeReportResponse(result);
        }

      case REPORT_TYPES.TRIP_REPORT:
        {
          console.log('📤 POST /report-requests (trip report):', { reportName: 'trip', payload });
          const postResponse = await tripReport(payload as TripSummaryPayload).unwrap();
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

          return normalizeReportResponse(result);
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
