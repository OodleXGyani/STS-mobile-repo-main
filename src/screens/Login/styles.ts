// LoginUI.styles.tsx
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Video from 'react-native-video';
import { TouchableOpacity, TextInput, Platform } from 'react-native';

// ----- Theme Colors -----
export const Colors = {
  primaryBlue: 'rgba(0,52,89,0.8)',
  primaryFont: '#FFFFFF',
  borderColor: '#A3BFFA',
  btnBg: '#2563EB',
  primary_btn_font_color: '#003459',
  primary_btn_background_color: '#FFFFFF',
};

// ----- Styled Components -----
export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.primaryBlue};
`;

export const BackgroundVideo = styled(Video)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const KeyboardWrapper = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1, justifyContent: 'center' },
})`
  flex: 1;
`;

export const Content = styled.View``;

export const LogoWrapper = styled.View`
  align-items: center;
`;

export const Logo = styled.Image`
  width: ${scale(200)}px;
  height: ${verticalScale(50)}px;
`;

export const LoginIcom = styled.Image`
  width: ${scale(22)}px;
  height: ${verticalScale(22)}px;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(18)}px;
  text-align: center;
  color: ${Colors.primaryFont};
  margin-top: ${verticalScale(20)}px;
`;

export const Subtitle = styled.Text`
  margin-top: ${verticalScale(10)}px;

  font-size: ${moderateScale(18)}px;
  text-align: center;
  color: ${Colors.primaryFont};
  margin-bottom: ${verticalScale(30)}px;
`;

export const InputWrapper = styled.View`
  margin-top: ${verticalScale(10)}px;

  align-items: center;
  justify-content: center;
`;

export const Input = styled(TextInput)`
  padding: ${moderateScale(12)}px;
  border-bottom-width: 1px;
  border-color: #ffffff;
  color: ${Colors.primaryFont};
  margin-top: ${verticalScale(30)}px;
  font-size: ${moderateScale(14)}px;
  width: ${moderateScale(300)};
`;

export const Button = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.primary_btn_background_color};
  padding: ${moderateScale(10)}px;

  margin-top: ${verticalScale(30)}px;
  width: ${moderateScale(300)};
  gap: ${moderateScale(10)};
`;

export const ButtonText = styled.Text`
  color: ${Colors.primary_btn_font_color};
  font-size: ${moderateScale(16)}px;
  font-weight: bold;
`;

export const ForgotPassword = styled(TouchableOpacity)`
  margin-top: ${verticalScale(15)}px;
  align-self: center;
`;

export const ForgotPasswordText = styled.Text`
  color: ${Colors.primaryFont};
  margin-top: ${verticalScale(15)}px;
  font-size: ${moderateScale(14)}px;
`;

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(131, 133, 140, 0.3);
`;

export const ErrorText = styled.Text`
  color: red;
  font-size: ${moderateScale(12)}px;
  margin-top: ${verticalScale(4)}px;
  margin-left: ${scale(25)}px;
  text-align: left;
  width: ${moderateScale(300)}px;
`;