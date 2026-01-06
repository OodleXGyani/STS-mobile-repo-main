import React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import BackArrow from '../../../../../assets/icons/backArrow.png';
import { SmallIcon } from '../../AccordianList/accordian-styles';

type RootDrawerParamList = {
  Home: undefined;
  // other screens
};

type DrawerNavProp = DrawerNavigationProp<RootDrawerParamList>;

const HeaderContainer = styled.View`
  flex-direction: row;
  height: 60px;
  align-items: center;
  padding: 0 10px;
  background-color: #003459;
  justify-content: space-between;
`;

const CenterContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled(Text)`
  font-size: ${moderateScale(16)}px;
  font-weight: bold;
  color: white;
  text-align: center;
  width: ${moderateScale(200)}px;
`;

const SubtitleText = styled(Text)`
  font-size: ${moderateScale(13)}px;
  color: #d9d9d9;
  text-align: center;
  width: ${moderateScale(200)}px;
`;

const TouchArea = styled(TouchableOpacity)`
  padding: ${moderateScale(6)}px;
`;

const SpacerIcon = styled(SmallIcon)`
  opacity: 0;
`;

const DetailHeader: React.FC<{ item: any }> = ({ item }) => {
  const navigation = useNavigation<DrawerNavProp>();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Optional: fallback route if there's no back stack
      navigation.navigate('Home');
    }
  };

  return (
    <HeaderContainer>
      {/* Back Button */}
      <TouchArea onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <SmallIcon
          source={BackArrow}
          style={{ width: moderateScale(25), height: moderateScale(25) }}
          resizeMode="contain"
        />
      </TouchArea>

      {/* Center Texts */}
      <CenterContainer>
        <TitleText numberOfLines={1} ellipsizeMode="tail">
         {item.driver_name}
        </TitleText>
        <SubtitleText numberOfLines={1} ellipsizeMode="tail">
          {item.vehicle_Number}
        </SubtitleText>
      </CenterContainer>

      {/* Empty Right Side to Balance Layout */}
      <SpacerIcon
        // keep same size as back icon to maintain perfect centering
        source={BackArrow}
        style={{ width: moderateScale(25), height: moderateScale(25) }}
        resizeMode="contain"
      />
    </HeaderContainer>
  );
};

export default DetailHeader;
