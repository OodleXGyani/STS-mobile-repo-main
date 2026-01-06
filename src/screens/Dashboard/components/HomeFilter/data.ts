import { FilterData } from './types';
import { useLiveTrack } from '../../context';

// Hook to get filter data from Dashboard context
export const useFilterData = (): FilterData => {
  const { liveTrackData } = useLiveTrack();
  
  if (!liveTrackData) {
    return {
      summary: { on: 0, idle: 0, off: 0, longoff: 0, no_signal: 0 },
      locationSummary: [],
      vehicleTypes: []
    };
  }

  // Transform liveTrackData to FilterData format with fallbacks for API data
  const summary = {
    on: liveTrackData.summary?.on || 0,
    idle: liveTrackData.summary?.idle || 0,
    off: liveTrackData.summary?.off || 0,
    longoff: liveTrackData.summary?.longoff || 0,
    no_signal: liveTrackData.summary?.no_signal || 0
  };
  
  const locationSummary = liveTrackData.location_summary?.map(location => ({
    govern_name: location?.govern_name || 'Unknown',
    no_vehicles: location?.no_vehicles || 0,
    areas: location?.areas?.map(area => ({
      area_name: area?.area_name || 'Unknown',
      no_vehicles: area?.no_vehicles || 0
    })) || []
  })) || [];
  
  const vehicleTypes = liveTrackData.vehicle_types?.map(vehicleType => ({
    vehicle_type: vehicleType.vehicle_type || 'Unknown',
    no_vehicles: vehicleType.no_vehicles || 0
  })) || [];

  return {
    summary,
    locationSummary,
    vehicleTypes
  };
};

// Legacy export for backward compatibility (will be removed)
export const FILTER_DATA: FilterData = {
  summary: {
    on: 45,
    idle: 12,
    off: 8,
    longoff: 3,
    no_signal: 5
  },
  locationSummary: [
    {
      govern_name: 'Cairo',
      no_vehicles: 35,
      areas: [
        { area_name: 'Downtown', no_vehicles: 15 },
        { area_name: 'Heliopolis', no_vehicles: 12 },
        { area_name: 'Maadi', no_vehicles: 8 }
      ]
    },
    {
      govern_name: 'Alexandria',
      no_vehicles: 28,
      areas: [
        { area_name: 'Miami', no_vehicles: 18 },
        { area_name: 'Stanley', no_vehicles: 10 }
      ]
    },
    {
      govern_name: 'Giza',
      no_vehicles: 22,
      areas: [
        { area_name: 'Pyramids', no_vehicles: 12 },
        { area_name: 'Dokki', no_vehicles: 10 }
      ]
    }
  ],
  vehicleTypes: [
    { vehicle_type: 'Car', no_vehicles: 25 },
    { vehicle_type: 'Truck', no_vehicles: 18 },
    { vehicle_type: 'Bus', no_vehicles: 12 },
    { vehicle_type: 'Motorcycle', no_vehicles: 8 },
    { vehicle_type: 'Van', no_vehicles: 15 },
    { vehicle_type: 'SUV', no_vehicles: 20 }
  ]
};

// Hook to get status items from Dashboard context
export const useStatusItems = () => {
  const { liveTrackData } = useLiveTrack();
  
  // Better fallbacks for API data that might be incomplete
  const summary = {
    on: liveTrackData?.summary?.on || 0,
    idle: liveTrackData?.summary?.idle || 0,
    off: liveTrackData?.summary?.off || 0,
    longoff: liveTrackData?.summary?.longoff || 0,
    no_signal: liveTrackData?.summary?.no_signal || 0
  };
  
  return [
    { key: 'on', label: 'Running', count: summary.on, color: '#4CAF50' },
    { key: 'idle', label: 'Idle', count: summary.idle, color: '#FF9800' },
    { key: 'off', label: 'Engine Off', count: summary.off, color: '#9E9E9E' },
    { key: 'longoff', label: 'Off > 5d', count: summary.longoff, color: '#9E9E9E' },
    { key: 'no_signal', label: 'No Signal', count: summary.no_signal, color: '#2196F3' }
  ];
};

// Legacy export for backward compatibility (will be removed)
export const STATUS_ITEMS = [
  { key: 'on', label: 'Running', count: FILTER_DATA.summary.on, color: '#4CAF50' },
  { key: 'idle', label: 'Idle', count: FILTER_DATA.summary.idle, color: '#FF9800' },
  { key: 'off', label: 'Engine Off', count: FILTER_DATA.summary.off, color: '#9E9E9E' },
  { key: 'longoff', label: 'Off > 5d', count: FILTER_DATA.summary.longoff, color: '#9E9E9E' },
  { key: 'no_signal', label: 'No Signal', count: FILTER_DATA.summary.no_signal, color: '#2196F3' }
];

// Test data variations for testing different scenarios
export const TEST_DATA_VARIATIONS = {
  empty: {
    summary: { on: 0, idle: 0, off: 0, longoff: 0, no_signal: 0 },
    locationSummary: [],
    vehicleTypes: []
  },
  large: {
    summary: { on: 150, idle: 45, off: 30, longoff: 15, no_signal: 25 },
    locationSummary: [
      {
        govern_name: 'Mega City',
        no_vehicles: 120,
        areas: [
          { area_name: 'District A', no_vehicles: 40 },
          { area_name: 'District B', no_vehicles: 35 },
          { area_name: 'District C', no_vehicles: 45 }
        ]
      }
    ],
    vehicleTypes: [
      { vehicle_type: 'Super Car', no_vehicles: 50 },
      { vehicle_type: 'Mega Truck', no_vehicles: 40 }
    ]
  }
};

// Function to get random test data for testing
export const getRandomTestData = (): FilterData => {
  const variations = Object.values(TEST_DATA_VARIATIONS);
  const randomIndex = Math.floor(Math.random() * variations.length);
  return variations[randomIndex];
};
