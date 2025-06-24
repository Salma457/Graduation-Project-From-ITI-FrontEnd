import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  itianProfile: null,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
  const payload = action.payload;
  if (payload.user) {
    state.user = payload.user;
    state.role = payload.user.role;
    state.itianProfile = payload.itian_profile || null;
  } else {
    state.user = payload;
    state.role = payload?.role || null;
  }
}
,

    // clear user if the user logs out
    clearUser: (state) => {
      state.user = null;
      state.role = null;
    },
  },
});

export const { setUser, clearUser, setRole } = userSlice.actions;
export default userSlice.reducer;
