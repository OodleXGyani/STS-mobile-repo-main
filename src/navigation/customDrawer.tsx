import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';
import { useLogoutMutation } from '../services/auth';
import {
  Container,
  UserSection,
  UserIconHolder,
  UserIcon,
  UserTextHolder,
  UserName,
  UserDate,
  RoutesSection,
  LogoutSection,
  LogoutButton,
  LogoutIcon,
  LogoutText,
  OptionSeparator,
  UserEmail,
} from './style';
import Icons from '../common/icons';

interface NavItem {
  key: string;
  label: string;
  icon: any;
}

const navs: NavItem[] = [
  { key: 'Home', label: 'Dashboard', icon: Icons.dashboard_white },
  { key: 'Reports', label: 'Reports', icon: Icons.report_white },
  { key: 'vehicle_management', label: 'Vehicle Management', icon: Icons.vehicle_front_white },
  { key: 'driver_management', label: 'Driver Management', icon: Icons.driver_management_white },
  { key: 'user_management', label: 'User Management', icon: Icons.user_management_white },
  { key: 'system_admin', label: 'System Admin', icon: Icons.system_admin_white },
];

interface CustomDrawerContentProps {
  navigation: any;
  descriptors: any;
  state: any;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [logoutApi] = useLogoutMutation();
  const userName = useSelector((state:RootState) => state.user.name);
  
  const userDate = 'Aug 21, 2025';
  const userEmail = useSelector((state:RootState) => state.user.email);
  console.log('userEmail', userEmail, 'userName', userName)

  const handleLogout = async () => {
    try {
      // Call logout API first
      await logoutApi().unwrap();
      console.log('✅ Logout API call successful');
    } catch (error) {
      console.log('⚠️ Logout API call failed, but continuing with local logout:', error);
    } finally {
      // Always clear local authentication state and remove from Keychain
      dispatch(logout());
      console.log('🚪 User logged out successfully');
    }
  };

  return (
    <Container>
      <UserSection>
        <UserIconHolder>
          <UserIcon source={Icons.driver_white} resizeMode="contain" />
        </UserIconHolder>
        <UserTextHolder>
          <UserName>{userName}</UserName>
          {/* <UserDate>{userDate}</UserDate> */}
          <UserEmail numberOfLines={1} ellipsizeMode='tail'>{userEmail}</UserEmail>
        </UserTextHolder>
      </UserSection>

      <OptionSeparator />

      <RoutesSection>
        <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
          {navs.map(({ key, label, icon }) => (
            <DrawerItem
              key={key}
              label={label}
              icon={({ size }) => (
                <UserIcon
                  source={icon}
                  style={{ width: size, height: size, tintColor: 'white' }}
                />
              )}
              onPress={() => props.navigation.navigate(key)}
              labelStyle={{ color: 'white' }}
              style={{ marginVertical: 0 }}
            />
          ))}
        </DrawerContentScrollView>
      </RoutesSection>

      <OptionSeparator />

      <LogoutSection>
        <LogoutButton onPress={handleLogout}>
          <LogoutIcon source={Icons.logout_white} resizeMode="contain" />
          <LogoutText>Log Out</LogoutText>
        </LogoutButton>
      </LogoutSection>
    </Container>
  );
}

export default CustomDrawerContent;
