import { configureStore } from '@reduxjs/toolkit';
import userReducer from './store/userSlice';
import itianRequestsReducer from './store/itianRequestsSlice';
import jobPostReducer from './pages/Employer/jobPostSlice';
import jobsReducer from './store/jobsSlice';
import usersReducer from './store/usersSlice';
import chatReducer from './pages/Employer/chatSlice';
import { chatApi } from './api/chatApi';
import itianProfileReducer from './store/itianProfileSlice';
import employerProfileReducer from './store/employerProfileSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    itianRequests: itianRequestsReducer,
    jobPost: jobPostReducer,
    jobs: jobsReducer,
    users: usersReducer,
    chat: chatReducer,
    itianProfile: itianProfileReducer,
    employerProfile: employerProfileReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApi.middleware),
});

export default store;

