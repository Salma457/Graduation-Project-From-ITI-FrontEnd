import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "../css/MyApplications.css";

Modal.setAppElement('#root');

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: "",
    cv: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
const [applicationToDelete, setApplicationToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('access-token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/itian/job-application', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setApplications(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to load applications");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate, submitSuccess]);

  const handleEdit = (application) => {
    setSelectedApplication(application);
    setFormData({
      cover_letter: application.cover_letter,
      cv: null
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedApplication(null);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('access-token');
      if (!token) {
        setSubmitError('Please login to update your application');
        setSubmitting(false);
        return;
      }

      if (!formData.cover_letter || formData.cover_letter.length < 100) {
        setSubmitError('Cover letter must be at least 100 characters');
        setSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('cover_letter', formData.cover_letter);
      formDataToSend.append('_method', 'PUT');

      if (formData.cv) {
        formDataToSend.append('cv', formData.cv);
      }

      const response = await axios.post(
        `http://localhost:8000/api/job-application/${selectedApplication.id}`,
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
      setTimeout(async () => {
        closeModal();
        const token = localStorage.getItem('access-token');
        try {
          const updated = await axios.get('http://localhost:8000/api/itian/job-application', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApplications(updated.data.data);
        } catch (fetchError) {
          console.error("Error fetching updated applications:", fetchError);
        }
      }, 1500);

    } catch (error) {
      console.error('Error updating application:', error);

      const validationErrors = error?.response?.data?.errors;

      if (validationErrors) {
        setSubmitError(
          Object.values(validationErrors).flat().join('\n') ||
          'Please fix the form errors'
        );
      } else {
        setSubmitError(
          error?.response?.data?.message ||
          error.message ||
          'Failed to update application. Please try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
  setApplicationToDelete(id);
  setDeleteModalIsOpen(true);
};

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('access-token');
    if (!token) {
      setError('Please login to delete your application');
      return;
    }

    await axios.delete(`http://localhost:8000/api/job-application/${applicationToDelete}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    setApplications(applications.filter(app => app.id !== applicationToDelete));
    setDeleteModalIsOpen(false);
    setApplicationToDelete(null);
  } catch (error) {
    console.error('Error deleting application:', error);
    setError('Failed to delete application. Please try again.');
    setDeleteModalIsOpen(false);
  }
};

  if (loading) return (
    <div className="application-loading-spinner">
      <div className="application-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="application-error-container">
      <p className="application-error-message">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="application-retry-btn"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="application-container">
      <div className="application-header">
        <h1 className="application-title">My Job Applications</h1>
        <p className="application-subtitle">View and manage your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="application-empty-state">
          <p className="application-empty-message">You haven't applied to any jobs yet.</p>
          <Link 
            to="/jobs" 
            className="application-browse-btn"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="application-list">
          {applications.map(application => (
            <div key={application.id} className="application-item">
              <div className="application-item-header">
                <h2 className="application-job-title">
                  <Link to={`/jobs/${application.job.id}`}>{application.job.job_title}</Link>
                </h2>
                <span className={`application-status application-status-${application.status}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="application-details">
                <div className="application-detail">
                  <span className="application-detail-label">Company:</span>
                  <span className="application-detail-value">{application.job.employer?.name || 'Unknown'}</span>
                </div>
                <div className="application-detail">
                  <span className="application-detail-label">Applied On:</span>
                  <span className="application-detail-value">
                    {new Date(application.application_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="application-detail">
                  <span className="application-detail-label">Cover Letter:</span>
                  <p className="application-cover-letter-preview">
                    {application.cover_letter.substring(0, 100)}...
                  </p>
                </div>
              </div>
              
              <div className="application-actions">
                <button 
                  onClick={() => handleEdit(application)}
                  className="application-edit-btn"
                >
                  Edit
                </button>
                <button 
  onClick={() => {
    setApplicationToDelete(application.id);
    setDeleteModalIsOpen(true);
  }}
  className="application-delete-btn"
>
  Withdraw
</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="application-modal"
        overlayClassName="application-modal-overlay"
      >
        <div className="application-modal-header">
          <h2 className="application-modal-title">
            Edit Application for {selectedApplication?.job.job_title}
          </h2>
          <button onClick={closeModal} className="application-modal-close">
            &times;
          </button>
        </div>

        {submitSuccess ? (
          <div className="application-success-message">
            <h3 className="application-success-title">Application Updated!</h3>
            <p className="application-success-text">Your changes have been saved.</p>
            <button 
              onClick={closeModal} 
              className="application-modal-close-btn"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="application-form">
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
                Update CV (Optional)
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="application-form-file"
              />
              {selectedApplication?.cv && (
                <p className="application-current-cv">
                  Current CV: <a 
                    href={`http://localhost:8000/storage/${selectedApplication.cv}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="application-cv-link"
                  >
                    View CV
                  </a>
                </p>
              )}
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
                {submitting ? 'Updating...' : 'Update Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
      {/* Delete Confirmation Modal */}
<Modal
  isOpen={deleteModalIsOpen}
  onRequestClose={() => setDeleteModalIsOpen(false)}
  className="application-modal"
  overlayClassName="application-modal-overlay"
>
  <div className="application-modal-header">
    <h2 className="application-modal-title">Confirm Withdrawal</h2>
    <button 
      onClick={() => setDeleteModalIsOpen(false)} 
      className="application-modal-close"
    >
      &times;
    </button>
  </div>

  <div className="p-4">
    <p className="text-gray-700 mb-6">Are you sure you want to withdraw this application?</p>
    
    <div className="flex justify-end gap-4">
      <button
        onClick={() => setDeleteModalIsOpen(false)}
        className="application-cancel-btn"
      >
        Cancel
      </button>
      <button
        onClick={confirmDelete}
        className="application-delete-btn"
      >
        Confirm Withdraw
      </button>
    </div>
  </div>
</Modal>
    </div>
  );
};

export default MyApplications;