import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/jobsSlice';
import axios from 'axios';

const Jobs = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);



  // Update job status handler
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('access-token');
      const update_res = await axios.patch(`http://127.0.0.1:8000/api/jobs/${jobId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(update_res)
      dispatch(fetchJobs()); // Refresh jobs after update
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Failed to update job status.');
    }
  };

  // Extract jobs array from API response
  const jobsArray = jobs?.data || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Jobs</h1>
      <p className="mb-4">Approve or delete jobs before they appear for ITIANs.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsArray.length > 0 ? jobsArray.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition">
            <div>
              <h2 className="text-xl font-semibold text-red-700 mb-1">{job.job_title}</h2>
              <p className="text-gray-600 mb-2">Employer: <span className="font-medium">{job.employer?.name}</span></p>
              <p className="text-gray-500 mb-1">Location: {job.job_location}</p>
              <p className="text-gray-500 mb-1">Type: {job.job_type}</p>
              <p className="text-gray-500 mb-1">Posted: {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : ''}</p>
              <p className="text-gray-500 mb-1">Status: <span className="font-semibold">{job.status}</span></p>
              <div className="flex gap-2 mt-2">
                {['Open', 'Closed', 'Pending'].map((status) => (
                  <button
                    key={status}
                    className={`px-2 py-1 rounded text-xs font-semibold border transition ${job.status === status ? 'bg-red-600 text-white border-red-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                    disabled={job.status === status}
                    onClick={() => handleStatusChange(job.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <p className="text-gray-700 mt-2 line-clamp-3">{job.description}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition w-full">View</button>
              <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition w-full">Delete</button>
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-8 text-gray-500">No jobs found.</div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
