import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import "../css/JobDetails.css";
// Make sure to bind modal to your appElement
Modal.setAppElement('#root');

const JobDetails = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/jobs/${id}`);
        setJob(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

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
    // التحقق من وجود token
    const token = localStorage.getItem('access-token');
    if (!token) {
      setSubmitError('Please login to apply for this job');
      return;
    }

    // إعداد FormData
    const formDataToSend = new FormData();
    formDataToSend.append('job_id', id);
    formDataToSend.append('cover_letter', formData.cover_letter);
    
    if (!formData.cv) {
      setSubmitError('CV file is required');
      return;
    }
    formDataToSend.append('cv', formData.cv);

    // إرسال الطلب
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
  } catch (error) {
    console.error('Error submitting application:', error);
    
    if (error.response) {
      // خطأ من الخادم
      if (error.response.status === 401) {
        setSubmitError('Session expired. Please login again.');
      } else if (error.response.status === 403) {
        setSubmitError('You need an ITIAN profile to apply for jobs.');
      } else if (error.response.status === 422) {
        // أخطاء التحقق من الصحة
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
      // لم يتم استلام رد من الخادم
      setSubmitError('Network error. Please check your connection.');
    } else {
      // خطأ في إعداد الطلب
      setSubmitError('Application submission failed. Please try again.');
    }
  } finally {
    setSubmitting(false);
  }
};
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!job) return <p className="error-message">Job not found</p>;

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
              <span className="wfh-icon">🏢</span>
              {job.status}
            </span>
          </div>
          <p className="posted-time">
            Posted on {new Date(job.posted_date).toLocaleDateString()}
          </p>
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
          <button onClick={handleApply} className="apply-btn">
            Apply Now
          </button>
        </div>
      </div>

      {/* Application Modal */}
    <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  className="bg-white w-full max-w-2xl mx-auto mt-24 rounded-xl shadow-xl p-8 z-50 relative"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-y-auto"
>
  <div className="flex justify-between items-center border-b pb-4 mb-6">
    <h2 className="text-2xl font-bold text-red-900">Apply for {job.job_title}</h2>
    <button onClick={closeModal} className="text-3xl font-bold text-gray-600 hover:text-red-600">&times;</button>
  </div>

  {submitSuccess ? (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-green-600">Application Submitted!</h3>
      <p className="mt-2 text-gray-700">The employer will contact you if you're shortlisted.</p>
      <button onClick={closeModal} className="mt-4 px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900">Close</button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          Upload CV
        </label>
        <input
          type="file"
          id="cv"
          name="cv"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
          className="w-full border border-red-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-100 file:text-red-800 hover:file:bg-red-200"
        />
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
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  )}
</Modal>



    </div>
  );
};

export default JobDetails;