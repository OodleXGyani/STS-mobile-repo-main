import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DashboardStackParamList } from '../../../../constants/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import DetailHeader from './components/DetailHeader';
import VehicleCard from './components/VehicleCard';
import VehicleLocationMap from './components/VehicleLocationMap';
import { formatStatusTime } from '../AccordianList/utils';

type Props = NativeStackScreenProps<DashboardStackParamList, 'DetailPage'>;

const COLORS = {
  headerBg: '#003459',
  screenBg: '#003459',
  bodyBg: '#eef3f7',
  leftBg: '#ffffff',
  rightBg: '#f6f9fc',
  border: '#dbe3ea',
  title: '#0b2948',
  text: '#1a2b3c',
  buttonBg: '#003459',
  buttonText: '#ffffff',
};

const Screen = styled(SafeAreaView)`
  flex: 1;
  background-color: ${COLORS.screenBg};
`;

const Body = styled.View`
  flex: 1;
  background-color: ${COLORS.bodyBg};
  /* Column layout: top panel then bottom panel */
  flex-direction: column;
`;

const TopPane = styled.View`
  flex: 4; /* occupies upper portion */
  background-color: ${COLORS.leftBg};

  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${COLORS.border};
`;

const BottomPane = styled.View`
  flex: 2; /* bottom portion (Right pane) */
  background-color: ${COLORS.rightBg};

  padding: ${moderateScale(5)}px;
`;

const RightTitle = styled.Text`
  font-size: ${moderateScale(16)}px;
  font-weight: 700;
  margin-bottom: ${verticalScale(8)}px;
  color: ${COLORS.title};
`;

const VehicleDetailSection: React.FC<Props> = ({ route, navigation }) => {
  const { item } = route.params;
  console.log('🔄 Item:', item);
  return (
    <Screen>
      <DetailHeader item={item} />

      <Body>
        {/* TOP (your former LeftPane content lives here) */}
        <TopPane>
          <VehicleLocationMap
            vehicle={{
              id: item.key, // Use key as string ID
              name: item.name,
              status: item.status, // on | idle | off | no_signal | longoff
              coordinates: item.coordinates // Use actual coordinates from vehicle data
            }}
          />
        </TopPane>

        {/* BOTTOM (Right pane: holds the Vehicle Detail) */}
        <BottomPane>
          <VehicleCard
            status={item.status}
            vehicleNumber={item?.vehicle_Number || 'N/A'}
            driverName={item.driver_name || 'No Driver'}
            plate={item.key}
            driverRating={0} // Default rating since it's not in current Vehicle type
            statusAgoText={formatStatusTime(item.status_time, 'now')}
            address={item.location_full}
            speedLimit={parseInt(item.speed_limit?.replace('Km/h', '') || '0')}
            model={item.vehicle_model || 'N/A'}
            // modelDetails={item.vehicle_model}
            serviceDueLabel="Service Due"
            serviceDueDate={item.vehicle_next_registration_date || undefined}
            onPress={() => console.log('Pressed test vehicle')}
          />
        </BottomPane>
      </Body>
    </Screen>
  );
};

export default VehicleDetailSection;
