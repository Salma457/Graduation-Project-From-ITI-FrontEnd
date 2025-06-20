import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from "./store.js";// Make sure this path matches your store location
import './App.css';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PostJob from './pages/Employer/pages/PostJob.jsx';
import  JobList from './pages/Employer/pages/DisplayJob'; // Add this import
import TrashPage from './pages/Employer/pages/TrashPage'; // Add this import
import JobDetails from './pages/Employer/pages/JobDetails';
import JobApplications from './pages/Employer/pages/JobApplications';
import ChatApp from './pages/Employer/pages/ChatApp';
import viteLogo from '../public/vite.svg';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Approvals from './pages/admin/Approvals.jsx';
import Posts from './pages/admin/Posts.jsx';
import Users from './pages/admin/Users.jsx';
import Jobs from './pages/admin/Jobs.jsx';
import Reports from './pages/admin/Reports.jsx';
import adminRoutes from './pages/admin/adminRoutes.jsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{height: 80, margin: '2rem auto', display: 'block'}} /><h1>Home Page</h1></div>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
          {adminRoutes}
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/jobs" element={< JobList />} />
          <Route path="/employer/trash" element={<TrashPage />} /> {/* Add this route */}
          <Route path="/employer/job/:id" element={<JobDetails />} />
          <Route path="/employer/job/:id/applications" element={<JobApplications />} />
          <Route path="/mychat" element={<ChatApp />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App;
