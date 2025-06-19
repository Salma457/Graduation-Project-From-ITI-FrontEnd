import "../css/JobCard.css";
import { Link } from "react-router-dom"; // عشان نستخدم لينك لصفحة التفاصيل

const JobCard = ({ job }) => {
  const shortDescription =
    job.description.length > 100
      ? job.description.substring(0, 100) + "..."
      : job.description;

  return (
    <div className="job-card">
      <div className="job-header">
        <h3>{job.job_title}</h3>
        <p className="company">{job.employer?.name || "Unknown Employer"}</p>
      </div>

      <div className="job-details">
        <p><span>Description:</span> {shortDescription}</p>
        <p><span>Qualifications:</span> {job.qualifications}</p>
        <p><span>Location:</span> {job.job_location}</p>
        <p><span>Job Type:</span> {job.job_type}</p>
        <p><span>Posted On:</span> {job.posted_date}</p>
      </div>

      <div className="job-footer">
        <div className="job-tags">
          {job.work_type === "Work From Home" && (
            <span className="work-type">
              <span className="wfh-icon">🏠</span> Work From Home
            </span>
          )}
        </div>
      </div>

      <div className="view-more">
        <Link to={`/jobs/${job.id}`} className="view-more-btn">
          ... View more <span className="arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
