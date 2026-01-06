import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../constants/colors';

interface SimpleDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  title?: string;
}

export const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate = new Date(),
  title = 'Select Date',
}) => {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());

  // Generate years from 2000 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);

  // Generate months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate calendar days for the selected month/year
  const generateCalendarDays = (year: number, month: number): Date[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    const newDate = new Date(selectedDate);
    newDate.setMonth(month);
    setSelectedDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const formatSelectedDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.toDateString() === date2.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return (
      date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
    );
  };

  const calendarDays = generateCalendarDays(selectedYear, selectedMonth);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Container insets={insets}>
        <Content>
          {/* <Header>
            <Title>{title}</Title>
            <CloseButton onPress={onClose}>
              <CloseText>✕</CloseText>
            </CloseButton>
          </Header> */}

          {/* Selected Date Display */}
          <SelectedDateContainer>
            <SelectedDateLabel>Selected Date:</SelectedDateLabel>
            <SelectedDateText>
              {formatSelectedDate(selectedDate)}
            </SelectedDateText>
          </SelectedDateContainer>

          {/* Year Slider */}
          <SliderSection>
            <YearSliderContainer>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: scale(12) }}
              >
                {years.map(year => (
                  <YearButton
                    key={year}
                    onPress={() => handleYearChange(year)}
                    isSelected={year === selectedYear}
                  >
                    <YearButtonText isSelected={year === selectedYear}>
                      {year}
                    </YearButtonText>
                  </YearButton>
                ))}
              </ScrollView>
            </YearSliderContainer>
          </SliderSection>

          {/* Month Slider */}
          <SliderSection>
            <MonthSliderContainer>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: scale(12) }}
              >
                {months.map((month, index) => (
                  <MonthButton
                    key={index}
                    onPress={() => handleMonthChange(index)}
                    isSelected={index === selectedMonth}
                  >
                    <MonthButtonText isSelected={index === selectedMonth}>
                      {month}
                    </MonthButtonText>
                  </MonthButton>
                ))}
              </ScrollView>
            </MonthSliderContainer>
          </SliderSection>

          {/* Calendar Grid */}
          <CalendarSection>
            <CalendarLabel>Select Date</CalendarLabel>
            <WeekDays>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <WeekDay key={day}>{day}</WeekDay>
              ))}
            </WeekDays>
            <CalendarGrid>
              {calendarDays.map((date, index) => (
                <DayButton
                  key={index}
                  onPress={() => handleDateSelect(date)}
                  isSelected={isSameDay(date, selectedDate)}
                  isCurrentMonth={isCurrentMonth(date)}
                >
                  <DayText
                    isSelected={isSameDay(date, selectedDate)}
                    isCurrentMonth={isCurrentMonth(date)}
                  >
                    {date.getDate()}
                  </DayText>
                </DayButton>
              ))}
            </CalendarGrid>
          </CalendarSection>

          <ActionButtons>
            <CancelButton onPress={onClose}>
              <CancelText>Cancel</CancelText>
            </CancelButton>
            <ConfirmButton onPress={handleConfirm}>
              <ConfirmText>Confirm</ConfirmText>
            </ConfirmButton>
          </ActionButtons>
        </Content>
      </Container>
    </Modal>
  );
};

const Container = styled.View<{ insets: any }>`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: ${props => props.insets.top}px ${scale(20)}px
    ${props => props.insets.bottom}px ${scale(20)}px;
`;

const Content = styled.View`
  background-color: #ffffff;
  border-radius: ${scale(16)}px;
  width: 100%;
  max-width: ${scale(350)}px;
  max-height: ${scale(600)}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${verticalScale(10)}px ${scale(14)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const Title = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-weight: 600;
  color: #333333;
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${scale(4)}px;
`;

const CloseText = styled.Text`
  font-size: ${moderateScale(16)}px;
  color: #666666;
`;

