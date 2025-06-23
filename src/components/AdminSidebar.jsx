import { Link } from 'react-router-dom';

import "../css/Navbar.css";

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Admin Menu</h2>
      </div>
      
      <nav className="admin-sidebar-nav">
        <Link to="/admin/approvals" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">✅</span>
          <span>Approvals</span>
        </Link>
        
        <Link to="/admin/posts" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">📝</span>
          <span>Posts</span>
        </Link>
        
        <Link to="/admin/users" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">👥</span>
          <span>Users</span>
        </Link>
        
        <Link to="/admin/jobs" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">💼</span>
          <span>Jobs</span>
        </Link>
        
        <Link to="/admin/reports" className="admin-sidebar-link">
          <span className="admin-sidebar-icon">📊</span>
          <span>Reports</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;