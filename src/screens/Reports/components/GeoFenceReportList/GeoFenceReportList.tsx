import React, { useEffect } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

import {
  Header,
  BackIcon,
  HeaderTitle,
  DetailsContainer,
  FlatRow,
  CarIcon,
  LocationText,
  MapButton,
  MapIcon,
  ItemId,
  ItemTime,
  LocationRow,
  LocationIcon,
  MapButtonText,
  DurationText,
  StatusText,
  ItemCard,
  CardHeader,
  HeaderTextContainer,
  CardFooter,
} from './geo-fence-styles';
import Icons from '../../../../common/icons';

const GeoFenceReportList: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data, startDate } = route.params as { data?: any; startDate: string };

  const rawDate = startDate.replace(/#/g, ''); // remove #
  const month = moment(rawDate, 'MM/DD/YYYY hh:mm:ss A').format('MMMM');
  const year = moment(rawDate, 'MM/DD/YYYY hh:mm:ss A').format('YYYY');

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <ItemCard key={index}>
      {/* Header Row */}
      <CardHeader>
        <CarIcon source={Icons.car_blue} />
        <HeaderTextContainer>
          <ItemId>{item?.Vehicle ?? 'Unknown Vehicle'}</ItemId>
          <ItemTime>{item?.TotalTime ?? 'N/A'}</ItemTime>
        </HeaderTextContainer>
      </CardHeader>

      {/* Driver */}
      <LocationRow>
        <LocationIcon source={Icons.driver_grey} />
        <LocationText>{item?.DriverName ?? 'Unknown Driver'}</LocationText>
      </LocationRow>

      {/* Start Time */}
      <LocationRow>
        <LocationIcon source={Icons.location_green} />
        <LocationText>
          {item?.StartTime ? moment(item.StartTime).format('hh:mm A') : '--:--'}{' '}
          - Start Time
        </LocationText>
      </LocationRow>

      {/* End Time */}
      <LocationRow>
        <LocationIcon source={Icons.location_red} />
        <LocationText>
          {item?.EndTime ? moment(item.EndTime).format('hh:mm A') : '--:--'} -
          End Time
        </LocationText>
      </LocationRow>

      {/* Location */}
      <DurationText>Location: {item?.Location ?? 'N/A'}</DurationText>

      {/* Status */}
      <StatusText>Status: {item?.Status ?? 'N/A'}</StatusText>

      {/* Footer with Map button */}
      <CardFooter>
        <MapButton
          onPress={() => {
            (navigation as any).navigate('LocationMap', {
              coordinates: {
                latitude: item?.Y,
                longitude: item?.X,
                item: item,
              },
            });
          }}
        >
          <MapIcon source={Icons.map_blue} />
          <MapButtonText>Map</MapButtonText>
        </MapButton>
      </CardFooter>
    </ItemCard>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      {/* Header */}
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon source={Icons.backArrow} />
        </TouchableOpacity>
        <HeaderTitle>
          Geo Fence Report{'\n'}({month} {year})
        </HeaderTitle>
        <Text style={{ width: 24 }} />
      </Header>

      {/* Content */}
      <DetailsContainer>
        {!data || !Array.isArray(data.InPolygonData) ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
            No data available
          </Text>
        ) : data.InPolygonData.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
            No records found
          </Text>
        ) : (
          <FlatList
            data={data.InPolygonData}
            keyExtractor={(item, index) =>
              `${item?.Vehicle ?? 'no-id'}-${index}`
            }
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <FlatRow style={{ height: 1, backgroundColor: '#eee' }} />
            )}
          />
        )}
      </DetailsContainer>
    </SafeAreaView>
  );
};

export default GeoFenceReportList;
