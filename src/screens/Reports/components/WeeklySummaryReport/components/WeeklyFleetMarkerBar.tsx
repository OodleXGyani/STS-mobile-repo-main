import React from 'react';
import { MarkerBar, Marker } from '../WeeklyReportsStyles';
import { scale, verticalScale } from 'react-native-size-matters';
import styled from 'styled-components/native';

const BarContainer = styled.View`
  width: ${scale(80)}px;
  height: ${verticalScale(12)}px;
  background-color: #f0f0f0;
  border-radius: ${scale(6)}px;
  position: relative;
  overflow: hidden;
`;

const ColoredBar = styled.View<{ width: string; color: string }>`
  height: 100%;
  background-color: ${({ color }) => color};
  width: ${({ width }) => width};
  border-radius: ${scale(6)}px;
`;

const ThresholdMarker = styled.View<{ left: string }>`
  position: absolute;
  left: ${({ left }) => left};
  top: -4px;
  width: ${scale(3)}px;
  height: ${verticalScale(20)}px;
  background-color: #0B0B0B;
  border-radius: ${scale(1.5)}px;
`;

interface WeeklyFleetMarkerBarProps {
  value: number;
  average: number;
  color: string;
  max: number;
  title: string;
}

export const WeeklyFleetMarkerBar: React.FC<WeeklyFleetMarkerBarProps> = ({ title, value, average, color, max }) => {
  const BAR_MAX_WIDTH = 80; // Total width of the progress bar
  
  // Calculate bar width as percentage (same logic as original code)
  const barWidthPercentage = max > 0 ? (value / max) * 100 : 0;
  const coloredBarWidth = `${barWidthPercentage}%`;
  
  // Calculate threshold marker position (same logic as original code)
  const thresholdPercentage = max > 0 ? (average / max) * 100 : 0;
  const thresholdMarkerPosition = `${thresholdPercentage}%`;
  
  // Add offset like in original code (5px for OT/IT, 2px for DT)
  const markerOffset = title === 'DT' ? 2 : 5;
  const finalMarkerPosition = `calc(${thresholdMarkerPosition} + ${markerOffset}px)`;

  // Use different colors based on the metric type to match monthly report
  let barColor = color;
  if (title === 'OT') {
    barColor = '#87CEEB'; // Light blue for OT
  } else if (title === 'IT') {
    barColor = '#FFD700'; // Gold/Yellow for IT
  } else if (title === 'DT') {
    barColor = '#D3D3D3'; // Light grey for DT
  }

  return (
    <BarContainer>
      <ColoredBar 
        width={coloredBarWidth}
        color={barColor}
      />
      <ThresholdMarker left={finalMarkerPosition} />
    </BarContainer>
  );
};
