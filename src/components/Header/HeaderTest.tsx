import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import AppHeader from './index';
import { Colors } from '../../constants/colors';

const HeaderTest: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'list' | 'map'>('list');

  const handleVehicleSelect = () => {
    console.log('🚗 Vehicle selection button pressed from test component');
    // You can implement your vehicle selection logic here
  };

  const toggleTab = () => {
    setCurrentTab(prev => prev === 'list' ? 'map' : 'list');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Header with Vehicle Selection Test</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentTab === 'list' && styles.activeTab]}
          onPress={() => setCurrentTab('list')}
        >
          <Text style={[styles.tabText, currentTab === 'list' && styles.activeTabText]}>
            📋 LIST
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, currentTab === 'map' && styles.activeTab]}
          onPress={() => setCurrentTab('map')}
        >
          <Text style={[styles.tabText, currentTab === 'map' && styles.activeTabText]}>
            🗺️ MAP
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Current Tab: <Text style={styles.highlight}>{currentTab.toUpperCase()}</Text>
        {'\n\n'}
        {currentTab === 'map' 
          ? '✅ Vehicle selection button should be visible in header'
          : '❌ Vehicle selection button should be hidden'
        }
      </Text>

      <View style={styles.headerContainer}>
        <AppHeader 
          tabActive={currentTab}
          onVehicleSelect={handleVehicleSelect}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>• Vehicle selection button only shows on MAP tab</Text>
        <Text style={styles.infoText}>• Button has "Select vehicle" text with dropdown arrow</Text>
        <Text style={styles.infoText}>• Styled like the reference image (white background, rounded corners)</Text>
        <Text style={styles.infoText}>• Positioned in the right section of the header</Text>
        <Text style={styles.infoText}>• Clicking it triggers the onVehicleSelect callback</Text>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleTab}>
        <Text style={styles.toggleButtonText}>
          🔄 Switch to {currentTab === 'list' ? 'MAP' : 'LIST'} Tab
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: Colors.tertiary_background_color,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.primary_blue_color,
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(8),
    padding: moderateScale(4),
    marginBottom: moderateScale(20),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    padding: moderateScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(6),
  },
  activeTab: {
    backgroundColor: Colors.primary_blue_color,
  },
  tabText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.tertiary_font_color,
  },
  activeTabText: {
    color: Colors.white,
  },
  description: {
    fontSize: moderateScale(16),
    color: Colors.default_font_color,
    textAlign: 'center',
    marginBottom: moderateScale(20),
    lineHeight: moderateScale(24),
  },
  highlight: {
    color: Colors.vehicle_status_color_on,
    fontWeight: 'bold',
  },
  headerContainer: {
    backgroundColor: Colors.primary_blue_color,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(20),
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    backgroundColor: Colors.white,
    padding: moderateScale(20),
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(20),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: Colors.primary_blue_color,
    marginBottom: moderateScale(15),
  },
  infoText: {
    fontSize: moderateScale(14),
    color: Colors.default_font_color,
    marginBottom: moderateScale(8),
    lineHeight: moderateScale(20),
  },
  toggleButton: {
    backgroundColor: Colors.vehicle_status_color_on,
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButtonText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default HeaderTest;
