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

// New UserVehicle interfaces based on the example response
export interface VehicleItem {
  vehicle_type: string;
  vehicle_model: string | null;
  vehicle_Number: string;
  vehicle_name: string;
  device_name: string;
  vehicle_group: string;
  id: number;
}

export interface VehicleGroupedByBrand {
  name: string;
  vehicles: VehicleItem[];
}

// Updated to match actual API response structure
export type UserVehicleResponse = VehicleGroupedByBrand[];

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
    getUserVehicles: builder.query<VehicleResponse, GetUserVehiclesParams>({
      query: ({ pageIndex, pageSize, searchText } = {}) => ({
        url: "/Vehicle",
        method: "GET",
        params: { pageIndex, pageSize, searchText },
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetVehiclesQuery, useGetUserVehiclesQuery } = vehicleApi;
