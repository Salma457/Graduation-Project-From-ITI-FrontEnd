import { configureStore } from '@reduxjs/toolkit';
import userReducer from './store/userSlice';
import itianRequestsReducer from './store/itianRequestsSlice';
import jobPostReducer from './pages/Employer/jobPostSlice';
import jobsReducer from './store/jobsSlice';
import usersReducer from './store/usersSlice';
import chatReducer from './pages/Employer/chatSlice';
import { chatApi } from './api/chatApi';
import notificationsReducer from './notificationsSlice';
import { apiSlice } from './api/apiSlice';
import itianProfileReducer from './store/itianProfileSlice';
import employerProfileReducer from './store/employerProfileSlice';
import itianReducer from './Posts/store/itianSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    itianRequests: itianRequestsReducer,
    jobPost: jobPostReducer,
    jobs: jobsReducer,
    users: usersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    notifications: notificationsReducer,
    chat: chatReducer,
    itianProfile: itianProfileReducer,
    employerProfile: employerProfileReducer,
    itian: itianReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(
    chatApi.middleware,
    apiSlice.middleware
  ),

});

export default store;

