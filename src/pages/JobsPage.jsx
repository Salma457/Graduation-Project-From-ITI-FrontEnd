import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import Filters from "../components/Filters";
import axios from "axios";
import "../css/JobsPage.css";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs");
        const jobsData = Array.isArray(response.data.data) ? 
                        response.data.data : 
                        Array.isArray(response.data) ? 
                        response.data : 
                        [];
        
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        setLoading(false);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleFilter = (filters) => {
    let result = [...jobs];
    if (filters.profession) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }
    if (filters.location) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.availability) {
      result = result.filter(job => 
        job.work_type === filters.availability
      );
    }
    if (filters.stipend) {
      result = result.filter(job => 
        job.stipend >= filters.stipend
      );
    }
    if (filters.duration) {
      result = result.filter(job => 
        job.duration <= filters.duration
      );
    }
    if (filters.jobOffer) {
      result = result.filter(job => 
        job.has_job_offer === true
      );
    }
    setFilteredJobs(result);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading jobs...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div className="jobs-page">
      <div className="page-header">
        <h1 className="page-title">Search Jobs</h1>
        <div className="filters-header">
          <span className="filters-label">Filters</span>
          <button 
            className="clear-btn"
            onClick={() => setFilteredJobs(jobs)}
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="jobs-content">
        <Filters onFilter={handleFilter} />
        
        <div className="jobs-list-container">
          <div className="works-available">Works Available</div>
          <div className="jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="no-jobs">
                <div className="no-jobs-icon">😕</div>
                <p>No jobs found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;