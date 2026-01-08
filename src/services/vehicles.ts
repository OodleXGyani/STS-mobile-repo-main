import { api } from "./api";
import { API_ENDPOINTS } from "./constants";

// Existing Vehicle interfaces
export interface VehicleInterface {
  id: number;
  number: string;
  alias: string;
  year: string | null;
  customId: string | null;
  driverId: number | null;
  makeModelId: number | null;
  typeId: number;
  enabled: boolean;
  icon: string | null;
  vehicleGroup: string | null;
  buzzerDisabled: boolean;
  comments: string | null;
  customerVehicleStatusId: number | null;
  hasCanbus: boolean;
  hasPanicButton: boolean;
  hasRfid: boolean;
  hasSeatbelt: boolean;
  hasTemperature: boolean;
  hasiButton: boolean;
  immobilize: boolean;
  trackingDisabled: boolean;
  brand?: string;
}

export interface VehicleResponse {
  items: VehicleInterface[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

interface GetVehiclesParams {
  pageIndex?: number;
  pageSize?: number;
  searchText?: string;
}

// Vehicle item within a group - represents individual vehicle data from backend
export interface VehicleItem {
  id: number;
  vehicle_type: string;
  vehicle_model: string | null;
  vehicle_number: string;
  vehicle_name: string;
  alias?: string;
  device?: {
    device_name: string;
  };
  typeName?: string;
  typeId?: number;
}

// Direct backend response format from the API (array of groups with "name" field)
// Shape: [{ "name": "BE", "vehicles": [...] }, { "name": "BL", "vehicles": [...] }]
export interface BackendVehicleGroup {
  name: string;
  vehicles: Array<{
    id: number;
    vehicle_type: string;
    vehicle_model: string | null;
    vehicle_Number: string;
    vehicle_name: string;
    device_name: string;
    vehicle_group: string;
  }>;
}

// Normalized vehicle group - used internally to standardize both backend response formats
// Single source of truth: group_name (from backend "name" or "group_name" field)
export interface VehicleGroup {
  group_id: number;
  group_name: string;
  vehicle_count: number;
  vehicles: VehicleItem[];
}

// Sub-group for secondary categorization (NOT USED - kept for backward compatibility)
// DO NOT use this for rendering. Backend groups are the single source of truth.
export interface VehicleSubGroup {
  subgroup_id: string;
  subgroup_name: string;
  vehicle_count: number;
  vehicles: VehicleItem[];
}

// Wrapped API response format: { "status": "success", "groups": [...] }
export interface GroupedVehicleResponse {
  status: string;
  total_groups: number;
  total_vehicles: number;
  groups: VehicleGroup[];
}

// Updated to match grouped API response structure
// Can be either:
// 1. Direct array: BackendVehicleGroup[] - array of groups with "name" field
// 2. Wrapped object: GroupedVehicleResponse - object with "groups" array and metadata
export type UserVehicleResponse = GroupedVehicleResponse | BackendVehicleGroup[];

interface GetUserVehiclesParams {
  pageIndex?: number;
  pageSize?: number;
  searchText?: string;
}

// Inject both endpoints into vehicleApi
export const vehicleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<VehicleResponse, GetVehiclesParams>({
      query: ({ pageIndex, pageSize, searchText } = {}) => ({
        url: "/Vehicle",
        method: "GET",
        params: { pageIndex, pageSize, searchText },
      }),
    }),
    getUserVehicles: builder.query<UserVehicleResponse, GetUserVehiclesParams>({
      query: ({ pageIndex, pageSize, searchText } = {}) => ({
        url: "/vehicle",
        method: "GET",
        params: { pageIndex, pageSize, searchText },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetVehiclesQuery, useGetUserVehiclesQuery } = vehicleApi;
