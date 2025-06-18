import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postJob, resetJobState } from "../jobPostSlice";
import { useNavigate } from "react-router-dom";
import "../style/JobPostingForm.css"; // Import the CSS file

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.jobPost);

  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    requirements: '',
    qualifications: '',
    job_location: 'Remote',
    job_type: 'Full-time',
    salary_range_min: '',
    salary_range_max: '',
    currency: 'EGP',
    posted_date: new Date().toISOString(),
    application_deadline: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    return () => {
      dispatch(resetJobState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/employer/jobs'); // Change this path to your jobs list route
    }
  }, [success, navigate]);

  // Enhanced form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.job_title.trim()) {
      errors.job_title = 'Job title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    } else if (formData.description.length < 50) {
      errors.description = 'Description should be at least 50 characters';
    }
    
    if (formData.salary_range_min && formData.salary_range_max) {
      if (parseInt(formData.salary_range_min) >= parseInt(formData.salary_range_max)) {
        errors.salary_range_max = 'Maximum salary must be greater than minimum salary';
      }
    }
    
    if (formData.application_deadline) {
      const deadlineDate = new Date(formData.application_deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        errors.application_deadline = 'Application deadline must be in the future';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert data to proper format
    const jobData = {
      ...formData,
      posted_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      salary_range_min: formData.salary_range_min ? parseInt(formData.salary_range_min) : null,
      salary_range_max: formData.salary_range_max ? parseInt(formData.salary_range_max) : null,
    };
    
    dispatch(postJob(jobData));
  };

  const handleReset = () => {
    setFormData({
      job_title: '',
      description: '',
      requirements: '',
      qualifications: '',
      job_location: 'Remote',
      job_type: 'Full-time',
      salary_range_min: '',
      salary_range_max: '',
      currency: 'EGP',
      posted_date: new Date().toISOString(),
      application_deadline: '',
    });
    setFormErrors({});
  };

  return (
    <div className="postjob-container">
      <div className="postjob-wrapper">
        <div className="postjob-card">
          <div className="postjob-header">
            <h2 className="postjob-title">Post a New Job</h2>
            <p className="postjob-subtitle">
              Fill in the details below to create a comprehensive job posting
            </p>
          </div>

          {success && (
            <div className="postjob-alert postjob-alert-success">
              <div className="postjob-alert-icon postjob-alert-icon-success">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="postjob-alert-content">
                <p className="postjob-alert-text postjob-alert-text-success">
                  Job posted successfully! Your job listing is now live.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="postjob-alert postjob-alert-error">
              <div className="postjob-alert-icon postjob-alert-icon-error">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="postjob-alert-content">
                <p className="postjob-alert-text postjob-alert-text-error">
                  {error.message || "Error posting job. Please try again."}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="postjob-form">
            {/* Job Title */}
            <div className="postjob-field-group">
              <label className="postjob-label">
                Job Title <span className="postjob-label-required">*</span>
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                className={`postjob-input ${formErrors.job_title ? 'error' : ''}`}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
              {formErrors.job_title && (
                <span className="postjob-error-text">{formErrors.job_title}</span>
              )}
            </div>

            {/* Job Description */}
            <div className="postjob-field-group">
              <label className="postjob-label">
                Job Description <span className="postjob-label-required">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={`postjob-textarea ${formErrors.description ? 'error' : ''}`}
                placeholder="Provide a detailed description of the job role, responsibilities, and what makes this position exciting..."
                required
              />
              <div className="postjob-char-count">
                {formData.description.length} characters
              </div>
              {formErrors.description && (
                <span className="postjob-error-text">{formErrors.description}</span>
              )}
            </div>

            {/* Requirements */}
            <div className="postjob-field-group">
              <label className="postjob-label">Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="4"
                className="postjob-textarea"
                placeholder="List the essential technical skills, experience level, and must-have qualifications..."
              />
            </div>

            {/* Qualifications */}
            <div className="postjob-field-group">
              <label className="postjob-label">Preferred Qualifications</label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows="3"
                className="postjob-textarea"
                placeholder="Specify preferred qualifications, certifications, or nice-to-have skills..."
              />
            </div>

            {/* Three column grid */}
            <div className="postjob-grid postjob-grid-3">
              {/* Job Location */}
              <div className="postjob-field-group">
                <label className="postjob-label">Job Location</label>
                <select
                  name="job_location"
                  value={formData.job_location}
                  onChange={handleChange}
                  className="postjob-select"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="postjob-field-group">
                <label className="postjob-label">Job Type</label>
                <select
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  className="postjob-select"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              {/* Currency */}
              <div className="postjob-field-group">
                <label className="postjob-label">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="postjob-select"
                >
                  <option value="EGP">EGP - Egyptian Pound</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AED">AED - UAE Dirham</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="postjob-grid postjob-grid-2">
              <div className="postjob-field-group">
                <label className="postjob-label">Minimum Salary</label>
                <input
                  type="number"
                  name="salary_range_min"
                  value={formData.salary_range_min}
                  onChange={handleChange}
                  className="postjob-input"
                  placeholder="10000"
                  min="0"
                />
              </div>
              <div className="postjob-field-group">
                <label className="postjob-label">Maximum Salary</label>
                <input
                  type="number"
                  name="salary_range_max"
                  value={formData.salary_range_max}
                  onChange={handleChange}
                  className={`postjob-input ${formErrors.salary_range_max ? 'error' : ''}`}
                  placeholder="20000"
                  min="0"
                />
                {formErrors.salary_range_max && (
                  <span className="postjob-error-text">{formErrors.salary_range_max}</span>
                )}
              </div>
            </div>

            {/* Application Deadline */}
            <div className="postjob-field-group">
              <label className="postjob-label">Application Deadline</label>
              <input
                type="date"
                name="application_deadline"
                value={formData.application_deadline}
                onChange={handleChange}
                className={`postjob-input ${formErrors.application_deadline ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {formErrors.application_deadline && (
                <span className="postjob-error-text">{formErrors.application_deadline}</span>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="postjob-submit-section">
              <div className="postjob-grid postjob-grid-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="postjob-reset-button"
                  disabled={loading}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`postjob-submit-button ${
                    loading
                      ? 'postjob-submit-button-disabled'
                      : 'postjob-submit-button-active'
                  }`}
                >
                  {loading ? (
                    <div className="postjob-loading-content">
                      <svg className="postjob-loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="postjob-loading-text">Posting Job...</span>
                    </div>
                  ) : (
                    'Post Job'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;