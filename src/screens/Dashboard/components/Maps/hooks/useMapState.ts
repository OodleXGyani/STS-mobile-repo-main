import { useState, useMemo, useCallback } from 'react';
import { Region } from 'react-native-maps';
import { BAHRAIN_REGION } from '../constants';
import { Vehicle } from '../../VehicleSelectFilter/types';

// Using Vehicle type from VehicleSelectFilter instead of local interface

interface UseMapStateProps {
  vehicles?: Vehicle[];
  initialRegion?: Region;
}

export const useMapState = ({ vehicles = [], initialRegion = BAHRAIN_REGION }: UseMapStateProps) => {
  const [region, setRegion] = useState<Region>(initialRegion);
  const [vehicleInfoVisible, setVehicleInfoVisible] = useState(false);
  const [selectedVehicleKey, setSelectedVehicleKey] = useState<string | null>(null);
  const [selectedVehicleData, setSelectedVehicleData] = useState<Vehicle | null>(null);
  const [layerPopupVisible, setLayerPopupVisible] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('standard');
  const [showModal, setShowModal] = useState(false);

  const onMarkerPress = useCallback((vehicleKey: string) => {
    console.log('🗺️ On Marker Press:', vehicleKey);
    setSelectedVehicleKey(vehicleKey);
    setShowModal(true);
    setVehicleInfoVisible(true);
  }, []);

  // Function to handle marker press with vehicle data
  const onMarkerPressWithData = useCallback((vehicle: Vehicle) => {
    console.log('🗺️ On Marker Press with Data:', vehicle);
    setSelectedVehicleKey(vehicle.key);
    setSelectedVehicleData(vehicle);
    setShowModal(true);
    setVehicleInfoVisible(true);
  }, []);

  const closeVehicleInfo = useCallback(() => {
    setVehicleInfoVisible(false);
    setSelectedVehicleKey(null);
    setSelectedVehicleData(null);
  }, []);

  const toggleLayerPopup = useCallback(() => setLayerPopupVisible(!layerPopupVisible), [layerPopupVisible]);

  const selectLayer = useCallback((layer: string) => {
    setSelectedLayer(layer);
    setLayerPopupVisible(false);
  }, []);

  const selectedVehicle = useMemo(() => 
    vehicles.find(v => v.key === selectedVehicleKey), 
    [vehicles, selectedVehicleKey]
  );

  return {
    region,
    setRegion,
    vehicleInfoVisible,
    selectedVehicleKey,
    selectedVehicleData,
    layerPopupVisible,
    selectedLayer,
    selectedVehicle,
    onMarkerPress,
    onMarkerPressWithData,
    closeVehicleInfo,
    toggleLayerPopup,
    selectLayer,
    showModal,
    setShowModal
  };
};
