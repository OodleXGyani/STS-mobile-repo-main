// services/liveTrack.ts
import { api } from './api';
import { API_ENDPOINTS } from './constants';

// Types for LiveTrack request and response
export interface LiveTrackRequest {
  sort_by: string;
  sort_type: 'asc' | 'desc';
  group_by: string;
  status: string[];
  location: string[];
  vehicle_type: string[];
  search_text: string | null;
}

export interface LiveTrackResponse {
  location_summary: any[];
  vehicle_types: any[];
  summary: any;
  groups: any[];
  areas: any[];
  vehicles: any[];
}

export const liveTrackApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLiveTrackData: build.mutation<LiveTrackResponse, LiveTrackRequest>({
      query: (requestBody) => ({
        url: API_ENDPOINTS.LIVETRACK.GET_DATA,
        method: 'POST',
        body: requestBody,
      }),
      // Invalidate relevant cache tags when data changes
      invalidatesTags: ['LiveTrack'],
    }),
  }),
  overrideExisting: false,
});

// Export the hook for use in components
export const { useGetLiveTrackDataMutation } = liveTrackApi;
