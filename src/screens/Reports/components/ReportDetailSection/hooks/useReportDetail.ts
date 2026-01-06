import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { showSafeAlert } from '../../../../../utils/AlertUtils';
import {
  useGetUserVehiclesQuery,
  VehicleGroup,
  VehicleItem,
} from '../../../../../services/vehicles';
import { ReportType } from '../../../../../constants/reportTypes';
import { useGenerateReport } from '../utils/generateReportService';
import { formatDateRangeForAPI, formatDateForAPI } from '../../../../../utils/dateFormatter';
import { useNavigation } from '@react-navigation/native';
import { generateWeeksForMonth, WeekInfo } from '../utils/weekGenerator';

export const useReportDetail = () => {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState<VehicleItem[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    {},
  );
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigation = useNavigation();

  // Year and month selection for monthly summary reports
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Current month (1-12)
    // If current month is January, we need to go back to previous year for December
    return currentMonth === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
    // Set to one month before current month, or December if current month is January
    return currentMonth === 1 ? 12 : currentMonth - 1;
  });

  // Week selection state - only one week at a time
  const [selectedWeek, setSelectedWeek] = useState<WeekInfo | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<boolean>(false);

  const { generateReport, states } = useGenerateReport(); // 👈 here
  // Pagination states for user vehicles
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  // Reset all selections when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setSelectedVehicles([]);
      setSelectedWeek(null);
      setExpandedWeeks(false);
      setPageIndex(1);
      setSelectedDate(new Date());
      setSelectedYear(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        return currentMonth === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      });
      setSelectedMonth(() => {
        const currentMonth = new Date().getMonth() + 1;
        return currentMonth === 1 ? 12 : currentMonth - 1;
      });
      setExpandedGroups({});
    }, [])
  );

  // Call the RTK Query to get user vehicles with default params
  const {
    data: userVehicleResponse,
    error: userVehiclesError,
    isLoading: userVehiclesLoading,
    isFetching: userVehiclesFetching,
    isSuccess: userVehiclesSuccess,
  } = useGetUserVehiclesQuery({
    pageIndex: 1,
    pageSize: 1000, // Get all vehicles in one call
    searchText: '',
  });

  // Use vehicle groups directly from backend response - only after success
  const vehicleGroups: VehicleGroup[] = useMemo(() => {
    if (!userVehiclesSuccess) return [];

    // Handle new grouped format
    if (userVehicleResponse?.groups && Array.isArray(userVehicleResponse.groups)) {
      console.log('✅ Using grouped format from API:', userVehicleResponse.groups);
      return userVehicleResponse.groups;
    }

    // Handle old flat format - transform it to grouped format
    if (userVehicleResponse?.items && Array.isArray(userVehicleResponse.items)) {
      console.log('🔄 Converting old items format to grouped format...');

      // Group vehicles by their vehicleGroup field (or 'Ungrouped' if none)
      const groupMap = new Map<string, VehicleItem[]>();

      userVehicleResponse.items.forEach((vehicle: any) => {
        const groupName = vehicle.vehicleGroup || vehicle.brand || 'Ungrouped';

        if (!groupMap.has(groupName)) {
          groupMap.set(groupName, []);
        }

        const transformedVehicle: VehicleItem = {
          id: vehicle.id,
          vehicle_type: vehicle.type || 'Standard',
          vehicle_model: vehicle.makeModelId || null,
          vehicle_number: vehicle.number,
          vehicle_name: vehicle.alias || vehicle.number,
          device: {
            device_name: vehicle.number,
          },
        };

        groupMap.get(groupName)!.push(transformedVehicle);
      });

      // Convert map to grouped format
      let groupId = 1;
      const groups: VehicleGroup[] = Array.from(groupMap).map(([groupName, vehicles]) => ({
        group_id: groupId++,
        group_name: groupName,
        vehicle_count: vehicles.length,
        vehicles: vehicles,
      }));

      console.log('✅ Transformed to grouped format:', groups);
      return groups;
    }

    // Fallback for completely empty response
    console.warn('⚠️ Response has neither groups nor items field:', userVehicleResponse);
    return [];
  }, [userVehiclesSuccess, userVehicleResponse]);

  // Debug log
  if (userVehiclesSuccess) {
    console.log('🚗 Vehicles query state:', {
      isLoading: userVehiclesLoading,
      isFetching: userVehiclesFetching,
      isSuccess: userVehiclesSuccess,
      hasResponse: !!userVehicleResponse,
      responseKeys: userVehicleResponse ? Object.keys(userVehicleResponse) : [],
      hasGroups: !!userVehicleResponse?.groups,
      hasItems: !!userVehicleResponse?.items,
      itemsLength: (userVehicleResponse?.items as any[])?.length ?? 0,
      groupsLength: (userVehicleResponse?.groups as any[])?.length ?? 0,
      vehicleGroupsLength: vehicleGroups.length,
      error: userVehiclesError,
      fullResponse: userVehicleResponse,
    });
  }


  // Generate weeks for the selected month and year
  const availableWeeks = useMemo(() => {
    return generateWeeksForMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);
  // Handle accordion group toggle
  const handleGroupToggle = useCallback((groupId: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);
  // Handle vehicle selection with 5 vehicle limit
  const handleVehicleToggle = useCallback((vehicle: VehicleItem) => {
    setSelectedVehicles(prev => {
      const isSelected = prev.some(v => v.id === vehicle.id);
      if (isSelected) {
        return prev.filter(v => v.id !== vehicle.id);
      } else {
        if (prev.length >= 5) {
          showSafeAlert(
            mountedRef,
            'Selection Limit',
            'You can only select up to 5 vehicles at a time.',
          );
          return prev;
        }
        return [...prev, vehicle];
      }
    });
  }, []);

  // Handle date selection
  const handleDateConfirm = useCallback((date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  }, []);

  // Handle year selection for monthly summary
  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  // Handle month selection for monthly summary
  const handleMonthChange = useCallback((month: number) => {
    setSelectedMonth(month);
    // Clear selected week when month changes
    setSelectedWeek(null);
  }, []);

  // Handle week selection - only one week at a time
  const handleWeekToggle = useCallback((week: WeekInfo) => {
    console.log(week, 'week');
    setSelectedWeek(prev => {
      // If clicking the same week, deselect it
      if (prev && prev.id === week.id) {
        return null;
      }
      // Otherwise, select the new week
      return week;
    });

    // Set selectedDate to the week's start date for API usage
    setSelectedDate(week.startDate);
  }, []);

  // Handle week accordion toggle
  const handleWeeksToggle = useCallback(() => {
    setExpandedWeeks(prev => !prev);
  }, []);

  // Handle report generation
  const handleGenerateReport = useCallback(
    async (report: ReportType) => {
      console.log(selectedVehicles, 'selectedVehicles');
      console.log('🚗 Vehicle IDs about to be sent:', selectedVehicles.map(v => ({ id: v.id, name: v.vehicle_name })));
      if (selectedVehicles.length === 0) {
        showSafeAlert(
          mountedRef,
          'No Vehicles Selected',
          'Please select at least one vehicle to generate a report.',
        );
        return;
      }

      // For Weekly Summary Report, check if a week is selected
      if (report === 'Weekly Summary Report' && !selectedWeek) {
        showSafeAlert(
          mountedRef,
          'No Week Selected',
          'Please select a week to generate the weekly summary report.',
        );
        return;
      }

      // Set loading state
      setIsGeneratingReport(true);

      try {
        let startDate: string;
        let endDate: string;

        // Special handling for different report types
        if (report === 'Weekly Summary Report') {
          // For weekly summary: use the selected week's start and end dates
          if (selectedWeek) {
            startDate = formatDateForAPI(selectedWeek.startDate, true);  // 12:00:00 AM
            endDate = formatDateForAPI(selectedWeek.endDate, false);     // 11:59:59 PM
          } else {
            // Fallback to selectedDate if no week selected
            startDate = formatDateForAPI(selectedDate, true);
            endDate = formatDateForAPI(selectedDate, false);
          }
        } else if (report === 'Monthly Summary Report' || report === 'Vehicle Scoring Report') {
          // For monthly summary: use selected year and month
          const startDateObj = new Date(selectedYear, selectedMonth - 1, 1); // First day of month
          const endDateObj = new Date(selectedYear, selectedMonth, 0); // Last day of month

          startDate = formatDateForAPI(startDateObj, true);  // 12:00:00 AM
          endDate = formatDateForAPI(endDateObj, false);     // 11:59:59 PM
        } else {
          // For all other reports: use the same day (start and end of selected date)
          const { startDate: sameDayStart, endDate: sameDayEnd } = formatDateRangeForAPI(selectedDate);
          startDate = sameDayStart;
          endDate = sameDayEnd;
        }

        console.log('📅 Report generation - Selected date:', selectedDate, 'Formatted dates:', { startDate, endDate });

        const result = await generateReport(
          report,
          selectedVehicles.map(v => String(v.id)), // pass vehicle IDs as strings
          startDate,  // Formatted start date
          endDate,    // Formatted end date
        );
        console.log('Report result:', result);

        // Result is guaranteed valid from polling - polling only returns data when status = 'Completed'
        // Keep this safety check as a last resort
        if (!result) {
          showSafeAlert(
            mountedRef,
            'No Data Found',
            'Report data is empty. Please try again.',
          );
          return;
        }

        // Navigate only if data exists
        const dateParams = {
          selectedDate: selectedDate.toISOString(),
          selectedYear,
          selectedMonth,
          startDate,
          endDate,
        };

        if (report === 'Trip Report') {
          (navigation as any).navigate('TripReport', {
            report: result,
            ...dateParams
          });
        } else if (report === 'Monthly Summary Report') {
          (navigation as any).navigate('MonthlySummaryReport', {
            report: result,
            ...dateParams
          });
        } else if (report === 'Weekly Summary Report') {
          (navigation as any).navigate('WeeklySummaryReport', {
            report: result,
            ...dateParams
          });
        } else if (report === 'Daily Summary Report') {
          (navigation as any).navigate('DailySummaryReport', {
            report: result,
            ...dateParams
          });
        } else if (report === 'Vehicle Scoring Report') {
          (navigation as any).navigate('VehicleScoringReportList', {
            data: result,
            ...dateParams
          });
        } else if (report === 'Position Activity Report') {
          (navigation as any).navigate('PositionActivityReportList', {
            data: result,
            ...dateParams
          });
        } else if (report === 'Speed Violation Report') {
          (navigation as any).navigate('SpeedVoilationReportList', {
            data: result,
            ...dateParams
          });
        } else if (report === 'Geofence Polygon Report') {
          (navigation as any).navigate('GeoFenceReportList', {
            data: result,
            ...dateParams
          });
        }

        // Alert.alert(
        //   'Report Generated',
        //   `Report for ${selectedVehicles.length} vehicle(s) generated successfully.`,
        // );

      } catch (error) {
        console.error('Report generation failed:', error);

        const errorMsg = error instanceof Error ? error.message : 'Unknown error';

        // Handle specific polling errors
        if (errorMsg.includes('timeout')) {
          showSafeAlert(
            mountedRef,
            'Generation Timeout',
            'Report generation took too long (exceeded 40 seconds). Please try again.',
          );
        } else if (errorMsg.includes('No data found')) {
          showSafeAlert(
            mountedRef,
            'No Data Found',
            'No reports found for the selected dates and vehicles.',
          );
        } else if (errorMsg.includes('Report generation failed')) {
          // Backend returned Failed status with error message
          showSafeAlert(
            mountedRef,
            'Generation Failed',
            errorMsg.replace('Report generation failed: ', ''),
          );
        } else {
          // Other errors (network, validation, etc.)
          showSafeAlert(
            mountedRef,
            'Error',
            'An error occurred while generating the report. Please try again.',
          );
        }
      } finally {
        // Clear loading state
        setIsGeneratingReport(false);
      }
    },
    [generateReport, selectedVehicles, selectedDate, selectedYear, selectedMonth],
  );

  // Reset selections
  const handleReset = useCallback(() => {
    setSearchQuery('');
    setSelectedVehicles([]);
    setSelectedWeek(null);
    setExpandedWeeks(false);
    setPageIndex(1);
    setSelectedDate(new Date());
    setSelectedYear(() => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      return currentMonth === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    });
    setSelectedMonth(() => {
      const currentMonth = new Date().getMonth() + 1;
      return currentMonth === 1 ? 12 : currentMonth - 1;
    });
    setExpandedGroups({});
  }, []);

  // Pagination handlers
  const handleNextPage = useCallback(() => {
    const totalVehicles = userVehicleResponse?.total_vehicles ?? 0;
    if (totalVehicles > pageIndex * pageSize) {
      setPageIndex(pageIndex + 1);
    }
  }, [pageIndex, userVehicleResponse, pageSize]);

  const handlePrevPage = useCallback(() => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  }, [pageIndex]);

  return {
    // States
    selectedDate,
    showDatePicker,
    searchQuery,
    selectedVehicles,
    expandedGroups,
    vehicleGroups,
    userVehiclesLoading,
    userVehiclesError,
    userVehiclesFetching,
    userVehiclesSuccess,
    pageIndex,
    pageSize,
    selectedYear,
    selectedMonth,
    isGeneratingReport,
    selectedWeek,
    expandedWeeks,
    availableWeeks,

    // Actions
    setShowDatePicker,
    setSearchQuery,
    handleGroupToggle,
    handleVehicleToggle,
    handleDateConfirm,
    handleYearChange,
    handleMonthChange,
    handleWeekToggle,
    handleWeeksToggle,
    handleGenerateReport,
    handleReset,
    handleNextPage,
    handlePrevPage,
  };
};
