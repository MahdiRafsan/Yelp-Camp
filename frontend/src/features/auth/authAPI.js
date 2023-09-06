import { api } from "../api/apiSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    googleOAuthLogin: builder.mutation({
      query: (code) => ({
        url: "auth/login/google",
        method: "POST",
        body: code,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGoogleOAuthLoginMutation,
} = authApi;
