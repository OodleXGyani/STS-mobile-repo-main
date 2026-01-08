/**
 * Date formatting utilities for SmartTrack API
 * Converts JavaScript Date objects to SmartTrack format: #MM/DD/YYYY HH:MM:SS AM/PM#
 */

/**
 * Formats a Date object to SmartTrack API format
 * @param date - JavaScript Date object
 * @param isStartOfDay - If true, sets time to 00:00:00 (start of day), if false sets to 23:59:59 (end of day)
 * @returns Formatted date string in SmartTrack format: #MM/DD/YYYY HH:MM:SS AM/PM#
 */
export const formatDateForAPI = (date: Date, isStartOfDay: boolean = true): string => {
  // Create a new date to avoid mutating the original
  const targetDate = new Date(date);

  if (isStartOfDay) {
    // Set to start of day: 00:00:00
    targetDate.setHours(0, 0, 0, 0);
  } else {
    // Set to end of day: 23:59:59
    targetDate.setHours(23, 59, 59, 999);
  }

  // Format as #MM/DD/YYYY HH:MM:SS AM/PM#
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const year = targetDate.getFullYear();

  let hours = targetDate.getHours();
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const seconds = String(targetDate.getSeconds()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 (midnight), keep others as-is
  const formattedHours = String(hours).padStart(2, '0');

  return `#${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}#`;
};

/**
 * Formats a date range for API calls
 * @param date - JavaScript Date object
 * @returns Object with startDate and endDate formatted for API
 */
export const formatDateRangeForAPI = (date: Date) => {
  return {
    startDate: formatDateForAPI(date, true),  // #MM/DD/YYYY 12:00:00 AM#
    endDate: formatDateForAPI(date, false),   // #MM/DD/YYYY 11:59:59 PM#
  };
};

/**
 * Formats multiple dates for API calls
 * @param dates - Array of JavaScript Date objects
 * @returns Array of formatted date strings
 */
export const formatMultipleDatesForAPI = (dates: Date[], isStartOfDay: boolean = true): string[] => {
  return dates.map(date => formatDateForAPI(date, isStartOfDay));
};

/**
 * Utility to get today's date range formatted for API
 * @returns Object with today's start and end dates formatted for API
 */
export const getTodayDateRangeForAPI = () => {
  return formatDateRangeForAPI(new Date());
};

/**
 * Utility to get a specific date range formatted for API
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Object with formatted start and end dates for API
 */
export const getDateRangeForAPI = (startDate: Date, endDate: Date) => {
  return {
    startDate: formatDateForAPI(startDate, true),
    endDate: formatDateForAPI(endDate, false),
  };
};

export function formatTo12Hour(timeString: string) {
  const date = new Date(timeString);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}


// Example usage:
/*
const today = new Date();
const formattedStart = formatDateForAPI(today, true);  // "#01/15/2025 12:00:00 AM#"
const formattedEnd = formatDateForAPI(today, false);   // "#01/15/2025 11:59:59 PM#"

const dateRange = formatDateRangeForAPI(today);
// Returns: { startDate: "#01/15/2025 12:00:00 AM#", endDate: "#01/15/2025 11:59:59 PM#" }

const todayRange = getTodayDateRangeForAPI();
// Returns: { startDate: "#01/15/2025 12:00:00 AM#", endDate: "#01/15/2025 11:59:59 PM#" }
*/

/**
 * Formats a Date object to ISO 8601 format (UTC) for newer API endpoints
 * @param date - JavaScript Date object (in local timezone)
 * @param isStartOfDay - If true, sets time to 00:00:00 UTC, else 23:59:00 UTC
 * @returns ISO 8601 string: YYYY-MM-DDTHH:mm:ssZ (without milliseconds)
 *
 * NOTE: This function extracts the local date components (year, month, day)
 * and creates a UTC date at midnight/end-of-day to avoid timezone shift issues.
 * For example: selecting Jan 6 in EST timezone will result in 2026-01-06T00:00:00Z
 * (not 2026-01-05T00:00:00Z which would happen if we just shifted local midnight to UTC)
 *
 * The milliseconds are stripped from the output per API specification.
 */
export const formatDateToISO = (date: Date, isStartOfDay: boolean = true): string => {
  // Extract local date components to avoid timezone conversion issues
  const year = date.getFullYear();
  const month = date.getMonth();  // 0-based
  const day = date.getDate();

  // Create a new date using UTC directly with the extracted local date components
  const targetDate = new Date(Date.UTC(year, month, day));

  if (isStartOfDay) {
    // Already at 00:00:00 UTC when created with Date.UTC(year, month, day)
    targetDate.setUTCHours(0, 0, 0, 0);
  } else {
    // Set to end of day: 23:59:00 per API spec (not 23:59:59)
    targetDate.setUTCHours(23, 59, 0, 0);
  }

  // Strip milliseconds from ISO string: "2026-01-06T00:00:00.000Z" → "2026-01-06T00:00:00Z"
  return targetDate.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Formats a Date object to ISO 8601 format WITHOUT the Z suffix
 * Preserves the actual time of the date (does not force to start/end of day)
 * @param date - JavaScript Date object
 * @returns ISO 8601 string: YYYY-MM-DDTHH:mm:ss (without Z or milliseconds)
 *
 * Example: new Date("2026-01-06T11:33:42") → "2026-01-06T11:33:42"
 */
export const formatDateToISOWithoutZ = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
