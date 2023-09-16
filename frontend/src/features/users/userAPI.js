import { api } from "../api/apiSlice";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page }) => `user?page=${page}&limit=10`,
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (userId) => `user/${userId}`,
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ user, id }) => ({
        url: `user/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getCampgroundsByUser: builder.query({
      query: ({ userId, page }) =>
        `user/${userId}/campgrounds?page=${page}&limit=6`,
      providesTags: ["Campgrounds"],
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
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetCampgroundsByUserQuery,
  useUpdatePasswordMutation,
  useInitiatePasswordResetMutation,
  useResetPasswordMutation,
} = userApi;
