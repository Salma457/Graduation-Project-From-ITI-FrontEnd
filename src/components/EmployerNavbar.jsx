import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBell, FaUser, FaBriefcase, FaSignOutAlt, FaBars, FaTimes, FaFileAlt } from "react-icons/fa";
import "../css/Navbar.css";

function EmployerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleNotifications = () => setNotificationOpen(!notificationOpen);

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
          <div className={`dropdown ${dropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
            <button className="dropbtn">
              <FaBriefcase className="nav-icon" /> Jobs
            </button>
            <div className="dropdown-content">
              <Link to="/payment"><FaFileAlt className="dropdown-icon" /> Post New Job</Link>
              <Link to="/employer/jobs"><FaFileAlt className="dropdown-icon" /> My Jobs</Link>
            </div>
          </div>

          <Link to="/employer-profile" className="nav-link">
            <FaUser className="nav-icon" /> My Profile
          </Link>
          
          <div className="notification-wrapper">
            <div className="notification-icon" onClick={toggleNotifications}>
              <FaBell />
              <span className="notification-badge">3</span>
            </div>
            {notificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-item">New application received</div>
                <div className="notification-item">Candidate accepted your offer</div>
                <div className="notification-item">New message from candidate</div>
                <Link to="/employer/notifications" className="view-all">View All Notifications</Link>
              </div>
            )}
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

export default EmployerNavbar;