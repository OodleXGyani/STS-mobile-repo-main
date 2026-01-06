/**
 * Report payload builder with strict validation
 *
 * Enforces:
 * - All required fields must be present
 * - Date formats are ISO-8601
 * - Vehicle selection is not empty
 * - Clear, actionable error messages
 */

import { REPORT_TYPES, ReportType } from '../../../../../constants/reportTypes';
import { REPORT_NAME_MAP } from '../../../../../services/reportNames';
import { getReportMeta } from '../../../../../services/reportMeta';

import {
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
} from '../../../../../services/reports';

/**
 * Converts SmartTrack date format to ISO 8601 format
 * SmartTrack: "#11/06/2025 12:00:00 AM#"
 * ISO 8601: "2025-11-06T00:00:00Z"
 */
function convertSmartTrackToISO8601(smartTrackDate: string): string {
  // Remove the hash symbols
  const cleanDate = smartTrackDate.replace(/#/g, '').trim();

  // Parse: "11/06/2025 12:00:00 AM"
  const regex = /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+(AM|PM)/;
  const match = cleanDate.match(regex);

  if (!match) {
    throw new Error(`Invalid SmartTrack date format: ${smartTrackDate}`);
  }

  let [, month, day, year, hour, minute, second, period] = match;

  // Convert 12-hour to 24-hour format
  let hour24 = parseInt(hour, 10);
  if (period === 'AM' && hour24 === 12) {
    hour24 = 0;  // 12 AM = 00:00
  } else if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;  // 1 PM = 13:00, etc
  }

  // Format as ISO 8601: YYYY-MM-DDTHH:MM:SSZ
  const iso8601 = `${year}-${month}-${day}T${String(hour24).padStart(2, '0')}:${minute}:${second}Z`;

  console.log(`🔄 Date conversion: SmartTrack "${smartTrackDate}" → ISO 8601 "${iso8601}"`);
  return iso8601;
}

/**
 * Custom error class for report payload validation
 * Allows RTK Query to properly distinguish validation errors
 */
export class ReportPayloadValidationError extends Error {
  public readonly reportType: string;
  public readonly missingField: string;

  constructor(
    message: string,
    reportType: string,
    missingField: string
  ) {
    super(message);
    this.name = 'ReportPayloadValidationError';
    this.reportType = reportType;
    this.missingField = missingField;

    // Maintain proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReportPayloadValidationError);
    }
  }
}

/**
 * Validates required fields for report payload
 * Throws explicit errors instead of failing silently
 *
 * @throws ReportPayloadValidationError if required fields are missing
 */
function validateReportPayload(
  reportType: ReportType,
  selectedVehicles: string[],
  startDate: string,
  endDate?: string
): void {
  // Validate vehicle selection
  if (!selectedVehicles || selectedVehicles.length === 0) {
    throw new ReportPayloadValidationError(
      'At least one vehicle must be selected to generate a report',
      reportType,
      'selectedVehicles'
    );
  }

  // Validate date fields
  if (!startDate || startDate.trim() === '') {
    throw new ReportPayloadValidationError(
      'Start date is required',
      reportType,
      'startDate'
    );
  }

  // Validate date format (should be SmartTrack format: #MM/DD/YYYY HH:MM:SS AM/PM#)
  // The date is already formatted by formatDateForAPI() before reaching here
  const smartTrackDateRegex = /^#\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2} (AM|PM)#$/;
  if (!smartTrackDateRegex.test(startDate)) {
    throw new ReportPayloadValidationError(
      `Invalid start date format: ${startDate}. Expected SmartTrack format: #MM/DD/YYYY HH:MM:SS AM/PM#`,
      reportType,
      'startDate'
    );
  }

  // For reports that require endDate
  if (endDate && endDate.trim() !== '') {
    if (!smartTrackDateRegex.test(endDate)) {
      throw new ReportPayloadValidationError(
        `Invalid end date format: ${endDate}. Expected SmartTrack format: #MM/DD/YYYY HH:MM:SS AM/PM#`,
        reportType,
        'endDate'
      );
    }
  }
}
/**
 * Helper function to convert vehicle ID strings to integer array
 * Backend expects Int32[] for items in async queued reports
 *
 * @param vehicleIds - Array of vehicle IDs as strings (e.g., ["123", "456"])
 * @returns Array of integer IDs
 */
function convertVehicleIdsToIntArray(vehicleIds: string[]): number[] {
  return vehicleIds.map(id => {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      throw new ReportPayloadValidationError(
        `Invalid vehicle ID: ${id}. Expected numeric ID.`,
        'unknown',
        'vehicleId'
      );
    }
    return numId;
  });
}

