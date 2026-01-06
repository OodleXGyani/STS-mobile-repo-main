import React, { useMemo } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

import Header from './components/ReportHeader';
import ReportOptionItem from './components/ReportOptionItem';
import { Colors } from '../../constants/colors';
import Icons from '../../common/icons';
import {
  useGetAccessibleReportsQuery,
  ReportItem,
} from '../../services/reports';
import { REPORT_META } from '../../services/reportMeta';

/* ================= TYPES ================= */

type ReportsScreenNavigationProp = any;

/* ================= STYLES ================= */

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const ScrollArea = styled(ScrollView)`
  padding-top: ${verticalScale(32)}px;
`;

const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${verticalScale(40)}px;
`;

const NoDataText = styled.Text`
  font-size: ${scale(16)}px;
  color: #666;
  text-align: center;
`;

const contentPadding = {
  paddingHorizontal: scale(18),
  paddingBottom: verticalScale(24),
};

const ComingSoonLabel = styled.Text`
  font-size: ${scale(11)}px;
  color: #999;
  font-style: italic;
  margin-top: ${scale(4)}px;
`;

const DisabledReportContainer = styled.View`
  opacity: 0.6;
`;

const SectionDivider = styled.View`
  height: 1px;
  background-color: #e0e0e0;
  margin: ${verticalScale(16)}px 0;
`;

const SectionTitle = styled.Text`
  font-size: ${scale(14)}px;
  color: #666;
  font-weight: 600;
  padding-left: ${scale(18)}px;
  margin-top: ${verticalScale(12)}px;
  margin-bottom: ${verticalScale(8)}px;
`;

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.primary_blue_color};
`;

const ErrorText = styled.Text`
  color: red;
  font-size: ${scale(16)}px;
`;

const LoadingText = styled.Text`
  margin-top: ${verticalScale(16)}px;
  color: #666;
`;

const UpdatingText = styled.Text`
  margin-top: ${verticalScale(8)}px;
  color: #666;
`;

/* ================= CONSTANTS ================= */

/**
 * Static mapping of report titles to REPORT_META keys
 * Defined outside component to avoid unnecessary re-renders and dependency issues
 */
const TITLE_TO_META_KEY_MAP: Record<string, keyof typeof REPORT_META> = {
  'Daily Summary Report': 'daily',
  'Weekly Summary Report': 'weekly',
  'Monthly Summary Report': 'monthly',
  'Trip Report': 'trip',
  'Position Activity Report': 'history',
  'Speed Violation Report': 'speed_violation',
  'Harsh Violation Report': 'harsh',
  'Vehicle Scoring Report': 'vehicle_scoring',
  'Geofence Polygon Report': 'geofence_speed',
  'Vehicle Path Report': 'vehicle_path',
  'Idle Report': 'idle',
  'Panic Alarm Report': 'panic_alarm',
  'Ignition Off Report': 'ignition_off',
  'Time In/Out Report': 'time_in_out',
  'Temperature Report': 'temperature',
  'Stoppage Report': 'stoppage',
  'Untagged Driver Report': 'untagged_driver',
  'Out of Working Hour Report': 'outoff_workinghour',
  'Speed Duration Report': 'speed_duration',
  'Seatbelt Violation Report': 'seatbelt_violation',
  'Driver Scoring Report': 'driver_scoring',
  'Panic Button Report': 'panic_button',
};

/* ================= SCREEN ================= */

