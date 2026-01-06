// src/services/auth.ts
import { api } from './api';
import { API_ENDPOINTS } from './constants';

interface LoginResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: any;
}

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      { access_token: string; refresh_token: string; token_type: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN, // /api/auth/login
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: credentials,
      }),
      transformResponse: (response: LoginResponse) => ({
        access_token: response.tokens.accessToken,
        refresh_token: response.tokens.refreshToken,
        token_type: 'Bearer',
      }),
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation } = authApi;
