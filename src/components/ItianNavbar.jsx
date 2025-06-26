import { Link } from "react-router-dom";
import { useState } from "react";
import {  FaUser,FaBriefcase, FaFileAlt, FaBars, FaTimes, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
import "../css/Navbar.css";
import Notifications from "./Notification";
import MessageNotification from "./MessageNotification";
function ItianNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleJobsDropdown = () => setJobsDropdownOpen(!jobsDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo-container">
          <img src="public/logo.png" alt="Logo" className="logo-img " />
          <div className="logo-text">
            <Link to="/">ITIAN</Link>
          </div>
        </div>

        <div className={`menu ${isOpen ? "open" : ""}`}>
          <Link to="/posts" className="nav-link">
            <FaFileAlt className="nav-icon" /> Posts
          </Link>
          <Link to="/itian-profile" className="nav-link">
            <FaUser className="nav-icon" /> My Profile
          </Link>
          
          <Link to="/itian/mychat" className="nav-link">
            <MessageNotification iconClassName="nav-icon" /> Chat
          </Link>
          
      
              <div className={`dropdown ${jobsDropdownOpen ? "open" : ""}`} onClick={toggleJobsDropdown}>
                <button className="dropbtn">
                  <FaBriefcase className="nav-icon" /> Jobs
                </button>
                <div className="dropdown-content">
                  <Link to="/jobs">
                    <FaFileAlt className="dropdown-icon" /> All Jobs
                  </Link>
                  <Link to="/my-applications">
                    <FaFileAlt className="dropdown-icon" /> My Applications
                  </Link>
                </div>
              </div>


              {/* New Reports Dropdown */}
              <div className={`dropdown ${dropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
                <button className="dropbtn">
                  <FaExclamationTriangle className="nav-icon" /> Reports
                </button>
                <div className="dropdown-content">
                  <Link to="/reports/create"><FaFileAlt className="dropdown-icon" /> Create Report</Link>
                  <Link to="/my-reports"><FaFileAlt className="dropdown-icon" /> My Reports</Link>
                </div>
              </div>

              <div className="notification-wrapper">
                <Notifications />
              </div>

              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" /> Logout
              </button>

        </div>

        <button className="toggle-btn" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
      <div className="navbar-spacer"></div>
    </>
  );
}

export default ItianNavbar;