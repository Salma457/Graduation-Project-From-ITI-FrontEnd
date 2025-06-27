import { Link } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaBell, FaUser, FaBriefcase, FaSignOutAlt, FaBars, FaTimes, FaFileAlt, FaChartBar } from "react-icons/fa";
import "../css/Navbar.css";
import Notifications from './Notification';
import MessageNotification from './MessageNotification';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../contexts/TranslationContext';

function EmployerNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  
  const { t } = useTranslation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleReportsDropdown = () => setReportsDropdownOpen(!reportsDropdownOpen);

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
           <Link to="/employer" className="nav-link">
              <FaHome className="nav-icon" /> {t('navbar.home') || 'Home'}
            </Link>
           <Link to="/employer-profile" className="nav-link">
            <FaUser className="nav-icon" /> {t('navbar.profile') || 'My Profile'}
          </Link>
          
          <Link to="/employer/mychat" className="nav-link">
            <MessageNotification iconClassName="nav-icon" /> {t('navbar.chat') || 'Chat'}
          </Link>
          
          <div className={`dropdown ${dropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
            <button className="dropbtn">
              <FaBriefcase className="nav-icon" /> {t('navbar.jobs') || 'Jobs'}
            </button>
            <div className="dropdown-content">
              <Link to="/payment"><FaFileAlt className="dropdown-icon" /> {t('navbar.postJob') || 'Post New Job'}</Link>
              <Link to="/employer/jobs"><FaFileAlt className="dropdown-icon" /> {t('navbar.myJobs') || 'My Jobs'}</Link>
            </div>
          </div>

          <div className={`dropdown ${reportsDropdownOpen ? "open" : ""}`} onClick={toggleReportsDropdown}>
            <button className="dropbtn">
              <FaChartBar className="nav-icon" /> {t('navbar.reports') || 'Reports'}
            </button>
            <div className="dropdown-content">
              <Link to="/employer/reports/create"><FaFileAlt className="dropdown-icon" /> {t('navbar.createReport') || 'Create Report'}</Link>
              <Link to="/employer/my-reports"><FaFileAlt className="dropdown-icon" /> {t('navbar.myReports') || 'My Reports'}</Link>
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

export default EmployerNavbar;