import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import { clearUser } from './userSlice';

// ===== TYPES =====
export interface User {
  user_id: string;
  username: string;
  customer_id: string;
  group_id: string;
  is_group_admin: boolean;
  is_main: boolean;
  short_key: string;
  permissions: string[];
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  authLoading: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SetCredentialsPayload {
  accessToken: string;
  refreshToken: string;
}

// ===== INITIAL STATE =====
const initialState: AuthState = {
  token:null,
  refreshToken: null,
  isAuthenticated: false,
  user: null,
  authLoading: true,
};

// ===== AUTH SLICE =====
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set authentication credentials
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { accessToken, refreshToken } = action.payload;
      console.log('🔑 Setting credentials in Redux state:', accessToken, refreshToken);

      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.user = null; // No user decoding for now

      console.log('✅ Credentials set in Redux state');

      // Note: Keychain storage is now handled in the login component
      // to ensure proper async handling
    },

    // Logout user
    logout: (state, action) => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;

      console.log('🚪 User logged out');

      // Remove token from Keychain
      removeTokenFromKeychain();
      
      // Clear user data from Redux store
      // Note: We can't dispatch other actions from within a reducer,
      // so we'll handle this in the baseQuery or component level
    },

    // Set authentication loading state
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.authLoading = action.payload;
    },

    // Clear auth data (for cleanup)
    clearAuth: state => {
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.authLoading = false;

      console.log('🧹 Auth data cleared');

      // Remove token from Keychain
      removeTokenFromKeychain();
    },
  },
});

// ===== KEYCHAIN FUNCTIONS =====
const storeTokenInKeychain = async (accessToken: string) => {
  console.log('🔑 Storing token in Keychain:', accessToken);
  console.log('🔑 Token length:', accessToken?.length);
  console.log('🔑 Token type:', typeof accessToken);
  
  try {
    const result = await Keychain.setGenericPassword('smarttrack_auth', accessToken);
    console.log('✅ Keychain setGenericPassword result:', result);
    console.log('✅ Access token stored in Keychain successfully');
    
    // Verify the token was stored by trying to retrieve it
    const verifyResult = await Keychain.getGenericPassword({
      service: 'smarttrack_auth',
    });
    console.log('🔍 Verification - Retrieved from Keychain:', verifyResult);
    
  } catch (error) {
    console.error('❌ Failed to store token in Keychain:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
  }
};

const removeTokenFromKeychain = async () => {
  try {
    await Keychain.resetGenericPassword();
    console.log('✅ Token removed from Keychain');
  } catch (error) {
    console.error('❌ Failed to remove token from Keychain:', error);
  }
};

// ===== EXPORTS =====
export const { setCredentials, logout, setAuthLoading, clearAuth } =
  authSlice.actions;

// ===== SELECTORS =====
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectRefreshToken = (state: { auth: AuthState }) =>
  state.auth.refreshToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.authLoading;
export const selectUserRole = (state: { auth: AuthState }) =>
  state.auth.user?.is_group_admin ? 'admin' : 'user';
export const selectUserPermissions = (state: { auth: AuthState }) =>
  state.auth.user?.permissions || [];
export const selectShortKey = (state: { auth: AuthState }) =>
  state.auth.user?.short_key;
export const selectCustomerId = (state: { auth: AuthState }) =>
  state.auth.user?.customer_id;

// ===== UTILITY FUNCTIONS =====
export const hasPermission = (
  state: { auth: AuthState },
  permission: string,
): boolean => {
  const { user } = state.auth;
  return user?.permissions?.includes(permission) || false;
};

export const isGroupAdmin = (state: { auth: AuthState }): boolean => {
  const { user } = state.auth;
  return user?.is_group_admin || false;
};

export const isMainUser = (state: { auth: AuthState }): boolean => {
  const { user } = state.auth;
  return user?.is_main || false;
};

export default authSlice.reducer;
