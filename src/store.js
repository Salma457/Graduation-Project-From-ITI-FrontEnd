import { configureStore } from '@reduxjs/toolkit';
import userReducer from './store/userSlice';
import itianRequestsReducer from './store/itianRequestsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    itianRequests: itianRequestsReducer,
  },
});

export default store;
