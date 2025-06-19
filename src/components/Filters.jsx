import "../css/Filters.css";

const Filters = () => {
  return (
    <div className="filters-container">
      <div className="filter-group">
        <label>Profession</label>
        <input
          type="text"
          placeholder="Search for required Profession...."
          className="filter-input"
        />
      </div>
      
      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="Search by Location"
          className="filter-input"
        />
      </div>
      
      <div className="filter-group">
        <label>Availability</label>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input type="checkbox" />
            Work From Home
          </label>
          <label className="checkbox-label">
            <input type="checkbox" />
            On-Site
          </label>
        </div>
      </div>
      
      <div className="filter-group">
        <label>Stipend - minimum monthly stipend</label>
        <div className="stipend-slider">
          <input type="range" min="0" max="10000" step="1000" />
          <div className="stipend-labels">
            <span>0</span>
            <span>2K</span>
            <span>4K</span>
            <span>6K</span>
            <span>8K</span>
            <span>10K</span>
            <span>10K+</span>
          </div>
        </div>
      </div>
      
      <div className="filter-group">
        <label>Max Duration (months)</label>
        <input
          type="number"
          placeholder="Enter in number"
          className="filter-input"
        />
      </div>
      
      <div className="filter-group">
        <label className="checkbox-label">
          <input type="checkbox" />
          Internships with job Offer
        </label>
      </div>
    </div>
  );
};

export default Filters;