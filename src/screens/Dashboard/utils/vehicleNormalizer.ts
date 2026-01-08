/**
 * Vehicle Normalizer
 * Converts raw API responses into normalized, typed data structures
 */

import { Vehicle, Group, LiveTrackData, VehicleStatus } from '../context/types';
import { normalizeStatus } from './statusNormalizer';

/**
 * Normalize a raw vehicle object from the API
 * Converts status strings to enum values and ensures all fields are present
 * 
 * @param vehicle Raw vehicle object from API
 * @returns Normalized Vehicle object
 */
export function normalizeVehicle(vehicle: any): Vehicle {
  // Ensure status is normalized to enum
  const status = normalizeStatus(vehicle.status);
  const lastStatus = vehicle.lastStatus ? normalizeStatus(vehicle.lastStatus) : null;

  return {
    id: vehicle.id ?? 0,
    unitAlias: vehicle.unitAlias ?? '',
    vehicleNumber: vehicle.vehicleNumber ?? 'N/A',
    
    driverName: vehicle.driverName ?? null,
    driverPhone: vehicle.driverPhone ?? 'N/A',
    driverEmployeeId: vehicle.driverEmployeeId ?? '',
    
    status,
    lastStatus,
    statusTime: vehicle.statusTime ?? new Date().toISOString(),
    
    coordinates: vehicle.coordinates ?? [0, 0],
    rotation: vehicle.rotation ?? 0,
    location: vehicle.location ?? 'Unknown',
    
    vehicleType: vehicle.vehicleType ?? 'car',
    signalStrength: vehicle.signalStrength ?? 'Unknown',
    fridgeTemperature: vehicle.fridgeTemperature ?? 0,
    
    speed: vehicle.speed ?? '0Km/h',
    speedLimit: vehicle.speedLimit ?? 'N/A',
    
    // Set normalized display fields
    name: vehicle.unitAlias ?? vehicle.vehicleNumber ?? `Vehicle-${vehicle.id}`,
    vehicle_Number: vehicle.vehicleNumber ?? 'N/A',
  };
}

/**
 * Normalize a raw group object from the API
 * Normalizes all vehicles within the group
 * 
 * @param group Raw group object from API
 * @returns Normalized Group object
 */
export function normalizeGroup(group: any): Group {
  const vehicles = Array.isArray(group.vehicles)
    ? group.vehicles.map((v: any) => normalizeVehicle(v))
    : [];

  return {
    id: group.id ?? group.name ?? 'unknown',
    name: group.name ?? 'Unknown Group',
    summary: {
      moving: group.summary?.moving ?? 0,
      idle: group.summary?.idle ?? 0,
      off: group.summary?.off ?? 0,
      noSignal: group.summary?.noSignal ?? 0,
      filtered: group.summary?.filtered ?? 0,
    },
    vehicles,
  };
}

/**
 * Normalize a complete API response
 * Converts all groups and vehicles to normalized structures
 * 
 * @param response Raw API response
 * @returns Normalized LiveTrackData object
 */
export function normalizeApiResponse(response: any): LiveTrackData {
  const groups = Array.isArray(response?.groups)
    ? response.groups.map((g: any) => normalizeGroup(g))
    : [];

  return {
    groups,
    summary: {
      moving: response?.summary?.moving ?? 0,
      idle: response?.summary?.idle ?? 0,
      off: response?.summary?.off ?? 0,
      noSignal: response?.summary?.noSignal ?? 0,
      filtered: response?.summary?.filtered ?? 0,
    },
    vehicles: response?.vehicles,
    areas: response?.areas,
    location_summary: response?.location_summary,
    vehicle_types: response?.vehicle_types,
  };
}

/**
 * Extract all vehicles from a LiveTrackData response
 * Flattens groups to get a single array of all vehicles
 * 
 * @param data LiveTrackData object
 * @returns Array of all vehicles
 */
export function getAllVehicles(data: LiveTrackData): Vehicle[] {
  if (!data.groups) return [];
  
  const vehicles: Vehicle[] = [];
  data.groups.forEach(group => {
    if (Array.isArray(group.vehicles)) {
      vehicles.push(...group.vehicles);
    }
  });
  
  return vehicles;
}

/**
 * Get vehicles filtered by status
 * 
 * @param data LiveTrackData object
 * @param status Status to filter by
 * @returns Array of vehicles matching the status
 */
export function getVehiclesByStatus(data: LiveTrackData, status: VehicleStatus): Vehicle[] {
  return getAllVehicles(data).filter(v => v.status === status);
}

/**
 * Get summary counts from all vehicles
 * Useful for recalculating totals from raw vehicle data
 * 
 * @param vehicles Array of vehicles
 * @returns StatusSummary with calculated counts
 */
export function calculateStatusSummary(vehicles: Vehicle[]): any {
  let moving = 0;
  let idle = 0;
  let off = 0;
  let noSignal = 0;

  vehicles.forEach(v => {
    switch (v.status) {
      case VehicleStatus.MOVING:
        moving++;
        break;
      case VehicleStatus.IDLE:
        idle++;
        break;
      case VehicleStatus.OFF:
        off++;
        break;
      case VehicleStatus.NO_SIGNAL:
        noSignal++;
        break;
    }
  });

  return {
    moving,
    idle,
    off,
    noSignal,
    filtered: vehicles.length,
  };
}
