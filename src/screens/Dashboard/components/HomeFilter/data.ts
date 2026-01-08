/**
 * HomeFilter Data
 * Hooks and utilities for transforming LiveTrack data into filter display format
 */

import { FilterData } from './types';
import { useLiveTrack } from '../../context';
import { VehicleStatus } from '../../context/types';
import { STATUS_DISPLAY_NAMES } from '../../utils/statusNormalizer';

/**
 * Hook to get filter data from Dashboard context
 * Transforms LiveTrackData into FilterData format
 */
export const useFilterData = (): FilterData => {
  const { liveTrackData } = useLiveTrack();

  if (!liveTrackData) {
    return {
      summary: { moving: 0, idle: 0, off: 0, noSignal: 0, filtered: 0 },
      locationSummary: [],
      vehicleTypes: [],
    };
  }

  // Transform liveTrackData to FilterData format
  const summary = {
    moving: liveTrackData.summary?.moving ?? 0,
    idle: liveTrackData.summary?.idle ?? 0,
    off: liveTrackData.summary?.off ?? 0,
    noSignal: liveTrackData.summary?.noSignal ?? 0,
    filtered: liveTrackData.summary?.filtered ?? 0,
  };

  const locationSummary = (liveTrackData.location_summary ?? []).map(location => ({
    govern_name: location?.govern_name ?? 'Unknown',
    no_vehicles: location?.no_vehicles ?? 0,
    areas: (location?.areas ?? []).map(area => ({
      area_name: area?.area_name ?? 'Unknown',
      no_vehicles: area?.no_vehicles ?? 0,
    })),
  }));

  const vehicleTypes = (liveTrackData.vehicle_types ?? []).map(vehicleType => ({
    vehicle_type: vehicleType.vehicle_type ?? 'Unknown',
    no_vehicles: vehicleType.no_vehicles ?? 0,
  }));

  return {
    summary,
    locationSummary,
    vehicleTypes,
  };
};

/**
 * Hook to get status items for filter UI
 * Returns array of status items with counts and colors
 */
export const useStatusItems = () => {
  const { liveTrackData } = useLiveTrack();

  const summary = {
    moving: liveTrackData?.summary?.moving ?? 0,
    idle: liveTrackData?.summary?.idle ?? 0,
    off: liveTrackData?.summary?.off ?? 0,
    noSignal: liveTrackData?.summary?.noSignal ?? 0,
    filtered: liveTrackData?.summary?.filtered ?? 0,
  };

  return [
    {
      key: VehicleStatus.MOVING,
      label: STATUS_DISPLAY_NAMES[VehicleStatus.MOVING],
      count: summary.moving,
      color: '#22C55E',
    },
    {
      key: VehicleStatus.IDLE,
      label: STATUS_DISPLAY_NAMES[VehicleStatus.IDLE],
      count: summary.idle,
      color: '#FACC15',
    },
    {
      key: VehicleStatus.OFF,
      label: STATUS_DISPLAY_NAMES[VehicleStatus.OFF],
      count: summary.off,
      color: '#9CA3AF',
    },
    {
      key: VehicleStatus.NO_SIGNAL,
      label: STATUS_DISPLAY_NAMES[VehicleStatus.NO_SIGNAL],
      count: summary.noSignal,
      color: '#3B82F6',
    },
  ];
};

/**
 * Legacy default filter data (for fallback/testing)
 */
export const FILTER_DATA: FilterData = {
  summary: {
    moving: 45,
    idle: 12,
    off: 8,
    noSignal: 5,
    filtered: 70,
  },
  locationSummary: [
    {
      govern_name: 'Cairo',
      no_vehicles: 35,
      areas: [
        { area_name: 'Downtown', no_vehicles: 15 },
        { area_name: 'Heliopolis', no_vehicles: 12 },
        { area_name: 'Maadi', no_vehicles: 8 },
      ],
    },
    {
      govern_name: 'Alexandria',
      no_vehicles: 28,
      areas: [
        { area_name: 'Miami', no_vehicles: 18 },
        { area_name: 'Stanley', no_vehicles: 10 },
      ],
    },
  ],
  vehicleTypes: [
    { vehicle_type: 'Car', no_vehicles: 25 },
    { vehicle_type: 'Truck', no_vehicles: 18 },
    { vehicle_type: 'Bus', no_vehicles: 12 },
  ],
};

/**
 * Legacy status items (for fallback/testing)
 */
export const STATUS_ITEMS = [
  {
    key: VehicleStatus.MOVING,
    label: STATUS_DISPLAY_NAMES[VehicleStatus.MOVING],
    count: FILTER_DATA.summary.moving,
    color: '#22C55E',
  },
  {
    key: VehicleStatus.IDLE,
    label: STATUS_DISPLAY_NAMES[VehicleStatus.IDLE],
    count: FILTER_DATA.summary.idle,
    color: '#FACC15',
  },
  {
    key: VehicleStatus.OFF,
    label: STATUS_DISPLAY_NAMES[VehicleStatus.OFF],
    count: FILTER_DATA.summary.off,
    color: '#9CA3AF',
  },
  {
    key: VehicleStatus.NO_SIGNAL,
    label: STATUS_DISPLAY_NAMES[VehicleStatus.NO_SIGNAL],
    count: FILTER_DATA.summary.noSignal,
    color: '#3B82F6',
  },
];
