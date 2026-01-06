import React, { useState } from 'react';
import {
  SummaryBox,
  Row,
  Label,
  SubLabel,
  ToggleButton,
  ToggleButtonText,
} from '../MonthlyReportsStyles';
import { FleetMarkerBar } from './FleetMarkerBar';
import { Colors } from '../../../../../constants/colors';
import { SmallIcon } from '../../../../Dashboard/components/AccordianList/accordian-styles';
import Icons from '../../../../../common/icons';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import styled from 'styled-components/native';
import TableComponent from './TableComponent';
import { toHHMM } from '../../../../../utils';

// Styled components for the three-column layout
const ItemContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${moderateScale(15)}px;
`;

const FirstColumn = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: space-between;
  height: ${verticalScale(80)}px;
`;

const SecondColumn = styled.View`
  flex: 1;
  justify-content: space-between;
  height: ${verticalScale(80)}px;
  padding-left: ${scale(8)}px;
`;

const ThirdColumn = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: space-between;
  height: ${verticalScale(80)}px;
  padding-left: ${scale(8)}px;
`;

const TSVContainer = styled.View`
  margin-top: auto;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${verticalScale(4)}px;
  gap: ${scale(4)}px;
`;

const MarkerBarContainer = styled.View`
  align-items: flex-end;
  margin-bottom: ${verticalScale(4)}px;
`;

interface MonthlySummaryItemProps {
  vehicleId: string;
  OT: number;
  IT: number;
  DT: number;
  avg: { OT: number; IT: number; DT: number };
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
    totalSpeedViolation: number; // Add TSV property
  };
  fleetStats?: {
    MaxTotalOperationTime: number;
    MaxTotalIdleTime: number;
    MaxTotalDistanceTravelled: number;
  };
}

export const MonthlySummaryItem: React.FC<MonthlySummaryItemProps> = ({
  vehicleId,
  OT,
  IT,
  DT,
  avg,
  details,
  fleetStats, // Add this prop for fleet statistics
}) => {
  const [showMore, setShowMore] = useState(false);
  
  // Use fleet maximum values like in original code
  const maxOT = fleetStats?.MaxTotalOperationTime || 200;
  const maxIT = fleetStats?.MaxTotalIdleTime || 100;
  const maxDT = fleetStats?.MaxTotalDistanceTravelled || 2000;

  // Format time function
  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <SummaryBox>
      <ItemContainer>
        {/* First Column - Vehicle Icon, ID, TSV */}
        <FirstColumn>
          <SmallIcon
            source={Icons.car_blue}
            style={{ width: moderateScale(45), height: moderateScale(15) }}
          />
          <Label>{vehicleId}</Label>
          <TSVContainer>
            <Label style={{fontWeight: 'bold'}}>TSV {details.totalSpeedViolation}</Label>
          </TSVContainer>
        </FirstColumn>

        {/* Second Column - Stats with primary blue SubLabel */}
        <SecondColumn>
          <StatsRow>
            <SubLabel style={{ color: Colors.primary_blue_color }}>OT</SubLabel>
            <SubLabel style={{ color: Colors.primary_blue_color }}>
              {toHHMM(OT)} (hh:mm)
            </SubLabel>
          </StatsRow>
          <StatsRow>
            <SubLabel style={{ color: Colors.primary_blue_color }}>IT</SubLabel>
            <SubLabel style={{ color: Colors.primary_blue_color }}>
              {toHHMM(IT)} (hh:mm)
            </SubLabel>
          </StatsRow>
          <StatsRow>
            <SubLabel style={{ color: Colors.primary_blue_color }}>DT</SubLabel>
            <SubLabel style={{ color: Colors.primary_blue_color }}>
              {DT} km
            </SubLabel>
          </StatsRow>
        </SecondColumn>

        {/* Third Column - Marker Bars */}
        <ThirdColumn>
          <MarkerBarContainer>
            <FleetMarkerBar
              title="OT"
              value={OT}
              average={avg.OT}
              color={Colors.bar_blue}
              max={maxOT}
            />
          </MarkerBarContainer>
          <MarkerBarContainer>
            <FleetMarkerBar
              title="IT"
              value={IT}
              average={avg.IT}
              color={Colors.bar_yellow}
              max={maxIT}
            />
          </MarkerBarContainer>
          <MarkerBarContainer>
            <FleetMarkerBar
              title="DT"
              value={DT}
              color={Colors.bar_grey}
              average={avg.DT}
              max={maxDT}
            />
          </MarkerBarContainer>
        </ThirdColumn>
      </ItemContainer>

      <ToggleButton onPress={() => setShowMore(prev => !prev)}>
        <ToggleButtonText>
          {showMore ? 'Show Less' : 'Show More'}
        </ToggleButtonText>
      </ToggleButton>

      {showMore && <TableComponent details={details} />}
    </SummaryBox>
  );
};
