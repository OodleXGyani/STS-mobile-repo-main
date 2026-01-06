import React, { useRef, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showSafeAlert } from '../../../../utils/AlertUtils';
import {
  Header,
  BackIcon,
  HeaderTitle,
  DetailsContainer,
  DetailsHeading,
  InputGroup,
  Label,
  Input,
  UpdateButton,
  UpdateButtonText,
  ErrorText,
  FieldWrapper,
} from './edituser-styles';
import {
  UserSettingsFormData,
  userSettingsSchema,
} from '../../../../schemas/formSchemas';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserManagementUsersMutation } from '../../../../services/user';

type ParamList = {
  EditUser: {
    user: { id: string; name: string; email?: string; mobile?: string };
  };
};

const backIcon = require('../../../../assets/icons/backArrow.png');

const EditUserScreen: React.FC = () => {
  // Mounted ref to prevent alerts on unmounted component
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const route = useRoute<RouteProp<ParamList, 'EditUser'>>();
  const { user } = route.params;
  const navigation = useNavigation();

  const [updateUser, { isLoading }] = useUpdateUserManagementUsersMutation(); 

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
    },
    mode: 'onChange',
  });

  const handleUpdate = async (data: UserSettingsFormData) => {
    try {
      // Transform the form data to match the required API payload format
      const payload = {
        id: user.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.mobile, // Map mobile to phoneNumber
      };

      const result = await updateUser({
        id: user.id,
        payload: payload,
      }).unwrap();
      showSafeAlert(mountedRef, 'Success', 'User updated successfully!');
      if (mountedRef.current) {
        navigation.goBack();
      }
    } catch (err: any) {
      console.error('Update failed:', err);
      showSafeAlert(mountedRef, 'Error', 'Failed to update user. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#003459' }}>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackIcon source={backIcon} />
        </TouchableOpacity>
        <HeaderTitle>User Management</HeaderTitle>
        <Text style={{ width: 24 }} />
      </Header>

      <DetailsContainer>
        <DetailsHeading>User Details</DetailsHeading>

        <FieldWrapper>
          <InputGroup>
            <Label>Name</Label>
            <Controller
              control={control}
              name="name"
              render={({ field: { value } }) => (
                <Input value={value} editable={false} />
              )}
            />
          </InputGroup>
          <ErrorText>{errors.name?.message || ' '}</ErrorText>
        </FieldWrapper>

        <FieldWrapper>
          <InputGroup>
            <Label>Phone</Label>
            <Controller
              control={control}
              name="mobile"
              render={({ field: { onChange, value } }) => (
                <Input value={value} onChangeText={onChange} editable />
              )}
            />
          </InputGroup>
          <ErrorText>{errors.mobile?.message || ' '}</ErrorText>
        </FieldWrapper>

        <FieldWrapper>
          <InputGroup>
            <Label>Email</Label>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input value={value} onChangeText={onChange} editable />
              )}
            />
          </InputGroup>
          <ErrorText>{errors.email?.message || ' '}</ErrorText>
        </FieldWrapper>

        <UpdateButton onPress={handleSubmit(handleUpdate)} disabled={isLoading}>
          <UpdateButtonText>
            {isLoading ? 'Updating...' : 'Update Information'}
          </UpdateButtonText>
        </UpdateButton>
      </DetailsContainer>
    </SafeAreaView>
  );
};

export default EditUserScreen;
