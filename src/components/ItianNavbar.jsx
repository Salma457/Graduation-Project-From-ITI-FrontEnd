import { Link } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaUser, FaBriefcase, FaFileAlt, FaBars, FaTimes, FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";
import "../css/Navbar.css";
import Notifications from "./Notification";
import MessageNotification from "./MessageNotification";
import LanguageSwitcher from './LanguageSwitcher'; // إضافة المكون
import { useTranslation } from '../contexts/TranslationContext'; // إضافة الهوك

function ItianNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  
  // إضافة الترجمة
  const { t } = useTranslation();

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
          <Link to="/itian" className="nav-link">
            <FaHome className="nav-icon" /> {t('navbar.home') || 'Home'}
          </Link>
          <Link to="/posts" className="nav-link">
            <FaFileAlt className="nav-icon" /> {t('navbar.posts') || 'Posts'}
          </Link>
          <Link to="/itian-profile" className="nav-link">
            <FaUser className="nav-icon" /> {t('navbar.profile') || 'My Profile'}
          </Link>
          
          <Link to="/itian/mychat" className="nav-link">
            <MessageNotification iconClassName="nav-icon" /> {t('navbar.chat') || 'Chat'}
          </Link>
          
          <div className={`dropdown ${jobsDropdownOpen ? "open" : ""}`} onClick={toggleJobsDropdown}>
            <button className="dropbtn">
              <FaBriefcase className="nav-icon" /> {t('navbar.jobs') || 'Jobs'}
            </button>
            <div className="dropdown-content">
              <Link to="/jobs">
                <FaFileAlt className="dropdown-icon" /> {t('navbar.allJobs') || 'All Jobs'}
              </Link>
              <Link to="/my-applications">
                <FaFileAlt className="dropdown-icon" /> {t('navbar.myApplications') || 'My Applications'}
              </Link>
            </div>
          </div>

          {/* New Reports Dropdown */}
          <div className={`dropdown ${dropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
            <button className="dropbtn">
              <FaExclamationTriangle className="nav-icon" /> {t('navbar.reports') || 'Reports'}
            </button>
            <div className="dropdown-content">
              <Link to="/itian/reports/create"><FaFileAlt className="dropdown-icon" /> {t('navbar.createReport') || 'Create Report'}</Link>
              <Link to="/itian/my-reports"><FaFileAlt className="dropdown-icon" /> {t('navbar.myReports') || 'My Reports'}</Link>
            </div>
          </div>

          <div className="notification-wrapper">
            <Notifications />
          </div>

          {/* إضافة Language Switcher */}
          <div className="language-switcher-wrapper">
            <LanguageSwitcher className="navbar-language-switcher" />
          </div>

          <button className="nav-link logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" /> {t('navbar.logout') || 'Logout'}
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