const ReportsScreen: React.FC = () => {
  const navigation = useNavigation<ReportsScreenNavigationProp>();

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetAccessibleReportsQuery({
    pageIndex: 1,
    pageSize: 50,
    searchText: '', // REQUIRED by API
  });

  /**
   * Ensure reports is ALWAYS an array
   */
  const reports: ReportItem[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  /**
   * Map reports to include whether they're coming soon
   */
  const reportsWithStatus = useMemo(
    () =>
      reports.map((report: ReportItem) => {
        const metaKey = TITLE_TO_META_KEY_MAP[report.title];
        const reportMeta = metaKey ? REPORT_META[metaKey] : null;

        return {
          ...report,
          isComingSoon: reportMeta ? !reportMeta.isImplemented : false,
        };
      }),
    [reports],
  );

  /**
   * Separate implemented and coming soon reports
   */
  const { implementedReports, comingSoonReports } = useMemo(
    () => {
      const implemented: (ReportItem & { isComingSoon: boolean })[] = [];
      const comingSoon: (ReportItem & { isComingSoon: boolean })[] = [];

      const supportedReportTitles = [
        'Position Activity Report',
        'Speed Violation Report',
        'Trip Report',
        'Weekly Summary Report',
        'Daily Summary Report',
        'Monthly Summary Report',
        'Geofence Polygon Report',
        'Vehicle Scoring Report',
        'Idle Report',
        'Panic Alarm Report',
        'Ignition Off Report',
        'Time In/Out Report',
        'Temperature Report',
        'Stoppage Report',
        'Untagged Driver Report',
        'Out of Working Hour Report',
        'Speed Duration Report',
        'Seatbelt Violation Report',
        'Driver Scoring Report',
        'Panic Button Report',
      ];

      reportsWithStatus.forEach((report) => {
        if (!supportedReportTitles.includes(report.title)) {
          return;
        }

        if (report.isComingSoon) {
          comingSoon.push(report);
        } else {
          implemented.push(report);
        }
      });

      return { implementedReports: implemented, comingSoonReports: comingSoon };
    },
    [reportsWithStatus],
  );

  /* ================= HANDLERS ================= */

  const onMenuPress = () => {
    console.log('Menu pressed');
  };

  const onOptionPress = (title: string) => () => {
    navigation.navigate('ReportDetail', { report: title });
  };

  const getReportIcon = (title: string) => {
    switch (title) {
      case 'Position Activity Report':
        return Icons.position_blue;
      case 'Speed Violation Report':
        return Icons.speed_blue;
      case 'Trip Report':
        return Icons.trip_blue;
      case 'Weekly Summary Report':
        return Icons.calender_weekly_blue;
      case 'Daily Summary Report':
        return Icons.calender_daily_blue;
      case 'Monthly Summary Report':
        return Icons.calender_monthly_blue;
      case 'Geofence Polygon Report':
        return Icons.geofence_blue;
      case 'Vehicle Scoring Report':
        return Icons.fleet_utilization_blue;
      default:
        return Icons.report_blue;
    }
  };

  /* ================= STATES ================= */

  if (isLoading) {
    return (
      <SafeAreaContainer>
        <Container>
          <Header title="Reports" onMenuPress={onMenuPress} />
          <CenterContainer>
            <ActivityIndicator size="large" color={Colors.primary_blue_color} />
            <LoadingText>Loading reports...</LoadingText>
          </CenterContainer>
        </Container>
      </SafeAreaContainer>
    );
  }

  if (error) {
    console.error('🚨 Reports Screen Error:', {
      error,
      status: 'status' in error ? error.status : 'unknown',
      data: error.data || 'no data',
    });

    return (
      <SafeAreaContainer>
        <Container>
          <Header title="Reports" onMenuPress={onMenuPress} />
          <CenterContainer>
            <ErrorText>Failed to load reports. Please try again.</ErrorText>
            {__DEV__ && (
              <NoDataText style={{ marginTop: 16, color: '#999' }}>
                Error: {JSON.stringify(error, null, 2)}
              </NoDataText>
            )}
          </CenterContainer>
        </Container>
      </SafeAreaContainer>
    );
  }

  /* ================= RENDER ================= */

  return (
    <SafeAreaContainer>
      <Container>
        <Header title="Reports" onMenuPress={onMenuPress} />

        <ScrollArea contentContainerStyle={contentPadding}>
          {implementedReports.length > 0 || comingSoonReports.length > 0 ? (
            <>
              {/* Available Reports Section */}
              {implementedReports.length > 0 && (
                <>
                  <SectionTitle>Available Reports</SectionTitle>
                  {implementedReports.map((report: ReportItem & { isComingSoon: boolean }) => (
                    <ReportOptionItem
                      key={report.id}
                      icon={getReportIcon(report.title)}
                      label={report.title}
                      onPress={onOptionPress(report.title)}
                    />
                  ))}
                </>
              )}

              {/* Coming Soon Section */}
              {comingSoonReports.length > 0 && (
                <>
                  {implementedReports.length > 0 && <SectionDivider />}
                  <SectionTitle>Coming Soon</SectionTitle>
                  {comingSoonReports.map((report: ReportItem & { isComingSoon: boolean }) => (
                    <DisabledReportContainer key={report.id}>
                      <ReportOptionItem
                        icon={getReportIcon(report.title)}
                        label={report.title}
                        onPress={undefined}
                        disabled={true}
                      />
                      <ComingSoonLabel>Available in upcoming release</ComingSoonLabel>
                    </DisabledReportContainer>
                  ))}
                </>
              )}

              {isFetching && (
                <CenterContainer>
                  <ActivityIndicator size="small" color={Colors.primary_blue_color} />
                  <UpdatingText>Updating...</UpdatingText>
                </CenterContainer>
              )}
            </>
          ) : (
            <CenterContainer>
              <NoDataText>No reports available</NoDataText>
            </CenterContainer>
          )}
        </ScrollArea>
      </Container>
    </SafeAreaContainer>
  );
};

export default ReportsScreen;
