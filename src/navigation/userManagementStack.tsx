import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserManagement from '../screens/UserManagement/UserManagement';
import EditUserScreen from '../screens/UserManagement/components/EditUserScreen/EditUserScreen';

const Stack = createNativeStackNavigator();

function UserManagementStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserManagementMain" component={UserManagement} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
    </Stack.Navigator>
  );
}

export default UserManagementStack;
