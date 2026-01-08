import type { VehicleGroup, VehicleItem, VehicleSubGroup } from '../services/vehicles';

/**
 * DEPRECATED: This function is NOT used in the current implementation.
 *
 * ⚠️  DO NOT USE createNestedVehicleGroups()
 *
 * Backend groups are the SINGLE SOURCE OF TRUTH.
 * The UI must display groups exactly as returned by the backend.
 * No secondary categorization (by vehicle_type, brand, etc.) is allowed.
 *
 * This function is kept for reference only and should be removed in a future cleanup.
 *
 * See requirement: "No secondary categorization"
 * See requirement: "Treat group_name / name as the single source of truth"
 */
export const createNestedVehicleGroups = (
  flatGroups: VehicleGroup[]
): VehicleGroup[] => {
  console.warn(
    '⚠️  WARNING: createNestedVehicleGroups() is DEPRECATED and should not be used. ' +
    'Backend groups are the single source of truth. Render groups directly from API response.'
  );

  return flatGroups.map(group => {
    const subgroupMap = new Map<string, VehicleItem[]>();

    // Group vehicles by vehicle_type
    group.vehicles.forEach(vehicle => {
      const vehicleType = vehicle.vehicle_type?.trim() || 'Other';

      if (!subgroupMap.has(vehicleType)) {
        subgroupMap.set(vehicleType, []);
      }
      subgroupMap.get(vehicleType)!.push(vehicle);
    });

    const subgroups: VehicleSubGroup[] = Array.from(subgroupMap.entries())
      .filter(([, vehicles]) => vehicles.length > 0)
      .sort(([nameA], [nameB]) => {
        if (nameA === 'Other') return 1;
        if (nameB === 'Other') return -1;
        return nameA.localeCompare(nameB);
      })
      .map(([vehicleType, vehicles]) => ({
        subgroup_id: `${group.group_id}_${vehicleType}`,
        subgroup_name: vehicleType,
        vehicle_count: vehicles.length,
        vehicles: vehicles.sort((a, b) =>
          a.vehicle_name.localeCompare(b.vehicle_name)
        ),
      }));

    return {
      ...group,
      subgroups,
    };
  });
};

/**
 * DEPRECATED: Not used in current implementation.
 * Kept for backward compatibility only.
 */
export const flattenNestedVehicleGroups = (
  nestedGroups: VehicleGroup[]
): VehicleGroup[] => {
  console.warn(
    '⚠️  WARNING: flattenNestedVehicleGroups() is DEPRECATED and should not be used.'
  );

  return nestedGroups.map(group => ({
    ...group,
    subgroups: undefined,
  }));
};

/**
 * Get total vehicle count from nested groups
 */
export const getTotalVehicleCount = (groups: VehicleGroup[]): number => {
  return groups.reduce((total, group) => total + group.vehicle_count, 0);
};

/**
 * Get total sub-category count
 */
export const getTotalSubgroupCount = (groups: VehicleGroup[]): number => {
  return groups.reduce((total, group) => {
    return total + (group.subgroups?.length ?? 0);
  }, 0);
};
