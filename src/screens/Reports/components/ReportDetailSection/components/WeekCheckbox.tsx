import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import Icons from '../../../../../common/icons';
import { WeekInfo } from '../utils/weekGenerator';

interface WeekCheckboxProps {
  availableWeeks: WeekInfo[];
  selectedWeek: WeekInfo | null;
  expandedWeeks: boolean;
  onWeekToggle: (week: WeekInfo) => void;
  onWeeksToggle: () => void;
}

const WeekCheckbox: React.FC<WeekCheckboxProps> = ({
  availableWeeks,
  selectedWeek,
  expandedWeeks,
  onWeekToggle,
  onWeeksToggle,
}) => {
  return (
    <Container>
      <WeekGroup>
        <GroupHeader onPress={onWeeksToggle}>
          <GroupTitle>Select Week</GroupTitle>
          <GroupArrow
            source={
              expandedWeeks ? Icons.caret_up_blue : Icons.caret_down_blue
            }
            style={{
              transform: [{ rotate: expandedWeeks ? '0deg' : '0deg' }],
            }}
          />
        </GroupHeader>

        {expandedWeeks && (
          <WeekList>
            {availableWeeks.map(week => (
              <WeekItemContainer
                key={week.id}
                onPress={() => onWeekToggle(week)}
              >
                <CheckboxContainer
                  isSelected={selectedWeek?.id === week.id}
                >
                  {selectedWeek?.id === week.id && (
                    <Checkmark>✓</Checkmark>
                  )}
                </CheckboxContainer>

                <WeekIcon>📅</WeekIcon>
                <WeekLabel>Week {week.weekNumber}</WeekLabel>
                <WeekDateRange>{week.label}</WeekDateRange>
              </WeekItemContainer>
            ))}
          </WeekList>
        )}
      </WeekGroup>
    </Container>
  );
};

const Container = styled.View`
  margin-bottom: ${verticalScale(20)}px;
`;

const WeekGroup = styled.View`
  margin-bottom: ${verticalScale(16)}px;
  border-radius: ${scale(8)}px;
  overflow: hidden;
`;

const GroupHeader = styled.TouchableOpacity`
  background-color: #e3f2fd;
  padding: ${verticalScale(12)}px ${scale(16)}px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GroupTitle = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  color: ${Colors.primary_blue_color};
`;

const GroupArrow = styled.Image`
  width: ${scale(20)}px;
  height: ${scale(12)}px;
`;

const WeekList = styled.View`
  background-color: #ffffff;
  border: 1px solid #e5e5ea;
  border-top-width: 0;
`;

const WeekItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${verticalScale(12)}px ${scale(16)}px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const CheckboxContainer = styled.View<{ isSelected: boolean }>`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
  border-radius: ${scale(4)}px;
  background-color: ${props =>
    props.isSelected ? Colors.primary_blue_color : 'transparent'};
  border-width: 2px;
  border-color: ${Colors.primary_blue_color};
  align-items: center;
  justify-content: center;
  margin-right: ${scale(12)}px;
`;

const Checkmark = styled.Text`
  color: #ffffff;
  font-size: ${moderateScale(12)}px;
  font-weight: bold;
`;

const WeekIcon = styled.Text`
  font-size: ${moderateScale(16)}px;
  margin-right: ${scale(12)}px;
`;

const WeekLabel = styled.Text`
  font-size: ${moderateScale(14)}px;
  font-weight: 500;
  color: #333333;
  margin-right: ${scale(8)}px;
`;

const WeekDateRange = styled.Text`
  flex: 1;
  font-size: ${moderateScale(12)}px;
  color: #666666;
  font-weight: 400;
`;

export default WeekCheckbox;
