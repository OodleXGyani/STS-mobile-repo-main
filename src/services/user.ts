import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<any, void>({
      query: () => '/user',
      providesTags: ['User'],
    }),
    getUserById: builder.query<any, number>({
      query: (id) => `/user/${id}`,
    }),
    // getUserManagementTreeList: builder.query<any, void>({
    //   query: () => 'Groups/33261/getUserManagementTreeList',
    // }),
    getUserManagementTreeList: builder.query<any, void>({
      query: () => '/group/33533/usermanagement-tree',
    }),
    // '/groups/users'
    resetUserPassword: builder.mutation<any, { newPassword: string; userId: string }>({
      query: (payload) => ({
        url: 'User/ResetPassword',
        method: "POST",
        body: payload,
      }),
    }),
    updateUser: builder.mutation<any, { id: string; payload: any }>({
      query: ({ id, payload }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: {
          id,
          ...payload,
        },
      }),
      invalidatesTags: ['User'],
    }),

    updateUserManagementUsers: builder.mutation<any, { id: string; payload: any }>({
      query: ({ id, payload }) => ({
        url: `/User/MobileUserUpdate/${id}`,   // <-- plural "users"
        method: "PUT",
        body: {
          id,              // <-- also sending id in body
          ...payload,
        },
      }),
    }),
    // updateUserManagementUsers: builder.mutation<any, { id: string; payload: any }>({
    //   query: ({ id, payload }) => ({
    //     url: `users/${id}`,   // <-- plural "users"
    //     method: "PUT",
    //     body: {
    //       id,              // <-- also sending id in body
    //       ...payload,
    //     },
    //   }),
    // }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useGetUserByIdQuery,
  useGetUserManagementTreeListQuery,
  useResetUserPasswordMutation,
  useUpdateUserMutation,
  useUpdateUserManagementUsersMutation
} = userApi;
