import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';

interface DateSelectionProps {
  selectedDate: Date;
  onDatePress: () => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ selectedDate, onDatePress }) => (
  <Section>
    <SectionLabel>Select Date</SectionLabel>
    <DatePickerButton onPress={onDatePress}>
      <DatePickerText>
        {selectedDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </DatePickerText>
    </DatePickerButton>
  </Section>
);

const Section = styled.View`
  margin-bottom: ${verticalScale(24)}px;
`;

const SectionLabel = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 600;
  color: #333333;
  margin-bottom: ${verticalScale(12)}px;
`;

const DatePickerButton = styled.TouchableOpacity`
  background-color: #e3f2fd;
  padding: ${verticalScale(16)}px ${scale(20)}px;
  border-radius: ${scale(8)}px;
  align-items: center;
`;

const DatePickerText = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 500;
  color: ${Colors.primary_blue_color};
`;

export default DateSelection;
