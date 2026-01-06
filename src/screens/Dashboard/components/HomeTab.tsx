import React from 'react';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { View } from 'react-native';
import { SmallIcon } from './AccordianList/accordian-styles';
const mapIcon = require('../../../assets/icons/Map.png');
const listIcon = require('../../../assets/icons/Filter.png');

const TabBarContainer = styled.View`
  flex-direction: row;
  background-color: rgba(21, 113, 179, 1);
  height: ${moderateScale(45)}px;
  border: 0.1px solid white;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const TabText = styled.Text<{ active: boolean }>`
  color: white;
  font-size: ${scale(16)}px;
  margin-left: ${scale(8)}px;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  justify-content: center;
  text-align: center;
  align-items: center;
  /* width: 100%; */
`;

const Underline = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  height: ${verticalScale(0.8)}px;
  width: 100%;
  background-color: white;
  border-radius: ${scale(2)}px;
`;

type Props = {
  tabActive: 'list' | 'map';
  onTabPress: (tab: 'list' | 'map') => void;
};

const HomeTabs: React.FC<Props> = ({ tabActive = 'map', onTabPress }) => (
  <TabBarContainer>
    {['list', 'map'].map(tab => (
      <View key={tab} style={{ flex: 1, height: '100%' }}>
        <TabButton onPress={() => onTabPress(tab as 'list' | 'map')}>
          <Row>
            {tab === 'list' ? (
              <SmallIcon
                source={listIcon}
                style={{ width: scale(23), height: scale(23) }}
              />
            ) : (
              <SmallIcon
                source={mapIcon}
                style={{ width: scale(23), height: scale(23) }}
              />
            )}
            <TabText active={tabActive === tab}>{tab.toUpperCase()}</TabText>
          </Row>
          {tabActive === tab && <Underline />}
        </TabButton>
      </View>
    ))}
  </TabBarContainer>
);

export default HomeTabs;
