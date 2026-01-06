import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useEffect } from 'react';
import { showSafeAlert } from '../../../../utils/AlertUtils';
import {
  DetailsContainer,
  DetailsHeading,
  InputGroup,
  Label,
  Input,
  UpdateButton,
  UpdateButtonText,
  ErrorText,
} from './user-settings-styles';
import {
  useResetUserPasswordMutation,
  useUpdateUserMutation,
  useUpdateUserManagementUsersMutation,
} from '../../../../services/user';
import { ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  PasswordFormData,
  passwordSchema,
  UserSettingsFormData,
  userSettingsSchema,
} from '../../../../schemas/formSchemas';

const UserSettings: React.FC = () => {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [resetUserPassword, { isLoading: isPasswordUpdating }] =
    useResetUserPasswordMutation();

  const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserManagementUsersMutation();

  const user = useSelector((state: RootState) => state.user);

  const {
    control: userControl,
    handleSubmit: handleUserSubmit,
    formState: { errors: userErrors },
  } = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      mobile: user.phoneNumber || '',
    },
    mode: 'onChange',
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: '' },
    mode: 'onChange',
  });

  const onUpdateUser = async (data: UserSettingsFormData) => {
    try {
      if (!user.id) {
        console.error('User ID not found. Cannot update user.');
        showSafeAlert(mountedRef, 'Error', 'User ID not found. Cannot update user.');
        return;
      }

      // Transform the form data to match the required API payload format
      const payload = {
        id: user.id,
        payload: {
          id: user.id,
          name: data.name,
          email: data.email,
          phoneNumber: data.mobile, // Map mobile to phoneNumber
        },
      };

      const res = await updateUser(payload).unwrap();
      console.log('User updated successfully:', res);

      showSafeAlert(mountedRef, 'Success', 'User information has been updated successfully.');
    } catch (err: any) {
      console.error('Error updating user:', err?.data || err?.message || err);

      showSafeAlert(
        mountedRef,
        'Error',
        err?.data?.message || err?.message || 'Failed to update user.',
      );
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    try {
      if (!user.id) {
        console.error('User ID not found. Cannot reset password.');
        showSafeAlert(mountedRef, 'Error', 'User ID not found. Cannot reset password.');
        return;
      }

      const payload = {
        userId: user.id,
        newPassword: data.newPassword,
      };

      console.log('Sending reset password payload:', payload);

      const res = await resetUserPassword(payload).unwrap();
      console.log('Password reset successful:', res);

      showSafeAlert(mountedRef, 'Success', 'Password has been updated successfully.');
      resetPasswordForm();
    } catch (err: any) {
      console.error(
        'Error resetting password:',
        err?.data || err?.message || err,
      );

      showSafeAlert(
        mountedRef,
        'Error',
        err?.data?.message || err?.message || 'Failed to reset password.',
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
    >
      <DetailsContainer>
        {/* User Info Form */}
        <DetailsHeading>User Details</DetailsHeading>

        {/* <InputGroup>
          <Label>Name</Label>
          <Controller
            control={userControl}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter name"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </InputGroup> */}
        {userErrors.name && <ErrorText>{userErrors.name.message}</ErrorText>}

        <InputGroup>
          <Label>Email</Label>
          <Controller
            control={userControl}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </InputGroup>
        {userErrors.email && <ErrorText>{userErrors.email.message}</ErrorText>}

        <InputGroup>
          <Label>Phone Number</Label>
          <Controller
            control={userControl}
            name="mobile"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </InputGroup>
        {userErrors.mobile && (
          <ErrorText>{userErrors.mobile.message}</ErrorText>
        )}

        <UpdateButton onPress={handleUserSubmit(onUpdateUser)}>
          {isUserUpdating ? (
            <>
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginRight: 8 }}
              />
              <UpdateButtonText>Updating...</UpdateButtonText>
            </>
          ) : (
            <UpdateButtonText>Update Information</UpdateButtonText>
          )}
        </UpdateButton>

        {/* Password Form */}
        <DetailsHeading>Change Password</DetailsHeading>

        <InputGroup>
          <Label>New Password</Label>
          <Controller
            control={passwordControl}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Enter new password"
                secureTextEntry={true}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </InputGroup>
        {passwordErrors.newPassword && (
          <ErrorText>{passwordErrors.newPassword.message}</ErrorText>
        )}

        <UpdateButton onPress={handlePasswordSubmit(onChangePassword)}>
          {isPasswordUpdating ? (
            <>
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginRight: 8 }}
              />
              <UpdateButtonText>Updating...</UpdateButtonText>
            </>
          ) : (
            <UpdateButtonText>Change Password</UpdateButtonText>
          )}
        </UpdateButton>
      </DetailsContainer>
    </KeyboardAwareScrollView>
  );
};

export default UserSettings;
