/**
 * Examples of how to use the dateFormatter utility
 * This file demonstrates various ways to format dates for the SmartTrack API
 */

import { 
  formatDateForAPI, 
  formatDateRangeForAPI, 
  getTodayDateRangeForAPI,
  getDateRangeForAPI 
} from './dateFormatter';

// Example 1: Format a single date
export const exampleSingleDate = () => {
  const today = new Date();
  
  // Start of day
  const startOfDay = formatDateForAPI(today, true);
  console.log('Start of day:', startOfDay); // "#01/15/2025 12:00:00 AM#"
  
  // End of day
  const endOfDay = formatDateForAPI(today, false);
  console.log('End of day:', endOfDay); // "#01/15/2025 11:59:59 PM#"
  
  return { startOfDay, endOfDay };
};

// Example 2: Format a date range for a specific date
export const exampleDateRange = () => {
  const specificDate = new Date('2025-01-15');
  const { startDate, endDate } = formatDateRangeForAPI(specificDate);
  
  console.log('Date range:', { startDate, endDate });
  // Returns: { 
  //   startDate: "#01/15/2025 12:00:00 AM#", 
  //   endDate: "#01/15/2025 11:59:59 PM#" 
  // }
  
  return { startDate, endDate };
};

// Example 3: Get today's date range
export const exampleTodayRange = () => {
  const { startDate, endDate } = getTodayDateRangeForAPI();
  
  console.log('Today range:', { startDate, endDate });
  // Returns current day's start and end times
  
  return { startDate, endDate };
};

// Example 4: Format a custom date range
export const exampleCustomRange = () => {
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-01-31');
  
  const { startDate: formattedStart, endDate: formattedEnd } = getDateRangeForAPI(startDate, endDate);
  
  console.log('Custom range:', { formattedStart, formattedEnd });
  // Returns: { 
  //   formattedStart: "#01/01/2025 12:00:00 AM#", 
  //   formattedEnd: "#01/31/2025 11:59:59 PM#" 
  // }
  
  return { formattedStart, formattedEnd };
};

// Example 5: Usage in API payload
export const exampleAPIPayload = () => {
  const selectedDate = new Date();
  const { startDate, endDate } = formatDateRangeForAPI(selectedDate);
  
  const payload = {
    StartDate: startDate,
    EndDate: endDate,
    Items: "Teltonika_FMU130_863003048311096,Teltonika_FMU130_863003048364608",
    DataType: "Vehicle" as const,
    ExcludeGeofence: false as const,  // Backend expects boolean, not 0/1
  };
  
  console.log('API Payload:', payload);
  // Returns: {
  //   StartDate: "#01/15/2025 12:00:00 AM#",
  //   EndDate: "#01/15/2025 11:59:59 PM#",
  //   Items: "Teltonika_FMU130_863003048311096,Teltonika_FMU130_863003048364608",
  //   DataType: "Vehicle",
  //   ExcludeGeofence: 0
  // }
  
  return payload;
};

// Example 6: Usage in React component
export const exampleReactUsage = () => {
  // In your React component:
  /*
  import { formatDateRangeForAPI } from '../utils/dateFormatter';
  
  const MyComponent = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const handleGenerateReport = async () => {
      const { startDate, endDate } = formatDateRangeForAPI(selectedDate);
      
      const payload = {
        StartDate: startDate,
        EndDate: endDate,
        Items: "device1,device2",
        DataType: "Vehicle",
        ExcludeGeofence: false,  // Backend expects boolean, not 0/1
      };
      
      // Call your API
      const result = await getPositionActivityReport(payload);
    };
    
    return (
      // Your component JSX
    );
  };
  */
};

// Example 7: Different time scenarios
export const exampleTimeScenarios = () => {
  const date = new Date('2025-01-15T14:30:00'); // 2:30 PM
  
  // Start of day (12:00:00 AM)
  const startOfDay = formatDateForAPI(date, true);
  console.log('Start of day:', startOfDay); // "#01/15/2025 12:00:00 AM#"
  
  // End of day (11:59:59 PM)
  const endOfDay = formatDateForAPI(date, false);
  console.log('End of day:', endOfDay); // "#01/15/2025 11:59:59 PM#"
  
  // The original time is preserved in the date object, but we format it to start/end of day
  return { startOfDay, endOfDay };
};
