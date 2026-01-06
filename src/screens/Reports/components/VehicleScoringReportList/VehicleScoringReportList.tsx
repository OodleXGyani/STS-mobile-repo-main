import React, { useState } from 'react';
import { Text, TouchableOpacity, FlatList, View, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Header,
  BackIcon,
  HeaderTitle,
  DetailsContainer,
  FlatRow,
  ItemContainer,
  ItemHeader,
  ItemFooter,
  FlatListHeader,
  CarName,
  DetailLabel,
  DetailItem,
} from './vehicle-scoring-styles';
import { formatDateForDisplay, getMonthName } from '../../../../utils';
import InfoModal from '../InfoModal';

const backIcon = require('../../../../assets/icons/backArrow.png');
const starIconGrey = require('../../../../assets/icons/star_full_grey.png');
const starIconYellow = require('../../../../assets/icons/star_full_yellow.png');
const infoIcon = require('../../../../assets/icons/info_blue.png');

const VehicleScoringReportList: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data: vehicleScoringData } = route.params as { data: any };
  const { selectedMonth, selectedYear } = route.params as {
    selectedMonth: string;
    selectedYear: string;
  };
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [data, setData] = useState(
    vehicleScoringData.VehicleScoringList.map((item: any, index: number) => ({
      ...item,
      id: item.VehicleNumber || String(index),
      expanded: false,
    })),
  );

  const toggleExpand = (id: string) => {
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item,
      ),
    );
  };

  const renderStarRating = (score: number) => {
    const filledStars = Math.round((score / 100) * 5);
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 8,
        }}
      >
        {[1, 2, 3, 4, 5].map(star => (
          <Image
            key={star}
            source={star <= filledStars ? starIconYellow : starIconGrey}
            style={{ width: 12, height: 12, marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View>
      <ItemContainer>
        <ItemHeader>
          <CarName ellipsizeMode="tail" numberOfLines={1}>
            {item.Vehicle}
          </CarName>

          {renderStarRating(item.VehicleScore)}

          <Text style={{ marginRight: 8 }}>{item.VehicleScore}%</Text>

          <TouchableOpacity
            onPress={() => toggleExpand(item.id)}
            style={{
              backgroundColor: 'lightblue',
              padding: 5,
              borderRadius: 4,
            }}
          >
            <Text>{item.expanded ? 'Show Less' : 'Show More'}</Text>
          </TouchableOpacity>
        </ItemHeader>
      </ItemContainer>

      {item.expanded && (
        <View style={{ marginHorizontal: 10, paddingBottom: 10 }}>
          <ItemFooter>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <DetailItem>
                <DetailLabel>TDT </DetailLabel>
                {item.TotalKm}
              </DetailItem>
              <DetailItem style={{ marginRight: 20 }}>
                <DetailLabel>TTR </DetailLabel>
                {item.IdleTime}
              </DetailItem>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <DetailItem>
                <DetailLabel>SV </DetailLabel>
                {item.NoSpeedViolations}
              </DetailItem>
            </View>
          </ItemFooter>

          <ItemFooter style={{ marginTop: 8 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <DetailItem>
                <DetailLabel>EXSV </DetailLabel>
                {item.NoSpeedAbove125}
              </DetailItem>
              <DetailItem style={{ marginRight: 20 }}>
                <DetailLabel>SBV </DetailLabel>
                {item.NoSeatbeltViolations}
              </DetailItem>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <DetailItem>
                <DetailLabel>HC </DetailLabel>
                {item.NoHarshCornerings}
              </DetailItem>
              <DetailItem style={{ marginRight: 20 }}>
                <DetailLabel>SFS </DetailLabel>
                {item.SaftyScore}
              </DetailItem>
            </View>
          </ItemFooter>

          <ItemFooter style={{ marginTop: 8 }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <DetailItem>
                <DetailLabel>TID </DetailLabel>
                {item.NoOfStops}
              </DetailItem>
              <DetailItem style={{ marginRight: 20 }}>
                <DetailLabel>HB </DetailLabel>
                {item.NoHarshBreaks}
              </DetailItem>
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <DetailItem>
                <DetailLabel>HA </DetailLabel>
                {item.NoHarshAccelerates}
              </DetailItem>
              <DetailItem style={{ marginRight: 20 }}>
                <DetailLabel>ECS </DetailLabel>
                {item.EcoScore}
              </DetailItem>
            </View>
          </ItemFooter>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon source={backIcon} />
        </TouchableOpacity>
        <HeaderTitle>
          Vehicle Scoring Report{'\n'}({getMonthName(parseInt(selectedMonth))}{' '}
          {selectedYear})
        </HeaderTitle>
        <Text style={{ width: 24 }} />
      </Header>

      <DetailsContainer>
        <FlatListHeader>
          <Text
            style={{
              flex: 1,
              textAlign: 'left',
              fontSize: 16,
              color: '#003459',
            }}
          >
            Vehicle
          </Text>

          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 16,
              color: '#003459',
            }}
          >
            Vehicle Score(%)
          </Text>

          <View style={{ flex: 1 }} />
        </FlatListHeader>

        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item?.id ?? 'no-id'}-${index}`}
          renderItem={renderItem}
          ItemSeparatorComponent={() => (
            <FlatRow style={{ height: 1, backgroundColor: '#eee' }} />
          )}
        />
        <Text
          style={{
            fontSize: 12,
            color: 'gray',
            textAlign: 'center',
            marginVertical: 6,
          }}
        >
          *vehicles driven {'<'} 100 km are excluded.
        </Text>
      </DetailsContainer>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 45,
          left: 10,
          backgroundColor: '#fff',
          borderRadius: 25,
          zIndex: 1000,
        }}
        onPress={() => setShowInfoModal(true)}
      >
        <Image source={infoIcon} style={{ width: 40, height: 40, zIndex: 1000 }} />
      </TouchableOpacity>


      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </SafeAreaView>
  );
};

export default VehicleScoringReportList;
