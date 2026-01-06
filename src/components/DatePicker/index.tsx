import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar } from './components/Calendar';
import { TimePicker } from './components/TimePicker';
import { Header } from './components/Header';
import { ActionButtons } from './components/ActionButton';
import { DatePickerProps, DatePickerState } from './types';
import { generateCalendarDays, formatDate, formatTime } from './utils';
import { Container, Content } from './styles';

export const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  mode = 'date',
  theme = 'light',
  initialDate = new Date(),
  minDate,
  maxDate,
  title = 'Select Date',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showTimePicker = false,
  timeFormat = '24h',
  customTheme
}) => {
  const insets = useSafeAreaInsets();
  
  const [state, setState] = useState<DatePickerState>({
    selectedDate: initialDate,
    selectedTime: initialDate,
    currentMonth: new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
    calendarDays: [],
    selectedYear: initialDate.getFullYear(),
    selectedMonth: initialDate.getMonth()
  });

  const themeConfig = useMemo(() => {
    if (customTheme) return customTheme;
    
    const themes = {
      light: {
        primaryColor: '#007AFF',
        backgroundColor: '#FFFFFF',
        textColor: '#000000',
        borderColor: '#E5E5EA'
      },
      dark: {
        primaryColor: '#0A84FF',
        backgroundColor: '#1C1C1E',
        textColor: '#FFFFFF',
        borderColor: '#38383A'
      }
    };
    
    return themes[theme as 'light' | 'dark'] || themes.light;
  }, [theme, customTheme]);

  useEffect(() => {
    if (visible) {
      const days = generateCalendarDays(state.currentMonth);
      setState(prev => ({ ...prev, calendarDays: days }));
    }
  }, [visible, state.currentMonth]);

  const handleDateSelect = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  const handleTimeSelect = (time: Date) => {
    setState(prev => ({ ...prev, selectedTime: time }));
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setState(prev => {
      const newMonth = new Date(prev.currentMonth);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return { ...prev, currentMonth: newMonth };
    });
  };

  const handleConfirm = () => {
    const finalDate = new Date(state.selectedDate);
    if (mode === 'datetime' || showTimePicker) {
      finalDate.setHours(state.selectedTime.getHours());
      finalDate.setMinutes(state.selectedTime.getMinutes());
    }
    onConfirm(finalDate);
    onClose();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Container insets={insets}>
        <Content theme={themeConfig}>
          <Header
            title={title}
            onClose={onClose}
            theme={themeConfig}
          />
          
          <Calendar
            days={state.calendarDays}
            selectedDate={state.selectedDate}
            currentMonth={state.currentMonth}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            isDateDisabled={isDateDisabled}
            theme={themeConfig}
          />
          
          {(mode === 'datetime' || showTimePicker) && (
            <TimePicker
              selectedTime={state.selectedTime}
              onTimeSelect={handleTimeSelect}
              timeFormat={timeFormat}
              theme={themeConfig}
            />
          )}
          
          <ActionButtons
            onConfirm={handleConfirm}
            onCancel={onClose}
            confirmText={confirmText}
            cancelText={cancelText}
            theme={themeConfig}
          />
        </Content>
      </Container>
    </Modal>
  );
};