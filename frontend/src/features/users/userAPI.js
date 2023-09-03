import { api } from "../api/apiSlice";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => ({
        url: `user/${userId}`,
        credentials: "include",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ user, id }) => ({
        url: `user/${id}`,
        method: "PATCH",
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ passwordData, id }) => ({
        url: `user/password/${id}`,
        method: "PATCH",
        body: passwordData,
      }),
    }),
    initiatePasswordReset: builder.mutation({
      query: (usernameOrEmail) => ({
        url: "user/password",
        method: "POST",
        body: usernameOrEmail,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ passwordData, token }) => ({
        url: `user/password/${token}`,
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdatePasswordMutation,
  useInitiatePasswordResetMutation,
  useResetPasswordMutation,
} = userApi;
