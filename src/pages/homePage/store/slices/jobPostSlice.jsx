import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_BASE_URL = "http://localhost:8000/api"

const handleApiResponse = async (response) => {
  const contentType = response.headers.get("content-type")
  const text = await response.text()

  let data
  if (contentType && contentType.includes("application/json")) {
    data = JSON.parse(text)
  } else {
    data = text
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Request failed",
      errors: data.errors || {},
      data: data,
    }
  }

  return data
}

export const fetchJobs = createAsyncThunk("jobPost/fetchJobs", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      headers: {
        Accept: "application/json",
      },
    })

    const data = await handleApiResponse(response)
    return Array.isArray(data) ? data : data.data || data.jobs || []
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Failed to fetch jobs",
      status: error.status,
    })
  }
})

export const fetchJobById = createAsyncThunk("jobPost/fetchJobById", async (jobId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("access-token")

    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })

    const data = await handleApiResponse(response)
    return data
  } catch (error) {
    return rejectWithValue({
      message: error.message || "Failed to fetch job",
      status: error.status,
    })
  }
})

const jobPostSlice2 = createSlice({
  name: "jobPost",
  initialState: {
    loading: false,
    error: null,
    success: false,
    jobs: [],
    jobDetails: null,
  },
  reducers: {
    resetJobState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
    clearJobDetails: (state) => {
      state.jobDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false
        state.jobDetails = action.payload.data
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { resetJobState, clearJobDetails } = jobPostSlice2.actions
export default jobPostSlice2.reducer
