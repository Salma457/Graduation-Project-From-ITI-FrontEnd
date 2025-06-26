import { configureStore } from "@reduxjs/toolkit"
import jobPostReducer2 from "./slices/jobPostSlice"
import postsReducer2 from "./slices/postsSlice"

export const store = configureStore({
  reducer: {
    jobPost: jobPostReducer2,
    posts: postsReducer2,
  },
})

export default store
