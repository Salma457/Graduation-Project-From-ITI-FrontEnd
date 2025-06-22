import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "../css/JobDetails.css";
import { Sparkles } from 'lucide-react'; // أو أي مكتبة الأيقونات التي تستخدمها
Modal.setAppElement('#root');

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: "",
    cv: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/jobs/${id}`);
        setJob(res.data.data);

        const token = localStorage.getItem('access-token');
        if (token) {
          const applicationRes = await axios.get(
            `http://localhost:8000/api/check-application/${id}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          setHasApplied(applicationRes.data.hasApplied);
          setApplicationId(applicationRes.data.applicationId || null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, submitSuccess]);

  const handleApply = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setFormData({
      cover_letter: "",
      cv: null
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      cv: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('access-token');
      if (!token) {
        setSubmitError('Please login to apply for this job');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('job_id', id);
      formDataToSend.append('cover_letter', formData.cover_letter);
      
      if (!formData.cv) {
        setSubmitError('CV file is required');
        return;
      }
      formDataToSend.append('cv', formData.cv);

      const response = await axios.post(
        'http://localhost:8000/api/job-application',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      setSubmitSuccess(true);
      setHasApplied(true);
      setApplicationId(response.data.data.id); 
    } catch (error) {
      console.error('Error submitting application:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          setSubmitError('Session expired. Please login again.');
        } else if (error.response.status === 403) {
          setSubmitError('You need an ITIAN profile to apply for jobs.');
        } else if (error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors.cv) {
            setSubmitError(errors.cv[0]);
          } else if (errors.cover_letter) {
            setSubmitError(errors.cover_letter[0]);
          } else {
            setSubmitError('Please fill all required fields correctly.');
          }
        } else {
          setSubmitError(error.response.data.message || 'Failed to submit application.');
        }
      } else if (error.request) {
        setSubmitError('Network error. Please check your connection.');
      } else {
        setSubmitError('Application submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const viewProposal = () => {
    if (applicationId) {
      navigate(`/my-applications/${applicationId}`);
    } else {
      console.error("Application ID not found");
      setSubmitError('Unable to view application. Please try again later.');
    }
  };

 if (loading) return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="relative">
      <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin animation-delay-150"></div>
      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
    </div>
    <p className="ml-6 text-gray-800 text-xl font-medium animate-pulse">Loading Jobs Details...</p>
  </div>
);
  
  if (!job) return <p className="text-center py-10 text-lg">Job not found</p>;

  return (
    <div className="job-details-container">
      <div className="job-card">
        <div className="job-header">
          <h1 className="job-title">{job.job_title}</h1>
          <p className="company">
            {job.employer?.name || "Unknown"} • {job.job_location}
          </p>
        </div>

        <div className="job-meta">
          <div className="job-tags">
            <span className="job-type">{job.job_type}</span>
            <span className="work-type">
              
              {job.status}
            </span>
          </div>
          
        </div>

        <div className="job-content">
          <div className="job-section">
            <h3>Description</h3>
            <p>{job.description || "No description provided"}</p>
          </div>

          <div className="job-section">
            <h3>Requirements</h3>
            <p>{job.requirements || "No requirements"}</p>
          </div>

          <div className="job-section">
            <h3>Qualifications</h3>
            <p>{job.qualifications || "No qualifications"}</p>
          </div>
        </div>

        <div className="job-footer">
          <Link to="/jobs" className="back-link">
            ← Back to jobs
          </Link>
          {hasApplied ? (
  <button onClick={viewProposal} className="view-proposal-btn">
    View My Proposal
  </button>
) : (
  <button onClick={handleApply} className="apply-btn">
    Apply Now
  </button>
)}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="application-modal"
        overlayClassName="application-modal-overlay"
      >
        <div className="application-modal-header">
          <h2 className="application-modal-title">Apply for {job.job_title}</h2>
          <button onClick={closeModal} className="application-modal-close">
            &times;
          </button>
        </div>

        {submitSuccess ? (
          <div className="application-success-message">
            <h3 className="application-success-title">Application Submitted!</h3>
            <p className="application-success-text">
              The employer will contact you if you're shortlisted.
            </p>
            <button 
              onClick={closeModal} 
              className="application-modal-close-btn"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="application-form">
            <div className="application-form-group">
              <label htmlFor="cover_letter" className="application-form-label">
                Cover Letter
              </label>
              <textarea
                id="cover_letter"
                name="cover_letter"
                rows="5"
                value={formData.cover_letter}
                onChange={handleInputChange}
                required
                placeholder="Write your cover letter here..."
                className="application-form-textarea"
              />
            </div>

            <div className="application-form-group">
              <label htmlFor="cv" className="application-form-label">
                Upload CV
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="application-form-file"
              />
            </div>

            {submitError && <p className="application-form-error">{submitError}</p>}

            <div className="application-form-actions">
              <button
                type="button"
                onClick={closeModal}
                className="application-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="application-submit-btn"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default JobDetails;