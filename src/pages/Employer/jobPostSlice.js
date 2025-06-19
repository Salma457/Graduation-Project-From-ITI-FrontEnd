// features/jobPost/jobPostSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { useSelector } from 'react-redux';
// 
// Update API base URL - make sure this matches your Laravel backend URL
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust port if different

export const postJob = createAsyncThunk(
  'jobPost/postJob',
  async (jobData, { rejectWithValue }) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('access-token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Format the job data according to backend requirements
      const formattedData = {
        job_title: jobData.job_title,
        description: jobData.description,
        requirements: jobData.requirements || '',
        qualifications: jobData.qualifications || '',
        job_location: jobData.job_location || 'Remote',
        job_type: jobData.job_type || 'Full-time',
        status: 'Open',
        salary_range_min: jobData.salary_range_min || null,
        salary_range_max: jobData.salary_range_max || null,
        currency: jobData.currency || 'EGP',
        application_deadline: jobData.application_deadline || null
      };

      console.log('Sending job data:', formattedData); // Debug log

      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      const data = await response.json();
      
      // Log the response for debugging
      console.log('Server response:', data);

      if (!response.ok) {
        // Include more detailed error information
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Failed to post job',
          errors: data.errors || {}
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error in postJob:', error);
      return rejectWithValue({
        message: error.message || 'Network error occurred',
        errors: {}
      });
    }
  }
);

export const fetchJobs = createAsyncThunk(
  'jobPost/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Failed to fetch jobs'
        });
      }

      return data; // Expected to be an array of jobs
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Network error occurred'
      });
    }
  }
);

export const fetchEmployerJobs = createAsyncThunk(
  'jobPost/fetchEmployerJobs',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await fetch(`${API_BASE_URL}/employer/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Failed to fetch employer jobs'
        });
      }
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Network error occurred'
      });
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobPost/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Failed to delete job'
        });
      }

      return jobId; // هنستخدمه عشان نحدث الحالة في الواجهة
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Network error occurred'
      });
    }
  }
);


export const editJob = createAsyncThunk(
  'jobPost/editJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(jobData)
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Failed to edit job'
        });
      }
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Network error occurred'
      });
    }
  }
);

export const restoreJob = createAsyncThunk(
  'jobPost/restoreJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue({
          status: response.status,
          message: data.message || 'Failed to restore job'
        });
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Network error occurred'
      });
    }
  }
);

// fetchJobById thunk for fetching a single job by id
export const fetchJobById = createAsyncThunk(
  'jobPost/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('📦 Status:', response.status);
      console.log('📦 Headers:', response.headers.get("content-type"));

      const text = await response.text(); // بدل json مؤقتاً
      console.log('📦 Raw Response:', text);

      // حاولي تحوّلي لـ JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error('❌ JSON Parse Error:', jsonErr);
        return rejectWithValue({ message: 'Invalid JSON response', raw: text });
      }

      if (!response.ok) {
        return rejectWithValue({ message: data.message || 'Failed to fetch job' });
      }

      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      return rejectWithValue({ message: error.message });
    }
  }
);


const jobPostSlice = createSlice({
  name: 'jobPost',
  initialState: {
    loading: false,
    error: null,
    success: false,
     jobs: [],
       jobDetails: null,
  },
  reducers: {
    resetJobState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postJob.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(fetchJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
  .addCase(fetchJobs.fulfilled, (state, action) => {
  state.loading = false;

  const payload = action.payload;

  if (Array.isArray(payload)) {
    state.jobs = payload;
  } else if (Array.isArray(payload.jobs)) {
    state.jobs = payload.jobs;
  } else if (Array.isArray(payload.data)) {
    state.jobs = payload.data;
  } else {

    state.jobs = [];
  }
})
    .addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchEmployerJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
      state.loading = false;
      const payload = action.payload;
      if (Array.isArray(payload)) {
        state.jobs = payload;
      } else if (Array.isArray(payload.jobs)) {
        state.jobs = payload.jobs;
      } else if (Array.isArray(payload.data)) {
        state.jobs = payload.data;
      } else {
        state.jobs = [];
      }
    })
    .addCase(fetchEmployerJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(deleteJob.fulfilled, (state, action) => {
  state.jobs = state.jobs.map(job =>
    job.id === action.payload
      ? { ...job, deleted_at: new Date().toISOString() }
      : job
  );
})

    .addCase(editJob.fulfilled, (state, action) => {
      state.jobs = state.jobs.map(job =>
        job.id === action.payload.id ? action.payload : job
      );
    })
    .addCase(restoreJob.fulfilled, (state, action) => {
      // Replace the restored job in the jobs array
      state.jobs = state.jobs.map(job =>
        job.id === action.payload.id ? action.payload : job
      );
    })
      .addCase(fetchJobById.fulfilled, (state, action) => {
  state.loading = false; // ✅ لازم تنهي اللودينج
  state.jobDetails = action.payload.data;
})

    .addCase(fetchJobById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchJobById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

  },
});

export const { resetJobState } = jobPostSlice.actions;
export default jobPostSlice.reducer;

