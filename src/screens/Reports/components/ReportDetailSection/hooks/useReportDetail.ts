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
import { formatDateRangeForAPI, formatDateForAPI, formatDateToISO } from '../../../../../utils/dateFormatter';
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigation = useNavigation();

  // Year and month selection for monthly summary reports
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    return currentMonth === 1 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth === 1 ? 12 : currentMonth - 1;
  });

  // Week selection state
  const [selectedWeek, setSelectedWeek] = useState<WeekInfo | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<boolean>(false);

  // Vehicle Scoring Report scoring weights state
  const [scoringWeights, setScoringWeights] = useState({
    f1_OverSpeeding: 0,
    f2_ExcessOverSpeeding: 0,
    f3_SeatBeltViolation: 0,
    f4_HarshCornering: 0,
    f5_HarshBraking: 0,
  });

  const { generateReport, states } = useGenerateReport();
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

  // Call the RTK Query to get user vehicles
  const {
    data: userVehicleResponse,
    error: userVehiclesError,
    isLoading: userVehiclesLoading,
    isFetching: userVehiclesFetching,
    isSuccess: userVehiclesSuccess,
  } = useGetUserVehiclesQuery({
    pageIndex: 1,
    pageSize: 1000,
    searchText: '',
  });

  // Extract groups directly from backend response
  const vehicleGroups: VehicleGroup[] = useMemo(() => {
    if (!userVehiclesSuccess || !userVehicleResponse) {
      console.log('🚗 [useReportDetail] Waiting for response');
      return [];
    }

    console.log('🚗 [useReportDetail] Raw response:', userVehicleResponse);
    console.log('🚗 [useReportDetail] Response type:', typeof userVehicleResponse, 'is Array:', Array.isArray(userVehicleResponse));

    let groupsArray: any[] = [];

    // Format 1: Wrapped object with "groups" field (pre-grouped from backend)
    if ('groups' in userVehicleResponse && Array.isArray(userVehicleResponse.groups)) {
      console.log('✅ [useReportDetail] Using wrapped groups format:', userVehicleResponse.groups.length, 'groups');
      groupsArray = userVehicleResponse.groups;
    }
    // Format 2: Direct array of groups with "name" field (pre-grouped from backend)
    else if (Array.isArray(userVehicleResponse)) {
      console.log('✅ [useReportDetail] Direct array format detected:', userVehicleResponse.length, 'groups');
      groupsArray = userVehicleResponse;
    }
    // Format 3: Wrapped response with "data" field containing groups
    else if ('data' in userVehicleResponse && Array.isArray(userVehicleResponse.data)) {
      console.log('✅ [useReportDetail] Using data field format:', userVehicleResponse.data.length, 'groups');
      groupsArray = userVehicleResponse.data;
    }
    // Format 4: Flat vehicles list that needs to be grouped by vehicle type (typeName or typeId)
    else if ('items' in userVehicleResponse && Array.isArray(userVehicleResponse.items)) {
      console.log('✅ [useReportDetail] Detected items array format with', userVehicleResponse.items.length, 'vehicles');

      // Group vehicles by their type using typeName (preferred) or typeId (fallback)
      const vehiclesMap = new Map<string, any[]>();

      userVehicleResponse.items.forEach((vehicle: any) => {
        // Apply grouping rule: typeName > typeId > "Unknown Type"
        const groupName =
          vehicle.typeName ??
          (vehicle.typeId ? `Type ${vehicle.typeId}` : 'Unknown Type');

        if (!vehiclesMap.has(groupName)) {
          vehiclesMap.set(groupName, []);
        }
        vehiclesMap.get(groupName)!.push(vehicle);
      });

      // Convert map to array of groups
      let groupId = 1;
      groupsArray = Array.from(vehiclesMap.entries()).map(([groupName, vehicles]) => ({
        name: groupName,
        group_id: groupId++,
        vehicles: vehicles,
      }));

      console.log('✅ [useReportDetail] Grouped items by vehicle type:', Array.from(vehiclesMap.keys()).map(k => `${k}(${vehiclesMap.get(k)!.length})`).join(', '));
    }
    // Format 5: Response with direct vehicles list
    else if ('vehicles' in userVehicleResponse && Array.isArray(userVehicleResponse.vehicles)) {
      console.log('✅ [useReportDetail] Using vehicles field format');
      groupsArray = [{ name: 'All Vehicles', vehicles: userVehicleResponse.vehicles }];
    }
    else {
      console.warn('⚠️ [useReportDetail] Unexpected response format:', userVehicleResponse);
      console.warn('Available keys:', Object.keys(userVehicleResponse));
      return [];
    }

    // Transform groups to VehicleGroup format
    let groupId = 1;
    const result = groupsArray.map((group: any) => {
      const transformedVehicles: VehicleItem[] = (group.vehicles || []).map((v: any) => ({
        id: v.id,
        vehicle_type: v.vehicle_type || 'Other',
        vehicle_model: v.vehicle_model || null,
        vehicle_number: v.vehicle_Number || v.vehicle_number || 'N/A',
        vehicle_name: v.vehicle_name || 'N/A',
        alias: v.alias || undefined,
        device: {
          device_name: v.device_name || 'N/A',
        },
        typeName: v.typeName || undefined,
        typeId: v.typeId || undefined,
      }));

      return {
        group_id: groupId++,
        // Use group_name if available, otherwise fallback to name
        group_name: group.group_name || group.name || 'Unknown',
        vehicle_count: transformedVehicles.length,
        vehicles: transformedVehicles,
      };
    });

    console.log('📊 [useReportDetail] Final vehicle groups:', result.length, 'groups');
    return result;
  }, [userVehiclesSuccess, userVehicleResponse]);

  // Generate weeks for the selected month and year
  const availableWeeks = useMemo(() => {
    return generateWeeksForMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const handleGroupToggle = useCallback((groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

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

  const handleDateConfirm = useCallback((date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  const handleMonthChange = useCallback((month: number) => {
    setSelectedMonth(month);
    setSelectedWeek(null);
  }, []);

  const handleWeekToggle = useCallback((week: WeekInfo) => {
    setSelectedWeek(prev => {
      if (prev && prev.id === week.id) {
        return null;
      }
      return week;
    });
    setSelectedDate(week.startDate);
  }, []);

  const handleWeeksToggle = useCallback(() => {
    setExpandedWeeks(prev => !prev);
  }, []);

  const handleGenerateReport = useCallback(
    async (report: ReportType, scoringWeightsParam?: typeof scoringWeights) => {
      console.log(selectedVehicles, 'selectedVehicles');
      if (selectedVehicles.length === 0) {
        showSafeAlert(
          mountedRef,
          'No Vehicles Selected',
          'Please select at least one vehicle to generate a report.',
        );
        return;
      }

      if (report === 'Weekly Summary Report' && !selectedWeek) {
        showSafeAlert(
          mountedRef,
          'No Week Selected',
          'Please select a week to generate the weekly summary report.',
        );
        return;
      }

      setIsGeneratingReport(true);

      try {
        let startDate: string;
        let endDate: string;

        if (report === 'Daily Summary Report') {
          // Daily Summary Report requires ISO 8601 format per API spec
          startDate = formatDateToISO(selectedDate, true);
          endDate = formatDateToISO(selectedDate, false);
        } else if (report === 'Weekly Summary Report') {
          if (selectedWeek) {
            startDate = formatDateToISO(selectedWeek.startDate, true);
            endDate = formatDateToISO(selectedWeek.endDate, false);
          } else {
            startDate = formatDateToISO(selectedDate, true);
            endDate = formatDateToISO(selectedDate, false);
          }
        } else if (report === 'Position Activity Report' || report === 'Trip Report') {
          // Position Activity Report and Trip Report require ISO 8601 format per API spec
          startDate = formatDateToISO(selectedDate, true);
          endDate = formatDateToISO(selectedDate, false);
        } else if (report === 'Monthly Summary Report') {
          // Monthly Summary Report requires ISO 8601 format per API spec
          const startDateObj = new Date(selectedYear, selectedMonth - 1, 1);
          const endDateObj = new Date(selectedYear, selectedMonth, 0);

          startDate = formatDateToISO(startDateObj, true);
          endDate = formatDateToISO(endDateObj, false);
        } else if (report === 'Vehicle Scoring Report') {
          const startDateObj = new Date(selectedYear, selectedMonth - 1, 1);
          const endDateObj = new Date(selectedYear, selectedMonth, 0);

          startDate = formatDateForAPI(startDateObj, true);
          endDate = formatDateForAPI(endDateObj, false);
        } else {
          const { startDate: sameDayStart, endDate: sameDayEnd } = formatDateRangeForAPI(selectedDate);
          startDate = sameDayStart;
          endDate = sameDayEnd;
        }

        const result = await generateReport(
          report,
          selectedVehicles.map(v => String(v.id)),
          startDate,
          endDate,
          scoringWeightsParam ?? scoringWeights,
        );

        if (!result) {
          showSafeAlert(
            mountedRef,
            'No Data Found',
            'Report data is empty. Please try again.',
          );
          return;
        }

        const dateParams = {
          selectedDate: selectedDate.toISOString(),
          selectedYear,
          selectedMonth,
          startDate,
          endDate,
        };

        if (report === 'Trip Report') {
          console.log('🧭 [useReportDetail] Navigating to TripReport');
          console.log('🧭 [useReportDetail] Result type:', typeof result);
          console.log('🧭 [useReportDetail] Is result array?', Array.isArray(result));
          console.log('🧭 [useReportDetail] Result keys:', Array.isArray(result) ? 'N/A (array)' : Object.keys(result || {}));
          console.log('🧭 [useReportDetail] Full result object:', JSON.stringify(result, null, 2).substring(0, 500));
          console.log('🧭 [useReportDetail] Navigation params:', { report: result, ...dateParams });
          (navigation as any).navigate('TripReport', { report: result, ...dateParams });
        } else if (report === 'Monthly Summary Report') {
          (navigation as any).navigate('MonthlySummaryReport', { report: result, ...dateParams });
        } else if (report === 'Weekly Summary Report') {
          (navigation as any).navigate('WeeklySummaryReport', { report: result, ...dateParams });
        } else if (report === 'Daily Summary Report') {
          (navigation as any).navigate('DailySummaryReport', { report: result, ...dateParams });
        } else if (report === 'Vehicle Scoring Report') {
          (navigation as any).navigate('VehicleScoringReportList', { data: result, ...dateParams });
        } else if (report === 'Position Activity Report') {
          (navigation as any).navigate('PositionActivityReportList', { data: result, ...dateParams });
        } else if (report === 'Speed Violation Report') {
          (navigation as any).navigate('SpeedVoilationReportList', { data: result, ...dateParams });
        } else if (report === 'Geofence Polygon Report') {
          (navigation as any).navigate('GeoFenceReportList', { data: result, ...dateParams });
        }
      } catch (error) {
        console.error('Report generation failed:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';

        if (errorMsg.includes('timeout')) {
          showSafeAlert(
            mountedRef,
            'Generation Timeout',
            'Report generation took too long. Please try again.',
          );
        } else if (errorMsg.includes('No data found')) {
          showSafeAlert(
            mountedRef,
            'No Data Found',
            'No reports found for the selected dates and vehicles.',
          );
        } else if (errorMsg.includes('Report generation failed')) {
          showSafeAlert(
            mountedRef,
            'Generation Failed',
            errorMsg.replace('Report generation failed: ', ''),
          );
        } else {
          showSafeAlert(
            mountedRef,
            'Error',
            'An error occurred while generating the report. Please try again.',
          );
        }
      } finally {
        setIsGeneratingReport(false);
      }
    },
    [generateReport, selectedVehicles, selectedDate, selectedYear, selectedMonth, selectedWeek, navigation, scoringWeights],
  );

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

  const handleNextPage = useCallback(() => {
    const totalVehicles = userVehicleResponse && 'total_vehicles' in userVehicleResponse ? userVehicleResponse.total_vehicles : 0;
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
    scoringWeights,
    setScoringWeights,
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
