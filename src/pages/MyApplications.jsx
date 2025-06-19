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
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('cover_letter', formData.cover_letter);
    formDataToSend.append('_method', 'PUT'); // Laravel method spoofing

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
    setTimeout(() => {
      closeModal();
      setApplications(applications.map(app =>
        app.id === selectedApplication.id ? response.data.data : app
      ));
    }, 1500);
  } catch (error) {
    console.error('Error updating application:', error);
    console.error('Validation Errors:', error.response?.data?.errors); // ✅ هنا مكانه الصح

    if (error.response?.data?.errors) {
      setSubmitError(
        Object.values(error.response.data.errors).flat().join('\n') ||
        'Please fix the form errors'
      );
    } else {
      setSubmitError(error.response?.data?.message ||
        'Failed to update application. Please try again.');
    }
  } finally {
    setSubmitting(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) {
      return;
    }

    try {
      const token = localStorage.getItem('access-token');
      if (!token) {
        setError('Please login to delete your application');
        return;
      }

      await axios.delete(`http://localhost:8000/api/job-application/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
      setError('Failed to delete application. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-600 text-lg">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="my-applications-container">
      <div className="applications-header">
        <h1 className="text-3xl font-bold text-red-900">My Job Applications</h1>
        <p className="text-gray-600 mt-2">View and manage your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications text-center py-10">
          <p className="text-lg text-gray-700">You haven't applied to any jobs yet.</p>
          <Link 
            to="/jobs" 
            className="mt-4 inline-block px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map(application => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <h2 className="text-xl font-semibold text-red-900">
                  <Link to={`/jobs/${application.job.id}`}>{application.job.job_title}</Link>
                </h2>
                <span className={`status-badge ${application.status}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="application-details">
                <div className="detail-item">
                  <span className="detail-label">Company:</span>
                  <span className="detail-value">{application.job.employer?.name || 'Unknown'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Applied On:</span>
                  <span className="detail-value">
                    {new Date(application.application_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Cover Letter:</span>
                  <p className="detail-value cover-letter-preview">
                    {application.cover_letter.substring(0, 100)}...
                  </p>
                </div>
              </div>
              
              <div className="application-actions">
                <button 
                  onClick={() => handleEdit(application)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(application.id)}
                  className="delete-btn"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Application Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white w-full max-w-2xl mx-auto mt-24 rounded-xl shadow-xl p-8 z-50 relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-red-900">
            Edit Application for {selectedApplication?.job.job_title}
          </h2>
          <button onClick={closeModal} className="text-3xl font-bold text-gray-600 hover:text-red-600">
            &times;
          </button>
        </div>

        {submitSuccess ? (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-600">Application Updated!</h3>
            <p className="mt-2 text-gray-700">Your changes have been saved.</p>
            <button 
              onClick={closeModal} 
              className="mt-4 px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label htmlFor="cover_letter" className="block font-semibold text-red-900 mb-1">
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
                className="w-full border border-red-300 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label htmlFor="cv" className="block font-semibold text-red-900 mb-1">
                Update CV (Optional)
              </label>
              <input
                type="file"
                id="cv"
                name="cv"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full border border-red-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-800 hover:file:bg-red-200"
              />
              {selectedApplication?.cv && (
                <p className="mt-2 text-sm text-gray-600">
                  Current CV: <a 
                    href={`http://localhost:8000/storage/${selectedApplication.cv}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-700 hover:underline"
                  >
                    View CV
                  </a>
                </p>
              )}
            </div>

            {submitError && <p className="text-red-600 font-medium">{submitError}</p>}

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2 border border-red-800 text-red-800 rounded-lg hover:bg-red-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
              >
                {submitting ? 'Updating...' : 'Update Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MyApplications;