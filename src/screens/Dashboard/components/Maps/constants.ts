import { Region } from 'react-native-maps';

export const LAYER_OPTIONS = ['standard', 'satellite', 'hybrid'] as const;

export const BAHRAIN_REGION: Region = {
  latitude: 26.0667,
  longitude: 50.5577,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

// Clustering configuration constants
export const CLUSTERING_CONFIG = {
  // Visual styling
  clusterColor: '#1e3a8a',
  clusterTextColor: '#FFFFFF',
  
  // Clustering behavior
  radius: 50,           // Clustering radius in pixels (smaller = tighter clustering)
  minZoom: 1,           // Start clustering at this zoom level
  maxZoom: 12,          // Stop clustering at this zoom level (vehicles uncluster earlier)
  minPoints: 2,         // Minimum points to form a cluster
  
  // Animation
  animationEnabled: true,
  clusteringEnabled: true,
} as const;

// Mock data for development
export const MOCK_VEHICLES: Array<{
  key: string;
  name: string;
  coordinates: [number, number];
  has_signal: boolean;
}> = [
  {
    key: 'V001',
    name: 'Test Vehicle 1',
    coordinates: [50.57, 26.06],
    has_signal: true,
  },
  {
    key: 'V002',
    name: 'Test Vehicle 2',
    coordinates: [50.55, 26.08],
    has_signal: false,
  },
];
