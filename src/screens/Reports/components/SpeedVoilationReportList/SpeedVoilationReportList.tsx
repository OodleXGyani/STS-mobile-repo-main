import React, { useState } from 'react';
import { Text, TouchableOpacity, FlatList, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  BackIcon,
  HeaderTitle,
  DetailsContainer,
  FlatRow,
  ItemContainer,
  LeftContainer,
  RightContainer,
  ItemHeader,
  ItemFooter,
  SpeedText,
  LocationText,
  MapButton,
  MapIcon,
  ItemName,
  ItemTime,
  LocationRow,
  LocationIcon,
  MapButtonText,
  FlatListHeader,
  Circle100,
  Circle100Text,
} from './speed-voilation-styles';
import { formatDateForDisplay, formatTo12Hour } from '../../../../utils';

const backIcon = require('../../../../assets/icons/backArrow.png');
const locationIcon = require('../../../../assets/icons/location_grey.png');
const mapIcon = require('../../../../assets/icons/map_blue.png');

const SpeedVoilationReportList: React.FC = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const speedvoilationData = (route.params as { data?: any })?.data;
  const { startDate, endDate } = route.params as { startDate: string, endDate: string };

  // The data coming from generateReportService is the result array directly
  const violationsList = Array.isArray(speedvoilationData) ? speedvoilationData : [];

  const renderItem = ({ item }: { item: any }) => (
    <ItemContainer>
      <RightContainer>
        <ItemHeader>
          <ItemName>{item?.Vehicle ?? 'Unknown Vehicle'}</ItemName>
          <ItemTime>
            {item?.Time ? formatTo12Hour(item.Time) : '--:--'}
          </ItemTime>
        </ItemHeader>

        <LocationRow>
          <LocationIcon source={locationIcon} />
          <LocationText>
            {item?.Road && item?.AreaName
              ? `${item.Road}, ${item.AreaName}`
              : 'NA'}
          </LocationText>
        </LocationRow>

        <ItemFooter>
          <LeftContainer style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Circle100>
              <Circle100Text>{item?.RoadSpeedLimit ?? '--'}</Circle100Text>
            </Circle100>
            <SpeedText>
              {item?.VehicleSpeed ? `${item.VehicleSpeed} km/h` : 'Speed N/A'}
            </SpeedText>
          </LeftContainer>

          <MapButton onPress={() => {
            console.log('item', item);

            (navigation as any).navigate('LocationMap', {
              coordinates: {
                latitude: item?.Y,
                longitude: item?.X,
                item: item,
              },
            });
          }}>
            <MapIcon source={mapIcon} />
            <MapButtonText>Map</MapButtonText>
          </MapButton>
        </ItemFooter>
      </RightContainer>
    </ItemContainer>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon source={backIcon} />
        </TouchableOpacity>
        <HeaderTitle>
          Speed Voilation Report{'\n'}({formatDateForDisplay(startDate)})
        </HeaderTitle>
        <Text style={{ width: 24 }} />
      </Header>

      <DetailsContainer>
        <FlatListHeader>Speed {'>'} 70 km/h</FlatListHeader>

        {!violationsList || violationsList.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text style={{ color: '#666', fontSize: 16 }}>
              No speed violations found
            </Text>
          </View>
        ) : (
          <FlatList
            data={violationsList}
            keyExtractor={(item, index) => `${item?.Time ?? 'no-time'}-${index}`}
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

export default SpeedVoilationReportList;
