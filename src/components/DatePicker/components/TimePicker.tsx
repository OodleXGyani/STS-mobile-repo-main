import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface TimePickerProps {
  selectedTime: Date;
  onTimeSelect: (time: Date) => void;
  timeFormat: '12h' | '24h';
  theme: any;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onTimeSelect,
  timeFormat,
  theme
}) => {
  const [activePicker, setActivePicker] = useState<'hour' | 'minute'>('hour');

  const generateHours = () => {
    const hours = [];
    const maxHour = timeFormat === '12h' ? 12 : 24;
    
    for (let i = 0; i < maxHour; i++) {
      const hour = timeFormat === '12h' ? (i === 0 ? 12 : i) : i;
      hours.push(hour);
    }
    
    return hours;
  };

  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += 5) {
      minutes.push(i);
    }
    return minutes;
  };

  const handleHourSelect = (hour: number) => {
    const newTime = new Date(selectedTime);
    if (timeFormat === '12h') {
      const isPM = selectedTime.getHours() >= 12;
      newTime.setHours(isPM ? hour + 12 : hour);
    } else {
      newTime.setHours(hour);
    }
    onTimeSelect(newTime);
  };

  const handleMinuteSelect = (minute: number) => {
    const newTime = new Date(selectedTime);
    newTime.setMinutes(minute);
    onTimeSelect(newTime);
  };

  const formatTimeDisplay = (date: Date) => {
    if (timeFormat === '12h') {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <TimePickerContainer>
      <TimeDisplay theme={theme}>
        {formatTimeDisplay(selectedTime)}
      </TimeDisplay>
      
      <PickerTabs>
        <PickerTab
          active={activePicker === 'hour'}
          onPress={() => setActivePicker('hour')}
          theme={theme}
        >
          <PickerTabText active={activePicker === 'hour'} theme={theme}>
            Hour
          </PickerTabText>
        </PickerTab>
        
        <PickerTab
          active={activePicker === 'minute'}
          onPress={() => setActivePicker('minute')}
          theme={theme}
        >
          <PickerTabText active={activePicker === 'minute'} theme={theme}>
            Minute
          </PickerTabText>
        </PickerTab>
      </PickerTabs>

      <PickerContainer>
        {activePicker === 'hour' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {generateHours().map(hour => (
              <TimeOption
                key={hour}
                selected={selectedTime.getHours() === hour}
                onPress={() => handleHourSelect(hour)}
                theme={theme}
              >
                <TimeOptionText
                  selected={selectedTime.getHours() === hour}
                  theme={theme}
                >
                  {hour.toString().padStart(2, '0')}
                </TimeOptionText>
              </TimeOption>
            ))}
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {generateMinutes().map(minute => (
              <TimeOption
                key={minute}
                selected={selectedTime.getMinutes() === minute}
                onPress={() => handleMinuteSelect(minute)}
                theme={theme}
              >
                <TimeOptionText
                  selected={selectedTime.getMinutes() === minute}
                  theme={theme}
                >
                  {minute.toString().padStart(2, '0')}
                </TimeOptionText>
              </TimeOption>
            ))}
          </ScrollView>
        )}
      </PickerContainer>
    </TimePickerContainer>
  );
};

const TimePickerContainer = styled.View`
  padding: ${scale(16)}px;
  border-top-width: 1px;
  border-top-color: #E5E5EA;
`;

const TimeDisplay = styled.Text<{ theme: any }>`
  font-size: ${moderateScale(32)}px;
  font-weight: bold;
  text-align: center;
  color: ${props => props.theme.textColor};
  margin-bottom: ${verticalScale(20)}px;
`;

const PickerTabs = styled.View`
  flex-direction: row;
  margin-bottom: ${verticalScale(16)}px;
`;

const PickerTab = styled.TouchableOpacity<{ active: boolean; theme: any }>`
  flex: 1;
  padding: ${verticalScale(12)}px;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${props => props.active ? props.theme.primaryColor : 'transparent'};
`;

const PickerTabText = styled.Text<{ active: boolean; theme: any }>`
  font-size: ${moderateScale(16)}px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? props.theme.primaryColor : props.theme.textColor};
`;

const PickerContainer = styled.View`
  height: ${verticalScale(200)}px;
`;

const TimeOption = styled.TouchableOpacity<{ selected: boolean; theme: any }>`
  padding: ${verticalScale(12)}px;
  align-items: center;
  background-color: ${props => props.selected ? props.theme.primaryColor : 'transparent'};
  border-radius: ${scale(8)}px;
  margin: ${scale(2)}px 0;
`;

const TimeOptionText = styled.Text<{ selected: boolean; theme: any }>`
  font-size: ${moderateScale(18)}px;
  font-weight: 500;
  color: ${props => props.selected ? '#FFFFFF' : props.theme.textColor};
`;