import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { userId, token, user } = action.payload;
      state.userId = userId;
      state.token = token;
      state.user = user;
    },
    setUpdatedUser: (state, action) => {
      const { updatedUser } = action.payload;
      state.user = updatedUser;
    },
    logout: () => initialState,
  },
});

export const selectUserToken = (state) => state.auth.token;
export const selectUserId = (state) => state.auth.userId;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;

export const { setCredentials, setUpdatedUser, logout } = authSlice.actions;
