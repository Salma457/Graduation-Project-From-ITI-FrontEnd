import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  loading: true, // Add loading state
  itianProfile: null,
  employerProfile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Cleaned up: handle both user object and possible profile keys
      const payload = action.payload;
      state.user = payload;
      state.role = payload?.role || null;
      state.loading = false;
      state.itianProfile = payload.itian_profile || null;
      state.employerProfile = payload.employer_profile || null;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.loading = false;
      state.itianProfile = null;
      state.employerProfile = null;
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
