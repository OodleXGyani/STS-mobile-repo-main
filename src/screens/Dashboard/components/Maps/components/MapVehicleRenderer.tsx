import React, { useMemo } from 'react';
import { VehicleMarker } from './VehicleMarker';
import { Vehicle } from '../../VehicleSelectFilter/types';
import { Region } from 'react-native-maps';

interface MapVehicleRendererProps {
  vehicles: Vehicle[];
  onMarkerPress: (vehicle: Vehicle) => void;
}

/**
 * MapVehicleRenderer - Handles rendering of all vehicle markers on the map
 * 
 * @param vehicles - Array of vehicles to render
 * @param onMarkerPress - Callback when a vehicle marker is pressed
 */
const MapVehicleRendererComponent: React.FC<MapVehicleRendererProps> = ({
  vehicles,
  onMarkerPress,
}) => {
  // Memoize vehicle rendering to prevent unnecessary re-renders
  const vehicleMarkers = useMemo(() => {
    if (!vehicles || vehicles.length === 0) {
      return null;
    }

    return vehicles.map(vehicle => (
      <VehicleMarker
        key={vehicle.key}
        vehicle={vehicle}
        onMarkerPress={() => onMarkerPress(vehicle)}
      />
    ));
  }, [vehicles, onMarkerPress]);

  return <>{vehicleMarkers}</>;
};

export const MapVehicleRenderer = React.memo(MapVehicleRendererComponent);
