import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { StatusItem as StatusItemType } from '../types';
import {
  FilterSection,
  SectionHeader,
  SectionTitle,
  SectionContent,
  shadows,
} from '../styles';
import Icons from '../../../../../common/icons';
import { Colors } from '../../../../../constants/colors';

const StatusItemContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex: 1;
  align-items: center;
  padding: ${moderateScale(12)}px;
  margin: ${moderateScale(4)}px;
  background-color: transparent;
  border-radius: ${moderateScale(8)}px;
  /* min-height: ${verticalScale(100)}px; */
`;

const CheckboxContainer = styled.TouchableOpacity<{ isSelected: boolean }>`
  width: ${scale(20)}px;
  height: ${scale(20)}px;
  border-radius: ${moderateScale(4)}px;
  background-color: ${props =>
    props.isSelected ? `${Colors.primary_blue_color}` : 'transparent'};
  border-width: 2px;
  border-color: ${Colors.primary_blue_color};
  align-items: center;
  justify-content: center;
  margin-bottom: ${verticalScale(8)}px;
  align-self: flex-start;
`;

const Checkmark = styled.Text`
  color: #ffffff;
  font-size: ${moderateScale(12)}px;
  font-weight: bold;
`;

const IconContainer = styled.View`
  position: relative;
  margin-bottom: ${verticalScale(8)}px;
`;

const StatusIcon = styled.Image`
  width: ${scale(32)}px;
  height: ${scale(32)}px;
`;

const StatusCount = styled.View<{ color: string }>`
  position: absolute;
  top: ${scale(5)}px;
  right: -${scale(12)}px;
  background-color: #ffffff;
  border: 2px solid ${props => props.color};
  border-radius: ${scale(13)}px;
  padding: ${moderateScale(4)}px;
  min-width: ${scale(26)}px;
  align-items: center;
  justify-content: center;
`;

const StatusCountText = styled.Text<{ color: string }>`
  font-size: ${moderateScale(10)}px;
  font-weight: 600;
  color: ${props => props.color};
`;

const StatusLabel = styled.Text`
  font-size: ${moderateScale(9)}px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  line-height: ${moderateScale(16)}px;
  position: absolute;
  bottom: ${moderateScale(0)}px;
  left: 0;
  right: 0;
`;

interface StatusFilterSectionProps {
  statusItems: StatusItemType[];
  selectedStatus: string[];
  onStatusToggle: (statusKey: string) => void;
}

export const StatusFilterSection: React.FC<StatusFilterSectionProps> = ({
  statusItems,
  selectedStatus,
  onStatusToggle,
}) => {
  console.log('🟢 StatusFilterSection rendered with:', {
    statusItems,
    selectedStatus,
  });

  // Function to get the appropriate icon for each status
  const getStatusIcon = (statusKey: string) => {
    console.log('🔍 Getting icon for status:', statusKey);

    switch (statusKey) {
      case 'on':
        console.log('🟢 Using vehicle_front_green icon');
        return Icons.vehicle_front_green;
      case 'idle':
        console.log('🟠 Using vehicle_front_orange icon');
        return Icons.vehicle_front_orange;
      case 'off':
      case 'longoff':
        console.log('⚫ Using vehicle_front_grey icon');
        return Icons.vehicle_front_grey;
      case 'no_signal':
        console.log('🔵 Using nosignal_blue icon');
        return Icons.nosignal_blue;
      default:
        console.log('❓ Using default vehicle_front_grey icon');
        return Icons.vehicle_front_grey;
    }
  };

  return (
    <FilterSection style={shadows.medium}>
      <SectionHeader>
        <SectionTitle>
          Vehicle Status{' '}
          {selectedStatus.length > 0
            ? `(${selectedStatus.length} selected)`
            : ''}
        </SectionTitle>
      </SectionHeader>
      <SectionContent>
        {statusItems.map(item => (
          <StatusItemContainer
            onPress={() => {
              console.log('🟢 Status toggled:', item.key);
              onStatusToggle(item.key);
            }}
            key={item.key}
            isSelected={selectedStatus.includes(item.key)}
          >
            <CheckboxContainer isSelected={selectedStatus.includes(item.key)}>
              {selectedStatus.includes(item.key) && <Checkmark>✓</Checkmark>}
            </CheckboxContainer>

            <IconContainer>
              <StatusIcon source={getStatusIcon(item.key)} />
              <StatusCount color={item.color}>
                <StatusCountText color={item.color}>
                  {item.count}
                </StatusCountText>
              </StatusCount>
            </IconContainer>

            <StatusLabel>{item.label}</StatusLabel>
          </StatusItemContainer>
        ))}
      </SectionContent>
    </FilterSection>
  );
};
