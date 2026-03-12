import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  userEmail: string;
};

const initialState: AuthState = {
  userEmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.userEmail = action.payload;
    },
    logout: (state) => {
      state.userEmail = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;