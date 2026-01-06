// services/geofences.ts
import { api } from './api';
import { API_ENDPOINTS } from './constants';

// Types for POI search request and response
export interface POISearchRequest {
  query: string;
}

export interface POIPoint {
  name: string;
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface POISearchResponse {
  areas: any[];
  blocks: any[];
  roads: any[];
  pois: POIPoint[];
}

// Types for Geofences
export interface GeofencePoint {
  name: string;
  id: number;
  user_id: number;
  coordinates: [number, number][]; // Array of [longitude, latitude] pairs
  duration: number;
  excess_limit: number;
  is_address: boolean;
  speed_limit: number;
  type: 'Point' | 'Polygon';
}

export interface GeofencesResponse {
  data: GeofencePoint[];
  message?: string;
  status?: string;
}

export const geofenceApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchPOI: build.mutation<POISearchResponse, POISearchRequest>({
      query: (requestBody) => ({
        url: `${API_ENDPOINTS.GEOFENCES.SEARCH_POI}/${requestBody.query}`,
        method: 'GET',
      }),
      // No cache invalidation for now since this is a search endpoint
    }),
    getGeofences: build.query<GeofencesResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.GEOFENCES.BASE,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

// Export the hooks for use in components
export const { useSearchPOIMutation, useGetGeofencesQuery } = geofenceApi;

