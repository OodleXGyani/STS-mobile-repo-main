import React, { useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Animated, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { moderateScale } from 'react-native-size-matters';

import MenuButton from '../MenueButton';
import SearchIcon from '../../assets/icons/Search.png';
import CrossIcon from '../../assets/icons/cross_white.png';
import { SmallIcon } from '../../screens/Dashboard/components/AccordianList/accordian-styles';
import SortMenu from './components/SortMenu';

const HeaderContainer = styled.View`
  flex-direction: row;
  height: ${moderateScale(50)}px;
  align-items: center;
  padding-bottom: ${moderateScale(20)}px;
  background-color: #003459;
  padding-top: ${moderateScale(12)}px;
  justify-content: space-between;
`;

const LeftContainer = styled.View`
  width: ${moderateScale(50)}px;
  justify-content: center;
  align-items: flex-start;
`;

const CenterContainer = styled.View<{ hasRightButton: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  ${props =>
    props.hasRightButton
      ? `margin: 0 ${moderateScale(10)}px;`
      : `margin-left: ${moderateScale(10)}px; margin-right: ${moderateScale(50)}px;`}
`;

const RightContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
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
  width: 100%;
`;

const TitleText = styled(Text)`
  color: white;
  font-size: ${moderateScale(14)}px;
  font-weight: 600;
  text-align: center;
`;

type RootDrawerParamList = {
  Home: undefined;
};

type DrawerNavProp = DrawerNavigationProp<RootDrawerParamList>;

interface SortOption {
  value: string;
  label: string;
}

interface AppHeaderGeneralProps {
  searchQuery: string;
  searchActive: boolean;
  setSearchQuery: (q: string) => void;
  setSearchActive: (active: boolean) => void;
  title: string;
  showSearchButton?: boolean;
  showSortButton?: boolean;
  sortBy?: string;
  sortType?: string;
  onSortSelect?: (value: string) => void;
  sortOptions?: SortOption[];   // ✅ fix typing here
}

const AppHeaderGeneral: React.FC<AppHeaderGeneralProps> = ({
  searchQuery,
  searchActive,
  setSearchQuery,
  setSearchActive,
  title,
  showSearchButton = true,
  showSortButton = false,
  sortBy = 'name',
  sortType = 'asc',
  sortOptions,
  onSortSelect = () => {},
}) => {
  const navigation = useNavigation<DrawerNavProp>();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: searchActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [searchActive]);

  const inputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleSearchBlur = () => {
    if (!searchQuery.trim()) {
      setSearchActive(false);
    }
  };

  return (
    <HeaderContainer>
      {/* Left Menu Button */}
      <LeftContainer>
        <MenuButton on_press={() => navigation.openDrawer()} />
      </LeftContainer>

      {/* Title / Search */}
      <CenterContainer hasRightButton={showSearchButton || showSortButton}>
        {searchActive ? (
          <AnimatedSearchInput
            style={{ opacity: inputOpacity }}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onBlur={handleSearchBlur}
            autoFocus={searchActive}
          />
        ) : (
          <TitleText>{title}</TitleText>
        )}
      </CenterContainer>

      {/* Right Actions */}
      <RightContainer>
        {showSearchButton && (
          <HeaderButton
            onPress={() => {
              if (searchActive) {
                setSearchQuery('');
                setSearchActive(false);
              } else {
                setSearchActive(true);
              }
            }}
          >
            <SmallIcon
              source={searchActive ? CrossIcon : SearchIcon}
              style={{ width: moderateScale(20), height: moderateScale(20) }}
              resizeMode="contain"
            />
          </HeaderButton>
        )}

        {showSortButton && (
          <SortMenu
            sortBy={sortBy}
            sortType={sortType}
            onSelect={onSortSelect}
            options={sortOptions || []}
          />
        )}
      </RightContainer>
    </HeaderContainer>
  );
};

export default AppHeaderGeneral;
