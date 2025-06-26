import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = "http://localhost:8000/api"

const getAuthHeaders = () => {
  const token = localStorage.getItem("access-token")
  return {
    Authorization: `Bearer ${token}`,
  }
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async ({ rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch posts")
    }

    const data = await response.json()
    return Array.isArray(data) ? data : data.data || data.posts || []
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Failed to fetch posts",
    })
  }
})

export const fetchComments = createAsyncThunk("posts/fetchComments", async (postId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      headers: {
        ...getAuthHeaders(),
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch comments")
    }

    const data = await response.json()
    return { postId, comments: data }
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Failed to fetch comments",
    })
  }
})

const postsSlice2 = createSlice({
  name: "posts",
  initialState: {
    loading: false,
    error: null,
    posts: [],
    comments: {},
  },
  reducers: {
    resetPostsState: (state) => {
      state.loading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false
        state.posts = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments[action.payload.postId] = action.payload.comments
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { resetPostsState } = postsSlice2.actions
export default postsSlice2.reducer
