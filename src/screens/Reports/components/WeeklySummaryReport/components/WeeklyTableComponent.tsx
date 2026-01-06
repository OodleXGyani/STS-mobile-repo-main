// WeeklyTableComponent.ts

import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Colors } from '../../../../../constants/colors';
import { toHHMM } from '../../../../../utils';

// Styled components for the table
const TableContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: ${moderateScale(8)}px;
  padding: ${moderateScale(16)}px;
  margin-top: ${moderateScale(16)}px;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: ${moderateScale(4)}px;
  shadow-offset: 0px ${moderateScale(2)}px;
`;

const TableRow = styled.View<{ isHeader?: boolean; isEven?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${verticalScale(8)}px;
  background-color: ${props => props.isHeader ? Colors.tertiary_blue_color_light : props.isEven ? Colors.tertiary_background_color : Colors.white};
`;

const TableColumn = styled.View<{ flex?: number }>`
  flex: ${props => props.flex || 1};
  align-items: center;
  justify-content: center;
  padding-horizontal: ${scale(4)}px;
`;

const TableText = styled.Text<{ isHeader?: boolean }>`
  font-size: ${moderateScale(12)}px;
  color: ${props => props.isHeader ? Colors.primary_blue_color : Colors.default_font_color};
  font-weight: ${props => props.isHeader ? '600' : '400'};
  text-align: center;
`;

const SubText = styled.Text`
  font-size: ${moderateScale(10)}px;
  color: ${Colors.tertiary_font_color};
  font-weight: 400;
`;

interface WeeklyTableComponentProps {
  details: {
    min: number;
    max: number;
    total: number;
    fat: number;
    minOT: number;
    maxOT: number;
    totalOT: number;
    avgOT: number;
    minST: number;
    maxST: number;
    totalST: number;
    avgST: number;
    operatingDays: number;
    totalSpeedViolation: number;
  };
}

const WeeklyTableComponent: React.FC<WeeklyTableComponentProps> = ({ details }) => {
  return (
    <TableContainer>
      {/* Table Header Row */}
      <TableRow isHeader>
        <TableColumn flex={2}>
          <TableText isHeader>Metric</TableText>
        </TableColumn>
        <TableColumn>
          <TableText isHeader>Min</TableText>
        </TableColumn>
        <TableColumn>
          <TableText isHeader>Max</TableText>
        </TableColumn>
        <TableColumn>
          <TableText isHeader>Total</TableText>
        </TableColumn>
        <TableColumn>
          <TableText isHeader>FAT</TableText>
        </TableColumn>
      </TableRow>

      {/* Distance Travelled Row */}
      <TableRow isEven>
        <TableColumn flex={2}>
          <TableText>
            DT{' '}
            <SubText>(km)</SubText>
          </TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{details.min}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{details.max}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{details.total}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{details.fat}</TableText>
        </TableColumn>
      </TableRow>

      {/* Operation Time Row */}
      <TableRow>
        <TableColumn flex={2}>
          <TableText>
            OT{' '}
            <SubText>(hh:mm)</SubText>
          </TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.minOT)}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.maxOT)}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.totalOT)}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.avgOT)}</TableText>
        </TableColumn>
      </TableRow>

      {/* Stop Time Row */}
      <TableRow isEven>
        <TableColumn flex={2}>
          <TableText>
            ST{' '}
            <SubText>(hh:mm)</SubText>
          </TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.minST)}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.maxST)}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.totalST)}</TableText>
        </TableColumn>
        <TableColumn>
          <TableText>{toHHMM(details.avgST)}</TableText>
        </TableColumn>
      </TableRow>
    </TableContainer>
  );
};

export default WeeklyTableComponent;
