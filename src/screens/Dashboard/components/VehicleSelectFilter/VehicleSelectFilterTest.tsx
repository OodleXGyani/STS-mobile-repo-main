import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { SelectVehiclePopup } from './index';
import { Vehicle } from './types';

const VehicleSelectFilterTest: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);

  const handleVehicleConfirm = (vehicles: Vehicle[]) => {
    console.log('✅ Vehicles selected:', vehicles);
    setSelectedVehicles(vehicles);
    setShowPopup(false);
    Alert.alert(
      'Selection Confirmed', 
      `Selected ${vehicles.length} vehicles:\n${vehicles.map(v => `• ${v.name} (${v.plateNumber})`).join('\n')}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Selection Test</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Current Selection: <Text style={styles.highlight}>{selectedVehicles.length} vehicles</Text>
        </Text>
        {selectedVehicles.length > 0 && (
          <Text style={styles.selectedText}>
            {selectedVehicles.map(v => `${v.name} (${v.plateNumber})`).join(', ')}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={() => setShowPopup(true)}
      >
        <Text style={styles.testButtonText}>
          🚗 Open Vehicle Selection
        </Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <Text style={styles.featureText}>• Search vehicles by name, plate, or driver</Text>
        <Text style={styles.featureText}>• Filter by vehicle type and status</Text>
        <Text style={styles.featureText}>• Select/deselect all vehicles</Text>
        <Text style={styles.featureText}>• Maximum selection limit (10 vehicles)</Text>
        <Text style={styles.featureText}>• Real-time selection count</Text>
        <Text style={styles.featureText}>• Responsive design with size-matters</Text>
      </View>

      {/* Vehicle Selection Popup */}
      <SelectVehiclePopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={handleVehicleConfirm}
        selectedVehicles={selectedVehicles}
        maxSelection={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: moderateScale(20),
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: moderateScale(16),
    color: '#333333',
    marginBottom: moderateScale(8),
  },
  highlight: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  selectedText: {
    fontSize: moderateScale(14),
    color: '#666666',
    fontStyle: 'italic',
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginBottom: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: moderateScale(12),
  },
  featureText: {
    fontSize: moderateScale(14),
    color: '#666666',
    marginBottom: moderateScale(6),
    lineHeight: moderateScale(20),
  },
});

export default VehicleSelectFilterTest;