const SelectedDateContainer = styled.View`
  padding: ${verticalScale(12)}px ${scale(14)}px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const SelectedDateLabel = styled.Text`
  font-size: ${moderateScale(11)}px;
  color: #666666;
  margin-bottom: ${verticalScale(4)}px;
`;

const SelectedDateText = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: #333333;
  text-align: center;
`;

const SliderSection = styled.View`
  padding: ${verticalScale(12)}px ${scale(14)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const SliderLabel = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 600;
  color: #333333;
  margin-bottom: ${verticalScale(8)}px;
`;

const YearSliderContainer = styled.View`
  height: ${verticalScale(32)}px;
`;

const MonthSliderContainer = styled.View`
  height: ${verticalScale(32)}px;
`;

const YearButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: ${verticalScale(4)}px ${scale(5)}px;
  margin-right: ${scale(6)}px;
  border-radius: ${scale(16)}px;
  background-color: ${props =>
    props.isSelected ? `${Colors.primary_blue_color}` : '#F2F2F7'};
  min-width: ${scale(50)}px;
  align-items: center;
  justify-content: center;
`;

const YearButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: ${moderateScale(12)}px;
  font-weight: ${props => (props.isSelected ? '600' : '400')};
  color: ${props => (props.isSelected ? '#FFFFFF' : '#333333')};
`;

const MonthButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: ${verticalScale(6)}px ${scale(10)}px;
  margin-right: ${scale(6)}px;
  border-radius: ${scale(16)}px;
  background-color: ${props => (props.isSelected ? `${Colors.primary_blue_color}` : '#F2F2F7')};
  min-width: ${scale(45)}px;
  align-items: center;
  justify-content: center;
`;

const MonthButtonText = styled.Text<{ isSelected: boolean }>`
  font-size: ${moderateScale(12)}px;
  font-weight: ${props => (props.isSelected ? '600' : '400')};
  color: ${props => (props.isSelected ? '#FFFFFF' : '#333333')};
`;

const CalendarSection = styled.View`
  padding: ${verticalScale(12)}px ${scale(14)}px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5ea;
`;

const CalendarLabel = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 600;
  color: #333333;
  margin-bottom: ${verticalScale(8)}px;
`;

const WeekDays = styled.View`
  flex-direction: row;
  padding: ${verticalScale(6)}px 0;
`;

const WeekDay = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${moderateScale(11)}px;
  font-weight: 500;
  color: #666666;
`;

const CalendarGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${verticalScale(6)}px 0;
`;

const DayButton = styled.TouchableOpacity<{
  isSelected: boolean;
  isCurrentMonth: boolean;
}>`
  width: ${scale(32)}px;
  height: ${scale(32)}px;
  justify-content: center;
  align-items: center;
  margin: ${scale(1)}px;
  border-radius: ${scale(16)}px;
  background-color: ${props => (props.isSelected ? `${Colors.primary_blue_color}` : 'transparent')};
  opacity: ${props => (props.isCurrentMonth ? 1 : 0.3)};
`;

const DayText = styled.Text<{ isSelected: boolean; isCurrentMonth: boolean }>`
  font-size: ${moderateScale(12)}px;
  font-weight: ${props => (props.isSelected ? '600' : '400')};
  color: ${props =>
    props.isSelected
      ? '#FFFFFF'
      : props.isCurrentMonth
      ? '#333333'
      : '#999999'};
`;

const ActionButtons = styled.View`
  flex-direction: row;
  padding: ${verticalScale(10)}px ${scale(14)}px;
  gap: ${scale(6)}px;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  padding: ${verticalScale(10)}px;
  align-items: center;
  border-radius: ${scale(5)}px;
  border-width: 1px;
  border-color: #e5e5ea;
`;

const CancelText = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 500;
  color: #666666;
`;

const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  padding: ${verticalScale(10)}px;
  align-items: center;
  border-radius: ${scale(5)}px;
  background-color: ${Colors.primary_blue_color};
`;

const ConfirmText = styled.Text`
  font-size: ${moderateScale(13)}px;
  font-weight: 600;
  color: #ffffff;
`;
