import React, { useMemo } from 'react';
import { Polygon, Marker } from 'react-native-maps';
import {
  useGetGeofencesQuery,
  GeofencePoint,
} from '../../../../../services/geofences';

interface MapGeofencesProps {
  showGeofences: boolean;
}

/**
 * MapGeofences - Renders geofence polygons and points on the map
 *
 * @param showGeofences - Boolean to control geofence visibility
 */
const MapGeofencesComponent: React.FC<MapGeofencesProps> = ({
  showGeofences,
}) => {
  const { data: geofencesResponse, isLoading, error } = useGetGeofencesQuery();
  
  // Memoize processed geofences to prevent unnecessary re-renders
  const processedGeofences = useMemo(() => {
    if (!geofencesResponse) return { polygons: [], points: [] };

    const polygons: Array<{
      coordinates: Array<{ latitude: number; longitude: number }>;
      geofence: GeofencePoint;
    }> = [];
    const points: Array<{
      coordinate: { latitude: number; longitude: number };
      geofence: GeofencePoint;
    }> = [];

    // Type assertion since API returns array directly, not wrapped in data object
    const geofences = geofencesResponse as unknown as GeofencePoint[];
    
    geofences.forEach((geofence: GeofencePoint) => {
      if (geofence.type === 'Polygon' && geofence.coordinates.length > 0) {
        // Handle polygon coordinates - convert from [longitude, latitude] to {latitude, longitude}
        // For polygons, coordinates[0] is an array of [longitude, latitude] pairs
        const polygonCoords = (geofence.coordinates[0] as unknown as number[][]).map(
          (coord: number[]) => ({
            latitude: coord[1], // latitude is second element
            longitude: coord[0], // longitude is first element
          }),
        );

        polygons.push({
          coordinates: polygonCoords,
          geofence,
        });
      } else if (geofence.type === 'Point' && geofence.coordinates.length > 0) {
        // Handle point coordinates
        // For points, coordinates[0] is a single [longitude, latitude] pair
        const point = geofence.coordinates[0] as unknown as number[];
        const convertedPoint = {
          latitude: point[1], // latitude is second element
          longitude: point[0], // longitude is first element
        };

        points.push({
          coordinate: convertedPoint,
          geofence,
        });
      }
    });

    return { polygons, points };
  }, [geofencesResponse]);

  if (!showGeofences) {
    return null;
  }

  if (isLoading) {
    return null; // You could add a loading indicator here if needed
  }

  if (error) {
    return null; // You could add an error indicator here if needed
  }

  return (
    <>
      {/* Render Polygon geofences */}
      {processedGeofences.polygons.map((polygonData) => (
        <Polygon
          key={`polygon-${polygonData.geofence.id}`}
          coordinates={polygonData.coordinates}
          // strokeColor="rgba(255,0,0,1)"
          // fillColor="rgba(255,0,0,0.3)"
          // strokeWidth={3}
        />
      ))}
      
      {/* Render Point geofences as markers */}
      {/* {processedGeofences.points.map((pointData) => (
        <Marker
          key={`point-${pointData.geofence.id}`}
          coordinate={pointData.coordinate}
          title={pointData.geofence.name || `Geofence ${pointData.geofence.id}`}
          description={`Speed Limit: ${pointData.geofence.speed_limit} km/h`}
          pinColor="red"
        />
      ))} */}
    </>
  );
};

export const MapGeofences = React.memo(MapGeofencesComponent);
