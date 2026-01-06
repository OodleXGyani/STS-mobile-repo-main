import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { SmallIcon } from '../../../../Dashboard/components/AccordianList/accordian-styles';
import Icons from '../../../../../common/icons';
import {
  ListContainer,
  RowContainer,
  IconWrapper,
  TimeText,
  AddressText,
  DashedLineContainer,
  DashSegment,
} from '../styles';
import { formatTimestampToTime } from '../../../../../utils';

// Types for LocationRow props
interface LocationRowProps {
  time: string;
  address: string;
  icon: any;
  showDash?: boolean;
}

// LocationRow component with typed props
const LocationRow: React.FC<LocationRowProps> = ({
  time,
  address,
  icon,
  showDash,
}) => (
  <RowContainer>
    <IconWrapper>
      <SmallIcon
        style={{ width: moderateScale(13), height: moderateScale(18) }}
        source={icon}
      />
      {showDash && (
        <DashedLineContainer>
          <DashSegment />
          <DashSegment />
          <DashSegment />
          <DashSegment />
        </DashedLineContainer>
      )}
    </IconWrapper>
    <TimeText>{time}</TimeText>
    <AddressText>{address}</AddressText>
  </RowContainer>
);

// Main timeline list
const TimelineList: React.FC<{ data: any }> = ({ data }) => (
  console.log('data daily', data),
  <ListContainer>
    <LocationRow
      time={formatTimestampToTime(data.StartTime)}
      address={data.StartLocation}
      icon={Icons.location_green} // green
      showDash={true}
    />
    <LocationRow
      time={formatTimestampToTime(data.EndTime)}
      address={data.EndLocation}
      icon={Icons.location_red} // red
      showDash={false}
    />
  </ListContainer>
);

export default TimelineList;
