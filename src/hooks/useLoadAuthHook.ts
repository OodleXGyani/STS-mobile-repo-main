import { useEffect } from "react";
import * as Keychain from "react-native-keychain";
import { useDispatch } from "react-redux";

import { setAuthLoading, setCredentials } from "../store/authSlice";
import { AppDispatch } from "../store/store";

const useLoadAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  console.log('🔄 useLoadAuth hook initialized');

  useEffect(() => {
    console.log('🔄 useLoadAuth useEffect running');
    
    // Debug: Check all stored credentials
    const debugKeychain = async () => {
      try {
        const allCredentials = await Keychain.getAllGenericPasswordServices();
        console.log('🔍 All Keychain services:', allCredentials);
      } catch (error) {
        console.log('🔍 Error checking Keychain services:', error);
      }
    };
    
    debugKeychain();
    
    const loadTokenFromKeychain = async () => {
      try {
        console.log('🔄 Starting to load token from Keychain...');
        dispatch(setAuthLoading(true));

        // Try to get credentials with service name
        let credentials = await Keychain.getGenericPassword({
          service: 'smarttrack_auth'
        });
        
        // If no credentials found, try without service (fallback)
        if (!credentials) {
          console.log('🔄 No credentials found with service, trying without service...');
          credentials = await Keychain.getGenericPassword();
        }

        if (credentials) {
          const accessToken = credentials.password;
          console.log("✅ Access token loaded from Keychain:", accessToken);

          // Set credentials with just the access token
          dispatch(setCredentials({ 
            accessToken: accessToken, 
            refreshToken: '', // Empty for now since we only store access token
          }));
          
          console.log("✅ Auth data loaded from Keychain and dispatched to Redux");
        } else {
          console.log("ℹ️ No credentials found in Keychain");
        }
      } catch (error) {
        console.error("❌ Failed to load auth data:", error);
      } finally {
        console.log('🔄 Setting authLoading to false');
        dispatch(setAuthLoading(false));
      }
    };

    loadTokenFromKeychain();
  }, [dispatch]);

  return null; // Hook doesn't need to return anything
};

export default useLoadAuth;
