import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import MenuButton from '../../../components/MenueButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const Container = styled.View`
  height: ${verticalScale(56)}px;
  background-color: #094067;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${scale(12)}px;
  justify-content: space-between;
`;

const MenuButtonContainer = styled(TouchableOpacity)`
  padding: ${moderateScale(8)}px;
`;

const TitleText = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${moderateScale(20)}px;
  font-weight: 600;
  color: #fff;
`;

const Placeholder = styled.View`
  width: ${scale(32)}px;
`;

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuPress }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <Container>
      <MenuButton on_press={() => navigation.openDrawer()} />

      <TitleText>{title}</TitleText>
      <Placeholder />
    </Container>
  );
};

export default Header;
