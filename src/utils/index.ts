/**
 * Converts seconds to HH:MM:SS format
 * @param sec - seconds to convert (handles undefined/null gracefully)
 * @returns formatted time string in HH:MM:SS format, or '00:00:00' if input is invalid
 */
export const toHHMMSS = (sec: number | string | undefined | null): string => {
    // Handle undefined, null, or empty values
    if (sec === undefined || sec === null || sec === '') {
        return '00:00:00';
    }

    try {
        const sec_num = parseInt(sec.toString(), 10);

        // Handle NaN or invalid numbers
        if (isNaN(sec_num)) {
            return '00:00:00';
        }

        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        const seconds = sec_num - (hours * 3600) - (minutes * 60);

        // Use padStart to ensure proper zero padding
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } catch (error) {
        console.warn('⚠️ [toHHMMSS] Failed to convert value:', sec, error);
        return '00:00:00';
    }
};

/**
 * Converts seconds to HH:MM format
 * @param sec - seconds to convert (handles undefined/null gracefully)
 * @returns formatted time string in HH:MM format, or '00:00' if input is invalid
 */
export const toHHMM = (sec: number | string | undefined | null): string => {
    // Handle undefined, null, or empty values
    if (sec === undefined || sec === null || sec === '') {
        return '00:00';
    }

    try {
        const sec_num = parseInt(sec.toString(), 10);

        // Handle NaN or invalid numbers
        if (isNaN(sec_num)) {
            return '00:00';
        }

        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor((sec_num - (hours * 3600)) / 60);

        // Use padStart to ensure proper zero padding
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    } catch (error) {
        console.warn('⚠️ [toHHMM] Failed to convert value:', sec, error);
        return '00:00';
    }
};

/**
 * Formats a timestamp string to HH:MM AM/PM format
 * @param timestamp - ISO timestamp string (e.g., "2025-09-03T07:29:06")
 * @returns Formatted time string (e.g., "7:29 AM")
 */
export const formatTimestampToTime = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid Time';

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid Time';
  }
};

/**
 * Rounds a number to specified decimal places
 * @param n - number to round
 * @param digits - number of decimal places (default: 0)
 * @returns rounded number as string
 */
export const round_to = (n: number, digits?: number): string => {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    let result = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
        result = (parseFloat(result) * -1).toFixed(2);
    }
    return result;
};

// Export date formatting utilities
export * from './dateFormatter';

// Export retry utilities
export * from './retryUtils';

/**
 * Formats date from API format "#09/04/2025 12:00:00 AM#" to display format "09/04/2025"
 * @param dateString - date string in API format with # symbols
 * @returns formatted date string in MM/DD/YYYY format
 */
export const formatDateForDisplay = (dateString?: string): string => {
  if (!dateString) return 'No Date';
  
  // Remove the # symbols and extract just the date part
  const cleanDate = dateString.replace(/#/g, '').split(' ')[0];
  return cleanDate; // This will be "09/04/2025"
};

/**
 * Converts month number (1-12) to month name
 * @param monthNumber - month number (1-12)
 * @returns month name (e.g., "January", "February", etc.)
 */
export const getMonthName = (monthNumber: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  if (monthNumber < 1 || monthNumber > 12) {
    return 'Invalid Month';
  }
  
  return months[monthNumber - 1];
};

/**
 * Capitalizes the first letter of a string
 * @param str - string to capitalize
 * @returns string with first letter capitalized
 */
const cap_first_letter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts ISO timestamp to "time ago" format (e.g., "2 hours ago", "3 days ago")
 * @param timestamp - ISO timestamp string (e.g., "2025-06-19T12:09:01Z")
 * @returns formatted time ago string
 */
export const getTimeAgo = (timestamp: string): string => {
  try {
    const now = new Date();
    const past = new Date(timestamp);
    
    if (isNaN(past.getTime())) return 'Invalid time';
    
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return 'Unknown time';
  }
};

/**
 * Shares vehicle location information via native share sheet
 * @param vehicle - vehicle object with location data
 * @param context - optional context for different report types
 */
export const share_location = async (vehicle: any, context: string | null = null) => {
  try {
    const { Share } = require('react-native');
    
    let msg = '';
    
    // Helper function to safely get property values
    const getValue = (obj: any, ...keys: string[]) => {
      for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) {
          return obj[key];
        }
      }
      return 'N/A';
    };

    // Get coordinates safely
    const latitude = getValue(vehicle, 'Y', 'latitude', 'Latitude');
    const longitude = getValue(vehicle, 'X', 'longitude', 'Longitude');
    
    // Format date safely
    const formatDate = (dateValue: any) => {
      if (!dateValue) return 'N/A';
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      } catch {
        return 'N/A';
      }
    };
    
    if (!context) {
      const vehicleName = getValue(vehicle, 'VehicleName', 'name', 'Vehicle');
      const driverName = getValue(vehicle, 'DriverName', 'driver_name', 'Driver');
      const status = getValue(vehicle, 'Status', 'status');
      const speed = getValue(vehicle, 'VehicleSpeed', 'Speed', 'speed');
      const location = getValue(vehicle, 'Road', 'AreaName', 'location_full', 'Location');
      const time = getValue(vehicle, 'Time', 'status_time', 'DateTime');

      msg = `
Vehicle: ${vehicleName}
Driver: ${driverName}
Status: ${status}
Speed: ${speed} km/h
DateTime: ${formatDate(time)}
Location: ${location}
View On Map: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}
`;
    }

    if (context === 'harsh_violation_report') {
      const vehicleName = getValue(vehicle, 'VehicleName', 'name', 'Vehicle');
      const event = getValue(vehicle, 'Status', 'status', 'Event');
      const location = getValue(vehicle, 'Road', 'AreaName', 'location_full', 'Location');
      const time = getValue(vehicle, 'Time', 'status_time', 'DateTime');

      msg = `
Event: ${event}
Vehicle: ${vehicleName}
DateTime: ${formatDate(time)}
Location: ${location}
View On Map: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}
`;
    }

    if (context === 'speed_violation_report') {
      const vehicleName = getValue(vehicle, 'VehicleName', 'name', 'Vehicle');
      const driverName = getValue(vehicle, 'DriverName', 'driver_name', 'Driver');
      const speed = getValue(vehicle, 'VehicleSpeed', 'Speed', 'speed');
      const location = getValue(vehicle, 'Road', 'AreaName', 'location_full', 'Location');
      const time = getValue(vehicle, 'Time', 'status_time', 'DateTime');

      msg = `
Vehicle: ${vehicleName}
Driver: ${driverName}
Speed: ${speed} km/h
DateTime: ${formatDate(time)}
Location: ${location}
View On Map: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}
`;
    }

    const result = await Share.share({
      message: msg
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.error('Share error:', error);
    // Fallback to simple share if the main function fails
    try {
      const { Share } = require('react-native');
      const latitude = vehicle?.Y || vehicle?.latitude || vehicle?.Latitude || 'N/A';
      const longitude = vehicle?.X || vehicle?.longitude || vehicle?.Longitude || 'N/A';
      
      await Share.share({
        message: `Location: ${latitude}, ${longitude}\nView On Map: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      });
    } catch (fallbackError) {
      console.error('Fallback share error:', fallbackError);
    }
  }
};
