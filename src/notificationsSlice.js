// src/features/notificationsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    list: [],
  },
  reducers: {
    setNotifications(state, action) {
      state.list = action.payload;
    },
    addNotification(state, action) {
      const exists = state.list.find(n => n.id === action.payload.id);
      if (!exists) {
        state.list.unshift(action.payload);
      }
    },
    clearNotifications(state) {
      state.list = [];
    },
  },
});

export const { setNotifications, addNotification, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
