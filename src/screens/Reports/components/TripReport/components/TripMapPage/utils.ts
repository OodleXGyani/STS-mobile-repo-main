import { TripMapData } from '../../types';
import { BAHRAIN_REGION } from '../../../../../Dashboard/components/Maps/constants';
import { MapRegion } from './types';

/**
 * TripMapPage Utility Functions
 * 
 * This file contains utility functions for the TripMapPage component,
 * separated for better maintainability and testability.
 */

/**
 * Fallback data generator for when route params are undefined
 */
export const getRouteParams = (route: any): { tripData: TripMapData; title: string } => {
  if (route?.params) {
    return route.params;
  }
  
  // Return default/fallback data if no params
  console.warn('🗺️ No route params found, using fallback data');
  return {
    tripData: {
      tripId: 'fallback',
      vehicle: { id: '1', plateNumber: 'N/A', type: 'car', status: 'on' },
      driver: { id: '1', name: 'N/A' },
      startTime: 'N/A',
      endTime: 'N/A',
      startLocation: 'N/A',
      endLocation: 'N/A',
      markers: [],
      path: { id: 'fallback', coordinates: [] },
      metrics: { 
        totalDistance: 0, 
        totalTime: 0, 
        idleTime: 0, 
        maxSpeed: 0, 
        averageSpeed: 0, 
        stopTime: 0, 
        numberOfStops: 0 
      },
      status: 'completed',
    },
    title: 'Map'
  };
};

/**
 * Calculate map region based on trip path coordinates
 */
export const calculateMapRegion = (tripData: TripMapData): MapRegion => {
  if (tripData.path.coordinates.length === 0) {
    return BAHRAIN_REGION; // Default region from dashboard constants
  }

  // Calculate bounds from trip coordinates
  const coordinates = tripData.path.coordinates;
  const latitudes = coordinates.map(coord => coord.latitude);
  const longitudes = coordinates.map(coord => coord.longitude);
  
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  
  const latDelta = (maxLat - minLat) * 1.3; // Add 30% padding for better view
  const lngDelta = (maxLng - minLng) * 1.3;
  
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

/**
 * Format time string for display
 */
export const formatTime = (timeString: string): string => {
  return timeString; // Already formatted in the data
};

/**
 * Format distance for display
 */
export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(1)} km`;
};

/**
 * Format duration from seconds to human readable format
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

/**
 * Transform API vehicle path data to TripMapData format
 */
export const transformApiDataToTripMapData = (apiData: any): TripMapData => {
  if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
    console.warn('🗺️ No valid API data provided, using fallback');
    return getRouteParams({}).tripData;
  }

  // Extract vehicle info from first data point
  const firstPoint = apiData[0];
  const vehicleName = firstPoint.Vehicle || 'Unknown Vehicle';
  
  // Transform coordinates to TripLocation format
  const coordinates = apiData.map((point: any, index: number) => ({
    latitude: point.Y, // Note: Y is latitude in the API data
    longitude: point.X, // Note: X is longitude in the API data
    timestamp: `${Math.floor(index / 60)}:${(index % 60).toString().padStart(2, '0')} AM`,
    address: `${point.Status} - Speed: ${point.Speed} km/h`,
    speed: point.Speed,
    heading: point.SpeedAngle,
  }));

  // Create markers from coordinates
  const markers = [];
  if (coordinates.length > 0) {
    // Start marker
    markers.push({
      id: 'start',
      type: 'start' as const,
      coordinate: {
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
      },
      title: 'Trip Start',
      description: `Started at ${coordinates[0].address}`,
      timestamp: coordinates[0].timestamp,
      address: coordinates[0].address,
      speed: coordinates[0].speed,
      heading: coordinates[0].heading,
    });

    // End marker
    if (coordinates.length > 1) {
      const lastPoint = coordinates[coordinates.length - 1];
      markers.push({
        id: 'end',
        type: 'end' as const,
        coordinate: {
          latitude: lastPoint.latitude,
          longitude: lastPoint.longitude,
        },
        title: 'Trip End',
        description: `Ended at ${lastPoint.address}`,
        timestamp: lastPoint.timestamp,
        address: lastPoint.address,
        speed: lastPoint.speed,
        heading: lastPoint.heading,
      });
    }
  }

  // Calculate metrics from the data
  const speeds = apiData.map(point => point.Speed).filter(speed => speed > 0);
  const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
  const totalDistance = calculateTotalDistance(coordinates);
  const totalTime = apiData.length * 60; // Assuming 1 minute intervals

  return {
    tripId: `trip_${Date.now()}`,
    vehicle: {
      id: vehicleName,
      plateNumber: vehicleName,
      type: 'Light',
      status: 'completed' as const,
    },
    driver: {
      id: 'driver_1',
      name: 'Driver',
    },
    startTime: coordinates[0]?.timestamp || 'N/A',
    endTime: coordinates[coordinates.length - 1]?.timestamp || 'N/A',
    startLocation: coordinates[0]?.address || 'N/A',
    endLocation: coordinates[coordinates.length - 1]?.address || 'N/A',
    markers,
    path: {
      id: `path_${Date.now()}`,
      coordinates,
      color: '#007AFF',
      strokeWidth: 4,
    },
    metrics: {
      totalDistance,
      totalTime,
      idleTime: 0,
      maxSpeed,
      averageSpeed: speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0,
      stopTime: 0,
      numberOfStops: 0,
    },
    status: 'completed' as const,
  };
};

/**
 * Calculate total distance from coordinates
 */
const calculateTotalDistance = (coordinates: any[]): number => {
  if (coordinates.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const distance = calculateDistance(
      coordinates[i - 1].latitude,
      coordinates[i - 1].longitude,
      coordinates[i].latitude,
      coordinates[i].longitude
    );
    totalDistance += distance;
  }
  return totalDistance;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Debug logging utility
 */
export const logDebugInfo = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(`🗺️ ${message}`, data || '');
  }
};
