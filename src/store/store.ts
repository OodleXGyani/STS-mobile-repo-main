import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import counterReducer from "./counterSlice"
import authReducer from "./authSlice"
import userReducer from "./userSlice"
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    counter:counterReducer,
    auth: authReducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
