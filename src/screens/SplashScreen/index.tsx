import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, StatusBar } from 'react-native';
import { verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../../constants/colors';

type Props = {
  navigation?: any;
  autoNavigate?: boolean;
};

export default function SplashScreen({ navigation, autoNavigate = true }: Props) {
  useEffect(() => {
    if (autoNavigate && navigation) {
      const timer = setTimeout(() => {
        navigation.replace('Login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [navigation, autoNavigate]);

  return (
    <>
      <StatusBar
        backgroundColor={Colors.primary_blue_color}
        barStyle="light-content"
      />
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/misc/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

        </View>

      
        {/* Version Info */}
        <View style={styles.versionContainer}>
          {/* <Text style={styles.versionText}>v1.0.0</Text> */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary_blue_color,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: moderateScale(250),
    height: moderateScale(250),
    marginBottom: verticalScale(20),
  },
  appName: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  tagline: {
    fontSize: moderateScale(16),
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  loadingText: {
    color: Colors.white,
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    opacity: 0.9,
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: Colors.white,
    opacity: 0.6,
    fontSize: moderateScale(14),
  },
});
