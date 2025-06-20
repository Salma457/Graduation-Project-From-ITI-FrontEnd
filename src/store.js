// store.js
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from'./pages/Employer/chatSlice';
import { chatApi } from './api/chatApi';
import jobPostReducer from './pages/Employer/jobPostSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    jobPost: jobPostReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});

export default store;