import { createSlice } from "@reduxjs/toolkit";
import { setCookie, removeCookie, getCookie } from "../utils/cookies";

const initialState = {
  user: null,
  token: getCookie("token") || null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token, user } = action.payload;
      setCookie("token", token);
      state.token = token;
      state.user = user;
    },
    logout: (state) => {
      removeCookie("token");
      state.token = null;
      state.user = null;
    },
    setUserFromCookie: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
    },
  },
});

export const { login, logout, setUserFromCookie } = authSlice.actions;
export default authSlice.reducer;
