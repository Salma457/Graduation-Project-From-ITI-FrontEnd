import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  loading: true, // Add loading state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role || null;
      state.loading = false; // Set loading to false after user is set
    },

    // clear user if the user logs out
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.loading = false;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setRole, setUserLoading } = userSlice.actions;
export default userSlice.reducer;
