import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.role = action.payload?.role || null;
    },

    // clear user if the user logs out
    clearUser: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser, setRole } = userSlice.actions;
export default userSlice.reducer;
