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
      providesTags: ['Geofences'],
    }),
    getGeofenceById: build.query<GeofencePoint, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.GEOFENCES.BASE}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Geofences', id }],
    }),
    createGeofence: build.mutation<any, Partial<GeofencePoint>>({
      query: (payload) => ({
        url: API_ENDPOINTS.GEOFENCES.CREATE,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Geofences'],
    }),
    updateGeofence: build.mutation<any, { id: number; payload: Partial<GeofencePoint> }>({
      query: ({ id, payload }) => ({
        url: `${API_ENDPOINTS.GEOFENCES.UPDATE}/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Geofences', id }, 'Geofences'],
    }),
    deleteGeofence: build.mutation<any, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.GEOFENCES.DELETE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Geofences'],
    }),
    getGeofenceCords: build.mutation<any, any>({
      query: (payload) => ({
        url: API_ENDPOINTS.GEOFENCES.GET_CORDS,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
  overrideExisting: false,
});

// Export the hooks for use in components
export const {
  useSearchPOIMutation,
  useGetGeofencesQuery,
  useGetGeofenceByIdQuery,
  useCreateGeofenceMutation,
  useUpdateGeofenceMutation,
  useDeleteGeofenceMutation,
  useGetGeofenceCordsMutation,
} = geofenceApi;

