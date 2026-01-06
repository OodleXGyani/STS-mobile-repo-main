import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface CalendarProps {
  days: Date[];
  selectedDate: Date;
  currentMonth: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  isDateDisabled: (date: Date) => boolean;
  theme: any;
}

export const Calendar: React.FC<CalendarProps> = ({
  days,
  selectedDate,
  currentMonth,
  onDateSelect,
  onMonthChange,
  isDateDisabled,
  theme
}) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <CalendarContainer>
      <MonthHeader>
        <MonthButton onPress={() => onMonthChange('prev')}>
          <MonthButtonText theme={theme}>‹</MonthButtonText>
        </MonthButton>
        
        <MonthTitle theme={theme}>
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </MonthTitle>
        
        <MonthButton onPress={() => onMonthChange('next')}>
          <MonthButtonText theme={theme}>›</MonthButtonText>
        </MonthButton>
      </MonthHeader>

      <WeekDaysContainer>
        {weekDays.map(day => (
          <WeekDayCell key={day}>
            <WeekDayText theme={theme}>{day}</WeekDayText>
          </WeekDayCell>
        ))}
      </WeekDaysContainer>

      <DaysContainer>
        {days.map((date, index) => {
          const disabled = isDateDisabled(date);
          const selected = isSelected(date);
          const today = isToday(date);
          
          return (
            <DayCell
              key={index}
              disabled={disabled}
              selected={selected}
              today={today}
              theme={theme}
              onPress={() => !disabled && onDateSelect(date)}
            >
              <DayText
                disabled={disabled}
                selected={selected}
                today={today}
                theme={theme}
              >
                {date.getDate()}
              </DayText>
            </DayCell>
          );
        })}
      </DaysContainer>
    </CalendarContainer>
  );
};

const CalendarContainer = styled.View`
  padding: ${scale(16)}px;
`;

const MonthHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${verticalScale(20)}px;
`;

const MonthButton = styled.TouchableOpacity`
  width: ${scale(40)}px;
  height: ${scale(40)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${scale(20)}px;
`;

const MonthButtonText = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(24)}px;
  color: ${props => props.theme.primaryColor};
  font-weight: bold;
`;

const MonthTitle = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(18)}px;
  font-weight: 600;
  color: ${props => props.theme.textColor};
`;

const WeekDaysContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${verticalScale(10)}px;
`;

const WeekDayCell = styled.View`
  flex: 1;
  align-items: center;
  padding: ${verticalScale(8)}px;
`;

const WeekDayText = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(12)}px;
  font-weight: 600;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
`;

const DaysContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const DayCell = styled.TouchableOpacity<{
  disabled: boolean;
  selected: boolean;
  today: boolean;
  theme: any;
}>`
  width: ${scale(40)}px;
  height: ${scale(40)}px;
  align-items: center;
  justify-content: center;
  margin: ${scale(2)}px;
  border-radius: ${scale(20)}px;
  background-color: ${props => {
    if (props.disabled) return props.theme.borderColor;
    if (props.selected) return props.theme.primaryColor;
    if (props.today) return `${props.theme.primaryColor}20`;
    return 'transparent';
  }};
  opacity: ${props => props.disabled ? 0.3 : 1};
`;

const DayText = styled.Text<{
  disabled: boolean;
  selected: boolean;
  today: boolean;
  theme: any;
}>`
  font-size: ${moderateScale(14)}px;
  font-weight: ${props => props.selected ? 'bold' : '500'};
  color: ${props => {
    if (props.disabled) return props.theme.textColor;
    if (props.selected) return '#FFFFFF';
    if (props.today) return props.theme.primaryColor;
    return props.theme.textColor;
  }};
`;