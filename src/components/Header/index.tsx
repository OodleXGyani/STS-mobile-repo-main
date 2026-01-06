import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Animated, TextInput, View, Text } from 'react-native';
import MenuButton from '../MenueButton';

import SearchIcon from '../../assets/icons/Search.png';
import CrossIcon from '../../assets/icons/cross_white.png';
import SortIcon from '../../assets/icons/Sort.png';
import CaretDownIcon from '../../assets/icons/caret/caret_down_grey.png';

import { SmallIcon } from '../../screens/Dashboard/components/AccordianList/accordian-styles';
import { moderateScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { SortPopupMenu } from '../SortPopUpMenue/SortPopupMenu';
import { useDashboardSort, useLiveTrack } from '../../screens/Dashboard/context';

const HeaderContainer = styled.View`
  flex-direction: row;
  height: ${moderateScale(50)}px;
  align-items: center;
  padding-bottom: ${moderateScale(20)}px;
  background-color: #003459;
  padding-top: ${moderateScale(10)}px;
  justify-content: space-between;
`;

const CenterContainer = styled.View`
  flex: 1;
  margin: 0 ${moderateScale(10)}px;
  justify-content: center;
`;

const RightContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  min-width: ${moderateScale(70)}px;
`;

const HeaderButton = styled(TouchableOpacity)`
  padding: ${moderateScale(10)}px;
`;

const AnimatedSearchInput = styled(Animated.createAnimatedComponent(TextInput))`
  height: ${moderateScale(35)}px;
  border-radius: ${moderateScale(5)}px;
  background-color: white;
  padding: 0 ${moderateScale(8)}px;
  font-size: ${moderateScale(16)}px;
`;

const VehicleSelectButton = styled(TouchableOpacity)`
  background-color: white;
  border-radius: ${moderateScale(8)}px;
  padding-horizontal: ${moderateScale(12)}px;
  padding-vertical: ${moderateScale(8)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-width: ${moderateScale(120)}px;
  height: ${moderateScale(36)}px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-offset: 0px ${moderateScale(2)}px;
  shadow-radius: ${moderateScale(4)}px;
  elevation: 3;
`;

const VehicleSelectText = styled.Text`
  color: #1F2937;
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  text-align: left;
`;

const CaretIcon = styled.Image`
  width: ${moderateScale(18)}px;
  height: ${moderateScale(18)}px;
  margin-left: ${moderateScale(10)}px;
`;

type RootDrawerParamList = {
  // Define your drawer routes here
  Home: undefined;
  // other screens
};

type DrawerNavProp = DrawerNavigationProp<RootDrawerParamList>;

interface AppHeaderProps {
  tabActive?: 'list' | 'map';
  onVehicleSelect?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  tabActive = 'list',
  onVehicleSelect 
}) => {
  const navigation = useNavigation<DrawerNavProp>();
  const animation = useRef(new Animated.Value(0)).current;
  
  // Use context for search state instead of local state
  const { 
    searchQuery, 
    searchActive, 
    setSearchQuery, 
    setSearchActive 
  } = useLiveTrack();
  
  // Use context for sort state
  const { sort, updateSort, sortModalVisible, setSortModalVisible } = useDashboardSort();
  
  console.log('sortd', sort);
  
  // Animate on searchActive change
  useEffect(() => {
    Animated.timing(animation, {
      toValue: searchActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // animating width requires false
    }).start();
  }, [searchActive]);

  // Interpolations for smooth width and opacity of search bar
  const inputWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const inputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Handle search input changes
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Handle search focus/blur
  const handleSearchFocus = () => {
    setSearchActive(true);
  };

  const handleSearchBlur = () => {
    // Keep search active if there's text
    if (!searchQuery.trim()) {
      setSearchActive(false);
    }
  };

  return (
    <HeaderContainer>
      {/* Menu Button on left */}
      <MenuButton on_press={() => navigation.openDrawer()} />

      {/* Center Container: Animated Search Bar - Only shown when tab is 'list' */}
      {tabActive === 'list' && (
        <CenterContainer>
          <AnimatedSearchInput
            style={{ width: inputWidth, opacity: inputOpacity }}
            placeholder="Search vehicles..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            autoFocus={searchActive}
          />
        </CenterContainer>
      )}

      {/* Right Buttons at extreme right */}
      <RightContainer>
        {tabActive === 'map' ? (
          /* Vehicle Selection Button - Only shown when tab is 'map' */
                    <VehicleSelectButton onPress={onVehicleSelect}>
            <VehicleSelectText>Select vehicle</VehicleSelectText>
            <CaretIcon
              source={CaretDownIcon}
              resizeMode="contain"
            />
          </VehicleSelectButton>
        ) : (
          /* Search and Sort buttons - Only shown when tab is 'list' */
          <>
            <HeaderButton onPress={() => setSearchActive(!searchActive)}>
              <SmallIcon
                source={searchActive ? CrossIcon : SearchIcon}
                style={{ width: moderateScale(20), height: moderateScale(20) }}
                resizeMode="contain"
              />
            </HeaderButton>

            <HeaderButton onPress={() => setSortModalVisible(true)}>
              <SmallIcon
                source={SortIcon}
                style={{ width: moderateScale(30), height: moderateScale(30) }}
                resizeMode="contain"
              />
            </HeaderButton>
          </>
        )}
      </RightContainer>
      <SortPopupMenu
        visible={sortModalVisible}
        currentState={sort}
        onClose={() => setSortModalVisible(false)}
        onChange={updateSort}
      />
    </HeaderContainer>
  );
};

export default AppHeader;
