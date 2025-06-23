import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import "../css/Navbar.css";
import logo from "../../public/logo.png"; 

function AdminNavbar() {
  const handleLogout = () => {
    localStorage.removeItem("access-token");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className="admin-navbar">

        <img src={logo} alt="Logo" className="admin-logo-img ps-3" />

        <div className="admin-navbar-container">
          <div className="admin-logo-container">
          </div>

          <div className="admin-nav-items">
            <div className="admin-user-info">
              <span className="admin-username">
                Welcome, Admin
              </span>
            </div>

            <button 
              className="admin-logout-btn" 
              onClick={handleLogout}
              aria-label="Logout"
            >
              <FaSignOutAlt className="admin-nav-icon" /> 
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <div className="admin-navbar-spacer"></div>
    </>
  );
}

export default AdminNavbar;