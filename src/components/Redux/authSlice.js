import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: !!sessionStorage.getItem('token'),
  },
  reducers: {
    login(state) { state.isLoggedIn = true; },
    logout(state) {
      state.isLoggedIn = false;
      sessionStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
