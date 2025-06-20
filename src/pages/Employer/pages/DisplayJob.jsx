import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployerJobs, editJob, deleteJob } from '../jobPostSlice';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../style/jobList.css';

const JobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector(state => state.jobPost);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchEmployerJobs());
  }, [dispatch]);

  const jobsArray = Array.isArray(jobs) ? jobs : [];

  // Only show jobs that are NOT trashed (deleted_at is null)
  const filteredJobs = jobsArray.filter(job => !job.deleted_at).filter(job => {
    // Filter by status
    const statusMatch = filter === 'all' || job.status === filter;
    // Filter by search term
    const searchMatch = job.job_title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return statusMatch && searchMatch;
  }).sort((a, b) => {
    // Sort jobs
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || b.posted_date) - new Date(a.created_at || a.posted_date);
      case 'oldest':
        return new Date(a.created_at || a.posted_date) - new Date(b.created_at || b.posted_date);
      case 'title':
        return (a.job_title || '').localeCompare(b.job_title || '');
      default:
        return 0;
    }
  });

  const handleEdit = (job) => {
    setEditData({
      ...job,
      job_title: job.job_title || '',
      description: job.description || '',
      requirements: job.requirements || '',
      qualifications: job.qualifications || '',
      job_location: job.job_location || 'Remote',
      job_type: job.job_type || 'Full-time',
      salary_range_min: job.salary_range_min || '',
      salary_range_max: job.salary_range_max || '',
      currency: job.currency || 'EGP',
      application_deadline: job.application_deadline || ''
    });
    setModalIsOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(editJob({ jobId: editData.id, jobData: editData }));
    setModalIsOpen(false);
  };

  const handleDelete = (jobId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This job will be moved to trash and deleted after 2 days.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, move to trash!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteJob(jobId));
        Swal.fire('Moved!', 'The job is now in trash.', 'success');
      }
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getJobInitials = (title) => {
    return title ? title.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() : 'JB';
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin animation-delay-150"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
        </div>
        <p className="ml-6 text-gray-800 text-xl font-medium animate-pulse">Loading job details...</p>
    </div>
  );

  if (error) return (
    <div className="job-list-container">
      <div className="job-list-error">
        <svg className="job-list-error-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <p>Error: {error.message}</p>
      </div>
    </div>
  );

  return (
    <div className="job-list-container">
      <div className="job-list-header">
        <h1 className="job-list-title">Job Listings</h1>
        <div className="job-count">{filteredJobs.length} jobs found</div>
        <button
          className="go-to-trash-btn"
          style={{ marginLeft: '16px', background: '#991b1b', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/employer/trash')}
        >
          Go to Trash
        </button>
      </div>

      <div className="job-list-filters">
        <div className="filter-row">
          <div className="search-filter">
            <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <div className="status-filter">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <div className="sort-filter">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="job-list-empty">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Edit Job"
            ariaHideApp={false}
            className="edit-job-modal"
            overlayClassName="edit-job-modal-overlay"
          >
            {editData && (
              <form onSubmit={handleEditSubmit} className="edit-job-form">
                <h2 className="edit-job-title">Edit Job</h2>
                <div className="edit-job-field">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={editData.job_title}
                    onChange={e => setEditData({ ...editData, job_title: e.target.value })}
                    placeholder="Job Title"
                    required
                  />
                </div>
                <div className="edit-job-field">
                  <label>Description</label>
                  <textarea
                    value={editData.description}
                    onChange={e => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="edit-job-field">
                  <label>Requirements</label>
                  <textarea
                    value={editData.requirements}
                    onChange={e => setEditData({ ...editData, requirements: e.target.value })}
                    placeholder="Requirements"
                  />
                </div>
                <div className="edit-job-field">
                  <label>Qualifications</label>
                  <textarea
                    value={editData.qualifications}
                    onChange={e => setEditData({ ...editData, qualifications: e.target.value })}
                    placeholder="Qualifications"
                  />
                </div>
                <div className="edit-job-field">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editData.job_location}
                    onChange={e => setEditData({ ...editData, job_location: e.target.value })}
                    placeholder="Location"
                  />
                </div>
                <div className="edit-job-field">
                  <label>Job Type</label>
                  <select
                    value={editData.job_type}
                    onChange={e => setEditData({ ...editData, job_type: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="edit-job-field">
                  <label>Status</label>
                  <select
                    value={editData.status}
                    onChange={e => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="edit-job-field">
                  <label>Minimum Salary</label>
                  <input
                    type="number"
                    value={editData.salary_range_min}
                    onChange={e => setEditData({ ...editData, salary_range_min: e.target.value })}
                    placeholder="Min Salary"
                  />
                </div>
                <div className="edit-job-field">
                  <label>Maximum Salary</label>
                  <input
                    type="number"
                    value={editData.salary_range_max}
                    onChange={e => setEditData({ ...editData, salary_range_max: e.target.value })}
                    placeholder="Max Salary"
                  />
                </div>
                <div className="edit-job-field">
                  <label>Currency</label>
                  <select
                    value={editData.currency}
                    onChange={e => setEditData({ ...editData, currency: e.target.value })}
                  >
                    <option value="EGP">EGP</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div className="edit-job-field">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    value={editData.application_deadline}
                    onChange={e => setEditData({ ...editData, application_deadline: e.target.value })}
                  />
                </div>
                <div className="edit-job-actions">
                  <button type="submit" className="edit-job-save">Save Changes</button>
                  <button type="button" className="edit-job-cancel" onClick={() => setModalIsOpen(false)}>Cancel</button>
                </div>
              </form>
            )}
          </Modal>
          
          <div className="job-list-grid">
            {filteredJobs.map(job => (
              <div className="job-card" key={job.id}>
                <div className="job-card-header">
                  <div className="job-avatar">
                    <div className="avatar-circle">
                      {getJobInitials(job.job_title)}
                    </div>
                  </div>
                  <div className="job-info">
                    <h3 className="job-title">{job.job_title || "No Title"}</h3>
                    <div className="job-location">{job.job_location || "Remote"}</div>
                    <div className="job-posted-time">
                      {formatTimeAgo(job.created_at || job.posted_date)}
                    </div>
                  </div>
                  <div className="job-actions">
                    <button className="action-btn view-btn" onClick={() => navigate(`/employer/job/${job.id}`)}>
                      View
                    </button>
                  </div>
                </div>
                
                <div className="job-card-details">
                  <div className="job-meta">
                    <div className="meta-item">
                      <span className="meta-label">Company Type:</span>
                      <span className="meta-value">{job.company_name || "IT Industry"}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Year founded:</span>
                      <span className="meta-value">{job.job_type || "2019"}</span>
                    </div>
                  </div>
                  
                  <div className="job-status-badge">
                    <span className={`status-badge ${job.status?.toLowerCase() || 'open'}`}>
                      {job.status || 'Open'}
                    </span>
                  </div>
                </div>
                
                <div className="job-card-footer">
                  <div className="job-salary">
                    {job.salary_range_min || job.salary_range_max 
                      ? `${job.salary_range_min || ''}${job.salary_range_min && job.salary_range_max ? ' - ' : ''}${job.salary_range_max || ''} ${job.currency || ''}`
                      : "Salary not disclosed"}
                  </div>
                  <div className="job-footer-actions">
                    <button className="edit-btn" onClick={() => handleEdit(job)}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(job.id)}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v.007a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5V5zM5.5 7.5a.5.5 0 01.5.5v8a2 2 0 002 2h4a2 2 0 002-2V8a.5.5 0 011 0v8a3 3 0 01-3 3H8a3 3 0 01-3-3V8a.5.5 0 01.5-.5z" clipRule="evenodd"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;