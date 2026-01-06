import {
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import * as Keychain from 'react-native-keychain';

import { getApiBaseUrl, API_CONFIG } from './constants';
import { logout } from '../store/authSlice';
import { clearUser } from '../store/userSlice';

// =======================
// RAW BASE QUERY
// =======================

const rawBaseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  timeout: API_CONFIG.TIMEOUT,

  prepareHeaders: async headers => {
    try {
      console.log('📤 API Base URL:', getApiBaseUrl());
      console.log('🔍 Attempting to retrieve token from Keychain...');

      let token: string | null = null;

      // -------- Attempt 1: smarttrack_auth_token --------
      const authToken = await Keychain.getGenericPassword({
        service: 'smarttrack_auth_token',
      });

      if (authToken !== false && authToken.password) {
        token = authToken.password;
        console.log('✅ Token found via smarttrack_auth_token');
      }

      // -------- Attempt 2: fallback service --------
      if (!token) {
        const fallbackToken = await Keychain.getGenericPassword({
          service: 'smarttrack_auth',
        });

        if (fallbackToken !== false && fallbackToken.password) {
          token = fallbackToken.password;
          console.log('✅ Token found via smarttrack_auth');
        }
      }

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log(
          '🔐 Authorization header attached:',
          token.substring(0, 25) + '...',
        );
      } else {
        console.log('⚠️ No token found in Keychain');
      }
    } catch (error) {
      console.error('❌ Error preparing headers:', error);
    }

    return headers;
  },
});

// =======================
// BASE QUERY WITH AUTH
// =======================

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  console.log('📤 API Request Args:', args);
  console.log('🔗 Base URL:', getApiBaseUrl());

  const result = await rawBaseQuery(args, api, extraOptions);

  console.log('📥 API Response:', {
    status: result.meta?.response?.status,
    url: result.meta?.response?.url,
  });

  // =======================
  // HANDLE ERRORS
  // =======================

  if (result.error) {
    console.error('❌ API Error:', {
      status: 'status' in result.error ? result.error.status : 'unknown',
      data: result.error.data || 'no data',
      message: 'message' in result.error ? result.error.message : 'no message',
    });

    if ('status' in result.error) {
      if (result.error.status === 401) {
        console.log('🚨 401 Unauthorized → logging out');

        api.dispatch(logout({}));

        api.dispatch(clearUser());
      }
    }
  }

  return result;
};
