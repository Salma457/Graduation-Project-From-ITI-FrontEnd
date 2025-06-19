import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
// import '../css/ApplicationDetail.css';

const ApplicationDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('access-token');
        const response = await axios.get(`http://localhost:8000/api/job-application/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setApplication(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!application) return <div className="not-found">Application not found</div>;

  return (
    <div className="application-detail-container">
      <div className="application-header">
        <h1>Application for {application.job.job_title}</h1>
        <Link to="/my-applications" className="back-link">← Back to My Applications</Link>
      </div>

      <div className="application-content">
        <div className="application-section">
          <h3>Status</h3>
          <p className={`status ${application.status}`}>{application.status}</p>
        </div>

        <div className="application-section">
          <h3>Cover Letter</h3>
          <p className="cover-letter">{application.cover_letter}</p>
        </div>

        <div className="application-section">
          <h3>CV</h3>
          {application.cv && (
            <a 
              href={`http://localhost:8000/storage/${application.cv}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="cv-link"
            >
              View CV
            </a>
          )}
        </div>

        <div className="application-section">
          <h3>Job Details</h3>
          <p><strong>Company:</strong> {application.job.employer?.name || 'Unknown'}</p>
          <p><strong>Location:</strong> {application.job.job_location}</p>
          <p><strong>Applied On:</strong> {new Date(application.application_date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;