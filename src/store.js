import { configureStore } from "@reduxjs/toolkit";
import jobPostReducer from "./pages/Employer/jobPostSlice";

export const store = configureStore({
  reducer: {
    jobPost: jobPostReducer,
    // أضف slices أخرى هنا
  },
});