import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/jobsSlice';
import axios from 'axios';
import LoaderOverlay from '../../components/LoaderOverlay';
import JobDetailsModal from './JobDetailsModal';
import StatCard from '../../components/StatCard';
import Pagination from '../../components/Pagination';
import { BriefcaseIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const Jobs = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state) => state.jobs.jobs);
  const loading = useSelector((state) => state.jobs.loading);

  // Filter state
  const [statusFilters, setStatusFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [typeFilters, setTypeFilters] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  // Unique values for filters
  const allStatuses = Array.from(new Set(jobsArray.map(j => j.status)));
  const allLocations = Array.from(new Set(jobsArray.map(j => j.job_location)));
  const allTypes = Array.from(new Set(jobsArray.map(j => j.job_type)));

  // Job statistics
  const totalJobs = jobsArray.length;
  const openJobs = jobsArray.filter(j => j.status === 'Open').length;
  const closedJobs = jobsArray.filter(j => j.status === 'Closed').length;
  const pendingJobs = jobsArray.filter(j => j.status === 'Pending').length;

  // Filtering logic
  const filteredJobs = jobsArray.filter(job => {
    const statusMatch = statusFilters.length === 0 || statusFilters.includes(job.status);
    const locationMatch = locationFilters.length === 0 || locationFilters.includes(job.job_location);
    const typeMatch = typeFilters.length === 0 || typeFilters.includes(job.job_type);
    return statusMatch && locationMatch && typeMatch;
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilters, locationFilters, typeFilters]);

  // Paginate filtered jobs
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Checkbox change handlers
  const handleCheckboxChange = (filter, value, setFilter) => {
    setFilter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard label="Total Jobs" value={totalJobs} icon={<BriefcaseIcon className="w-7 h-7" />} />
        <StatCard label="Open Jobs" value={openJobs} icon={<CheckCircleIcon className="w-7 h-7" />} color="bg-green-100" textColor="text-green-700" />
        <StatCard label="Closed Jobs" value={closedJobs} icon={<ClockIcon className="w-7 h-7" />} color="bg-gray-100" textColor="text-gray-700" />
        <StatCard label="Pending Jobs" value={pendingJobs} icon={<ClockIcon className="w-7 h-7" />} color="bg-yellow-100" textColor="text-yellow-700" />
      </div>
      {loading && <LoaderOverlay text="Loading jobs..." />}
      {!loading && (
        <>
          
          {/* Filter Sidebar */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="md:w-1/5 w-full bg-white rounded-lg shadow p-4 flex flex-col gap-4 border border-gray-200">
              <div>
                <div className="font-semibold text-red-700 mb-2">Status</div>
                {allStatuses.map(status => (
                  <label key={status} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(status)}
                      onChange={() => handleCheckboxChange(statusFilters, status, setStatusFilters)}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
              <div>
                <div className="font-semibold text-red-700 mb-2 mt-4">Location</div>
                {allLocations.map(location => (
                  <label key={location} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={locationFilters.includes(location)}
                      onChange={() => handleCheckboxChange(locationFilters, location, setLocationFilters)}
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
              <div>
                <div className="font-semibold text-red-700 mb-2 mt-4">Type</div>
                {allTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={typeFilters.includes(type)}
                      onChange={() => handleCheckboxChange(typeFilters, type, setTypeFilters)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedJobs.length > 0 ? paginatedJobs.map((job) => (
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
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition w-full"
                        onClick={() => setSelectedJobId(job.id)}
                      >
                        View
                      </button>
                      <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition w-full">Delete</button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-gray-500">No jobs found.</div>
                )}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
            </div>
          </div>
          {selectedJobId && (
            <JobDetailsModal jobId={selectedJobId} onClose={() => setSelectedJobId(null)} />
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