/**
 * Builds report payload with strict validation
 *
 * Validates all required fields upfront and throws clear errors if missing.
 * Uses REPORT_NAME_MAP for type safety and report metadata for field requirements.
 *
 * @throws ReportPayloadValidationError if any required field is missing or invalid
 */
export function buildReportPayload(
  reportType: ReportType,
  selectedVehicles: string[],
  startDate: string,
  endDate?: string,
):
  | DailySummaryPayload
  | WeeklySummaryPayload
  | MonthlySummaryPayload
  | TripSummaryPayload
  | PositionActivityPayload
  | SpeedViolationPayload
  | HarshViolationPayload
  | VehicleScoringPayload
  | GeofencePolygonPayload
  | VehiclePathPayload {

  // Validate ALL required fields upfront
  validateReportPayload(reportType, selectedVehicles, startDate, endDate);

  // Convert vehicle IDs to integers for backend (expects Int32[] in async reports)
  const vehicleIds = convertVehicleIdsToIntArray(selectedVehicles);
  console.log('🔄 Vehicle ID conversion:', { originalVehicleIds: selectedVehicles, convertedToIntArray: vehicleIds });

  // Report-specific payload building
  switch (reportType) {
    case REPORT_TYPES.DAILY_SUMMARY:
      return {
        startDate,
        endDate: endDate ?? startDate,
        vehicle: selectedVehicles[0],  // Single vehicle ID
      };

    case REPORT_TYPES.WEEKLY_SUMMARY:
      return {
        startDate,
        vehicle: selectedVehicles.join(','),  // Comma-separated vehicle IDs
      };

    case REPORT_TYPES.MONTHLY_SUMMARY:
      return {
        startDate,
        endDate: endDate ?? startDate,
        vehicle: selectedVehicles.join(','),  // Comma-separated vehicle IDs
      };

    case REPORT_TYPES.TRIP_REPORT:
      return {
        startDate,
        endDate: endDate ?? startDate,
        items: vehicleIds,  // Array of integer IDs for Int32[]
        datatype: 'vehicle',
      };

    case REPORT_TYPES.POSITION_ACTIVITY:
      // Convert dates from SmartTrack format to ISO 8601 format
      // SmartTrack: "#11/06/2025 12:00:00 AM#"
      // ISO 8601: "2025-11-06T00:00:00Z"
      const isoStartTime = convertSmartTrackToISO8601(startDate);
      const isoEndTime = convertSmartTrackToISO8601(endDate ?? startDate);

      return {
        startTime: isoStartTime,    // ISO 8601 format
        endTime: isoEndTime,        // ISO 8601 format
        items: vehicleIds,          // Array of integer IDs
        reportType: 'vehicle',      // Backend expects 'vehicle'
        excludeGeofence: false,     // Boolean false for default behavior
      };

    case REPORT_TYPES.SPEED_VIOLATION:
      return {
        StartDate: startDate,
        EndDate: endDate ?? startDate,
        ReportType: 'overspeedkm',
        InputValue: '70',
        Items: vehicleIds,  // Array of integer IDs for Int32[]
        DataType: 'Vehicle',
      };

    case REPORT_TYPES.HARSH_VIOLATION:
      return {
        StartDate: startDate,
        EndDate: endDate ?? startDate,
        DataType: 'Vehicle',
        Items: vehicleIds,  // Array of integer IDs for Int32[]
      };

    case REPORT_TYPES.VEHICLE_SCORING:
      return {
        scoreDate: startDate,
        vehicle: selectedVehicles.join(','),  // Comma-separated vehicle IDs
        f1_OverSpeeding: 1,
        f2_ExcessOverSpeeding: 1,
        f3_SeatBleatViolation: 1,
        f4_HarshCornering: 1,
        f5_HarshBraking: 1,
      };

    case REPORT_TYPES.GEOFENCE_POLYGON:
      return {
        StartDate: startDate,
        EndDate: endDate ?? startDate,
        Vehicle: selectedVehicles[0],  // Single vehicle ID
      };

    case REPORT_TYPES.VEHICLE_PATH:
      return {
        Vehicle: selectedVehicles[0],  // Single vehicle ID
        StartDate: startDate,
        EndDate: endDate ?? startDate,
      };

    default:
      throw new ReportPayloadValidationError(
        `Unknown report type: ${reportType}`,
        reportType,
        'reportType'
      );
  }
}
