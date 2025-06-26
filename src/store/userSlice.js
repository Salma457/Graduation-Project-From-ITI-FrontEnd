import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  itianProfile: null,
  employerProfile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;
      state.user = payload;
      state.role = payload.role || null;
      state.itianProfile = payload.itian_profile || null;
      state.employerProfile = payload.employer_profile || null;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.itianProfile = null;
      state.employerProfile = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    }
  },
});

export const { setUser, clearUser, setRole } = userSlice.actions;
export default userSlice.reducer;
