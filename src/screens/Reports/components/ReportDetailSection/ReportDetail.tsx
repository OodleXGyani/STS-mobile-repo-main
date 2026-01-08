import React from 'react';
import { ScrollView, ActivityIndicator, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { verticalScale, scale, moderateScale } from 'react-native-size-matters';
import { SimpleDatePicker } from '../../../../components/DatePicker/SimpleDatePicker';
import { Colors } from '../../../../constants/colors';
import {
  ReportHeader,
  DateSelection,
  YearMonthSelection,
  VehicleSearch,
  VehicleAccordion,
  DebugVehicleGroups,
  WeekCheckbox,
  GenerateReportButton,
} from './components';
import { useReportDetail } from './hooks/useReportDetail';
import { ReportType } from '../../../../constants/reportTypes';

const ReportDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { report } = route.params as { report: string };

  const {
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
  } = useReportDetail();

  // Show loading state
  if (userVehiclesLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.primary_blue_color }}
      >
        <ReportHeader
          title={report}
          onBackPress={() => navigation.goBack()}
        />
        <LoadingContainer>
          <ActivityIndicator size="large" color={Colors.primary_blue_color} />
          <LoadingText>Loading vehicles...</LoadingText>
        </LoadingContainer>
      </SafeAreaView>
    );
  }

  // Show error state
  if (userVehiclesError) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.primary_blue_color }}
      >
        <ReportHeader
          title={report}
          onBackPress={() => navigation.goBack()}
        />
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Failed to Load Vehicles</ErrorTitle>
          <ErrorText>
            Something went wrong while loading the vehicle list. Please check
            your connection and try again.
          </ErrorText>
          <RetryButton
            onPress={() => {
              setSearchQuery('');
            }}
          >
            <RetryButtonText>Retry</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.primary_blue_color }}
    >
      <ReportHeader
        title={report}
        onBackPress={() => navigation.goBack()}
      />

      <Content>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Show YearMonthSelection for Monthly Summary Report, DateSelection for others */}
          {report === 'Monthly Summary Report' ||
          report === 'Vehicle Scoring Report' || report === 'Weekly Summary Report' ? (
            <>
              <YearMonthSelection
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                onYearChange={handleYearChange}
                onMonthChange={handleMonthChange}
              />

              {/* Week selection for Weekly Summary Report */}
              {report === 'Weekly Summary Report' && (
                <WeekCheckbox
                  availableWeeks={availableWeeks}
                  selectedWeek={selectedWeek}
                  expandedWeeks={expandedWeeks}
                  onWeekToggle={handleWeekToggle}
                  onWeeksToggle={handleWeeksToggle}
                />
              )}

              {/* Scoring Weights for Vehicle Scoring Report */}
              {report === 'Vehicle Scoring Report' && (
                <ScoringWeightsSection>
                  <SectionLabel>Scoring Weights</SectionLabel>
                  <ScoringWeightsNote>
                    Adjust the weight for each violation type (higher values = higher impact on score)
                  </ScoringWeightsNote>

                  <ScoringWeightsGrid>
                    <ScoringWeightInputGroup>
                      <ScoringWeightLabel>F1: Over-Speeding</ScoringWeightLabel>
                      <ScoringWeightInput
                        placeholder="5"
                        value={String(scoringWeights.f1_OverSpeeding)}
                        onChangeText={(value) => {
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setScoringWeights(prev => ({
                              ...prev,
                              f1_OverSpeeding: numValue,
                            }));
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </ScoringWeightInputGroup>

                    <ScoringWeightInputGroup>
                      <ScoringWeightLabel>F2: Excess Over-Speeding</ScoringWeightLabel>
                      <ScoringWeightInput
                        placeholder="2"
                        value={String(scoringWeights.f2_ExcessOverSpeeding)}
                        onChangeText={(value) => {
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setScoringWeights(prev => ({
                              ...prev,
                              f2_ExcessOverSpeeding: numValue,
                            }));
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </ScoringWeightInputGroup>

                    <ScoringWeightInputGroup>
                      <ScoringWeightLabel>F3: Seatbelt Violation</ScoringWeightLabel>
                      <ScoringWeightInput
                        placeholder="3"
                        value={String(scoringWeights.f3_SeatBeltViolation)}
                        onChangeText={(value) => {
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setScoringWeights(prev => ({
                              ...prev,
                              f3_SeatBeltViolation: numValue,
                            }));
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </ScoringWeightInputGroup>

                    <ScoringWeightInputGroup>
                      <ScoringWeightLabel>F4: Harsh Cornering</ScoringWeightLabel>
                      <ScoringWeightInput
                        placeholder="4"
                        value={String(scoringWeights.f4_HarshCornering)}
                        onChangeText={(value) => {
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setScoringWeights(prev => ({
                              ...prev,
                              f4_HarshCornering: numValue,
                            }));
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </ScoringWeightInputGroup>

                    <ScoringWeightInputGroup>
                      <ScoringWeightLabel>F5: Harsh Braking</ScoringWeightLabel>
                      <ScoringWeightInput
                        placeholder="1"
                        value={String(scoringWeights.f5_HarshBraking)}
                        onChangeText={(value) => {
                          const numValue = parseInt(value, 10);
                          if (!isNaN(numValue) && numValue >= 0) {
                            setScoringWeights(prev => ({
                              ...prev,
                              f5_HarshBraking: numValue,
                            }));
                          }
                        }}
                        keyboardType="numeric"
                        maxLength={3}
                      />
                    </ScoringWeightInputGroup>
                  </ScoringWeightsGrid>
                </ScoringWeightsSection>
              )}
            </>
          ) : (
            <DateSelection
              selectedDate={selectedDate}
              onDatePress={() => setShowDatePicker(true)}
            />
          )}

          <VehicleSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onReset={handleReset}
          />

          {/* Show loading state first */}
          {(userVehiclesLoading || userVehiclesFetching) && !userVehiclesSuccess ? (
            <VehicleLoadingContainer>
              <ActivityIndicator size="large" color={Colors.primary_blue_color} />
              <VehicleLoadingText>Loading vehicles...</VehicleLoadingText>
            </VehicleLoadingContainer>
          ) : userVehiclesSuccess && vehicleGroups.length === 0 ? (
            // Show no data message ONLY after success and vehicles are truly empty
            <NoDataContainer>
              <NoDataIcon>🚗</NoDataIcon>
              <NoDataTitle>No Vehicles Found</NoDataTitle>
              <NoDataText>
                {searchQuery
                  ? `No vehicles found matching "${searchQuery}"`
                  : 'No vehicles are currently available for this report.'}
              </NoDataText>
              {searchQuery && (
                <ClearSearchButton onPress={handleReset}>
                  <ClearSearchText>Clear Search</ClearSearchText>
                </ClearSearchButton>
              )}
            </NoDataContainer>
          ) : (
            <>
              <VehicleAccordion
                vehicleGroups={vehicleGroups}
                expandedGroups={expandedGroups}
                selectedVehicles={selectedVehicles}
                onGroupToggle={handleGroupToggle}
                onVehicleToggle={handleVehicleToggle}
              />

              {/* Debug Info - Shows group structure */}
              {/* <DebugVehicleGroups vehicleGroups={vehicleGroups} /> */}

              {/* Pagination Controls */}
              {/* {vehicleGroups.length > 0 && (
                <PaginationContainer>
                  <PageButton disabled={pageIndex === 1} onPress={handlePrevPage}>
                    <PageButtonText>Previous</PageButtonText>
                  </PageButton>
                  <PageText>Page {pageIndex}</PageText>
                  <PageButton
                    disabled={vehicleGroups.length < pageSize}
                    onPress={handleNextPage}
                  >
                    <PageButtonText>Next</PageButtonText>
                  </PageButton>
                </PaginationContainer>
              )} */}

              {/* Fetching indicator */}
              {userVehiclesFetching && (
                <FetchingContainer>
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary_blue_color}
                  />
                  <FetchingText>Updating...</FetchingText>
                </FetchingContainer>
              )}
            </>
          )}
        </ScrollView>
      </Content>

      {/* Only show generate button if vehicles are available */}
      {vehicleGroups && vehicleGroups.length > 0 && (
        <GenerateReportButton
          onPress={() => handleGenerateReport(report as ReportType, scoringWeights)}
          isGeneratingReport={isGeneratingReport}
        />
      )}

      {/* Only show SimpleDatePicker for non-monthly summary reports */}
      {report !== 'Monthly Summary Report' && (
        <SimpleDatePicker
          visible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          onConfirm={handleDateConfirm}
          initialDate={selectedDate}
          title="Select Date"
        />
      )}

      {/* Loading overlay when generating report */}
      {isGeneratingReport && (
        <LoadingOverlay>
          <LoadingModal>
            <ActivityIndicator size="large" color={Colors.primary_blue_color} />
            <LoadingModalText>Generating Report...</LoadingModalText>
            <LoadingModalSubText>Please wait while we process your request</LoadingModalSubText>
          </LoadingModal>
        </LoadingOverlay>
      )}
    </SafeAreaView>
  );
};

const Content = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding: ${verticalScale(20)}px ${scale(20)}px;
`;

const LoadingContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  padding: ${verticalScale(40)}px;
`;

const LoadingText = styled.Text`
  margin-top: ${verticalScale(16)}px;
  font-size: ${moderateScale(18)}px;
  color: #666;
  text-align: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  padding: ${verticalScale(40)}px;
`;

const ErrorIcon = styled.Text`
  font-size: ${moderateScale(48)}px;
  margin-bottom: ${verticalScale(16)}px;
`;

const ErrorTitle = styled.Text`
  font-size: ${moderateScale(20)}px;
  font-weight: 600;
  color: #d32f2f;
  margin-bottom: ${verticalScale(12)}px;
  text-align: center;
`;

const ErrorText = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: #666;
  text-align: center;
  line-height: ${moderateScale(24)}px;
  margin-bottom: ${verticalScale(24)}px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: ${Colors.primary_blue_color};
  padding: ${verticalScale(12)}px ${scale(24)}px;
  border-radius: ${scale(8)}px;
`;

const RetryButtonText = styled.Text`
  color: #ffffff;
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
`;

const NoDataContainer = styled.View`
  padding: ${verticalScale(40)}px;
  align-items: center;
  justify-content: center;
`;

const NoDataIcon = styled.Text`
  font-size: ${moderateScale(48)}px;
  margin-bottom: ${verticalScale(16)}px;
`;

const NoDataTitle = styled.Text`
  font-size: ${moderateScale(20)}px;
  font-weight: 600;
  color: #666;
  margin-bottom: ${verticalScale(12)}px;
  text-align: center;
`;

const NoDataText = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: #999;
  text-align: center;
  line-height: ${moderateScale(24)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

const ClearSearchButton = styled.TouchableOpacity`
  background-color: #f0f0f0;
  padding: ${verticalScale(8)}px ${scale(16)}px;
  border-radius: ${scale(6)}px;
`;

const ClearSearchText = styled.Text`
  color: #666;
  font-size: ${moderateScale(14)}px;
  font-weight: 500;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${verticalScale(16)}px 0;
  margin-top: ${verticalScale(16)}px;
`;

const PageButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: ${verticalScale(8)}px ${scale(12)}px;
  background-color: ${({ disabled }) =>
    disabled ? '#ccc' : Colors.primary_blue_color};
  border-radius: 4px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const PageButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const PageText = styled.Text`
  font-size: ${scale(14)}px;
  color: #666;
`;

const FetchingContainer = styled.View`
  flex-direction: row;
  padding: ${verticalScale(8)}px;
  align-items: center;
  justify-content: center;
`;

const FetchingText = styled.Text`
  font-size: ${scale(12)}px;
  color: #666;
  margin-left: ${scale(8)}px;
`;

const LoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingModal = styled.View`
  background-color: #ffffff;
  padding: ${verticalScale(32)}px ${scale(24)}px;
  border-radius: ${scale(12)}px;
  align-items: center;
  justify-content: center;
  min-width: ${scale(200)}px;
  max-width: ${scale(280)}px;
  margin: ${scale(20)}px;
`;

const LoadingModalText = styled.Text`
  font-size: ${moderateScale(18)}px;
  font-weight: 600;
  color: #333;
  margin-top: ${verticalScale(16)}px;
  text-align: center;
`;

const LoadingModalSubText = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: #666;
  margin-top: ${verticalScale(8)}px;
  text-align: center;
  line-height: ${moderateScale(20)}px;
`;

const VehicleLoadingContainer = styled.View`
  padding: ${verticalScale(40)}px ${scale(20)}px;
  align-items: center;
  justify-content: center;
`;

const VehicleLoadingText = styled.Text`
  margin-top: ${verticalScale(16)}px;
  font-size: ${moderateScale(16)}px;
  color: #666;
  text-align: center;
`;

const ScoringWeightsSection = styled.View`
  background-color: #f9f9f9;
  border-radius: ${scale(8)}px;
  padding: ${verticalScale(16)}px ${scale(12)}px;
  margin-bottom: ${verticalScale(16)}px;
  border: 1px solid #e0e0e0;
`;

const SectionLabel = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #333;
  margin-bottom: ${verticalScale(8)}px;
`;

const ScoringWeightsNote = styled.Text`
  font-size: ${moderateScale(13)}px;
  color: #666;
  margin-bottom: ${verticalScale(12)}px;
  line-height: ${moderateScale(18)}px;
`;

const ScoringWeightsGrid = styled.View`
  gap: ${verticalScale(12)}px;
`;

const ScoringWeightInputGroup = styled.View`
  margin-bottom: ${verticalScale(4)}px;
`;

const ScoringWeightLabel = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 500;
  color: #555;
  margin-bottom: ${verticalScale(6)}px;
`;

const ScoringWeightInput = styled.TextInput`
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: ${scale(6)}px;
  padding: ${verticalScale(10)}px ${scale(12)}px;
  font-size: ${moderateScale(14)}px;
  color: #333;
`;

export default ReportDetail;
