import React, { useRef, useEffect } from 'react';
import {
  StatusBar,
  Alert,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import { useLoginMutation } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { AppDispatch } from '../../store/store';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Keychain from 'react-native-keychain';
import { showSafeAlert } from '../../utils/AlertUtils';

import {
  Container,
  BackgroundVideo,
  KeyboardWrapper,
  ScrollContainer,
  Content,
  LogoWrapper,
  Logo,
  Title,
  Subtitle,
  InputWrapper,
  Input,
  Button,
  ButtonText,
  ForgotPassword,
  ForgotPasswordText,
  Colors,
  LoginIcom,
  ErrorText,
} from './styles';
import Video from 'react-native-video';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LoginFormData, loginSchema } from '../../schemas/formSchemas';

const LoginUI: React.FC = () => {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const videoRef = useRef<React.ElementRef<typeof Video>>(null);

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await login({
        username: data.username.trim(),
        password: data.password,
      }).unwrap();

      console.log('✅ Login successful:', response);


      const accessToken = response.access_token;
      const refreshToken = response.refresh_token;
      

      // Store token in Keychain first (properly awaited)
      try {
     
        
        // Store access token with a separate service to avoid conflicts with user data
        const keychainResult = await Keychain.setGenericPassword('smarttrack_auth_token', accessToken, {
          service: 'smarttrack_auth_token',
        });
 
        
        // Verify the access token was stored correctly
        const verifyResult = await Keychain.getGenericPassword({
          service: 'smarttrack_auth_token',
        });

   
      
        
      } catch (keychainError) {
        console.error('❌ Failed to store token in Keychain:', keychainError);
        console.error('❌ Keychain error details:', JSON.stringify(keychainError, null, 2));
        
        // Try alternative storage method
        try {
          console.log('🔄 Trying alternative Keychain storage method...');
          const altResult = await Keychain.setInternetCredentials('smarttrack_auth', 'access_token', accessToken);
          console.log('✅ Alternative Keychain storage result:', altResult);
        } catch (altError) {
          console.error('❌ Alternative Keychain storage also failed:', altError);
        }
      }

      // Then dispatch to Redux
      dispatch(
        setCredentials({
          accessToken,
          refreshToken,
        }),
      );

      // Alert.alert('Success', 'Login successful! Credentials saved to store.');
    } catch (error) {
      console.error('❌ Login failed:', error);
      showSafeAlert(
        mountedRef,
        'Error',
        'Login failed. Please check your credentials and try again.',
      );
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={Colors.primaryBlue}
        barStyle="light-content"
      />

      <BackgroundVideo
        ref={videoRef}
        source={require('../../assets/misc/login_bg.mp4')}
        resizeMode="cover"
        repeat
        muted
      />

      <Container>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={20}
        >
          <Content>
            <LogoWrapper>
              <Logo
                source={require('../../assets/misc/logo.png')}
                resizeMode="contain"
              />
            </LogoWrapper>

            <Title>Welcome to Smart Track</Title>
            <Subtitle>Sign In!</Subtitle>

            <InputWrapper>
              {/* Username */}
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Username"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.username && (
                <ErrorText>{errors.username.message}</ErrorText>
              )}

              {/* Password */}
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Password"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.password && (
                <ErrorText>{errors.password.message}</ErrorText>
              )}
            </InputWrapper>

            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                activeOpacity={0.7}
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
              >
                {!isLoading && (
                  <LoginIcom
                    source={require('../../assets/icons/login_solid_blue.png')}
                    resizeMode="contain"
                  />
                )}
                <ButtonText>
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.primaryBlue}
                    />
                  ) : (
                    'Login'
                  )}
                </ButtonText>
              </Button>
            </View>

            <ForgotPassword onPress={() => showSafeAlert(mountedRef, 'Reset Password', 'Password reset feature coming soon.')}>
              <ForgotPasswordText>Forgot password?</ForgotPasswordText>
            </ForgotPassword>
          </Content>
        </KeyboardAwareScrollView>
      </Container>
    </>
  );
};

export default LoginUI;
