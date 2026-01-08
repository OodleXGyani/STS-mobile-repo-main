// services/api.ts
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth } from './baseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'UserProfile', 'LiveTrack', 'Geofences'], // add common tag types here
  endpoints: () => ({}), // endpoints injected in feature-specific APIs
});
