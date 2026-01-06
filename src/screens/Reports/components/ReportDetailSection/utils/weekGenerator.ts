export interface WeekInfo {
  id: string;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  label: string;
}

/**
 * Generates weeks for a given month and year
 * Weeks always start from the 1st day of the current month
 */
export const generateWeeksForMonth = (year: number, month: number): WeekInfo[] => {
  const weeks: WeekInfo[] = [];
  
  // Create the first day of the selected month
  const firstDayOfMonth = new Date(year, month - 1, 1);
  
  // Start from the 1st day of the month
  let currentWeekStart = new Date(firstDayOfMonth);
  let weekNumber = 1;
  
  // Generate weeks until we've covered the entire month
  while (currentWeekStart.getMonth() === month - 1) {
    
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    
    // Create week info
    const weekInfo: WeekInfo = {
      id: `week-${year}-${month}-${weekNumber}`,
      weekNumber,
      startDate: new Date(currentWeekStart),
      endDate: new Date(currentWeekEnd),
      label: formatWeekLabel(currentWeekStart, currentWeekEnd)
    };
    
    weeks.push(weekInfo);
    
    // Move to next week (7 days ahead)
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekNumber++;
    
    // Break if we've gone beyond the current month
    if (currentWeekStart.getMonth() !== month - 1) {
      break;
    }
  }
  
  return weeks;
};

/**
 * Formats the week label with proper month abbreviations
 */
const formatWeekLabel = (startDate: Date, endDate: Date): string => {
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const endDay = endDate.getDate();
  
  // If both dates are in the same month
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
  }
  
  // If dates span across months
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
};

/**
 * Gets the month name for display
 */
export const getMonthName = (month: number): string => {
  const date = new Date(2024, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
};
