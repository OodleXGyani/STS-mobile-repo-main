import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  emailConfirmed: false,
  phoneNumber: null,
  userName: null,
  name: null,
  enabled: false,
  groupId: null,
  isMain: false,
  isGroupAdmin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;