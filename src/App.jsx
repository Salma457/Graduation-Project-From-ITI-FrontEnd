import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import store from './store.js';
import './App.css';
import viteLogo from '../public/vite.svg';
// Auth & User
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
// Employer
import PostJob from './pages/Employer/pages/PostJob.jsx';
import JobList from './pages/Employer/pages/DisplayJob';
import TrashPage from './pages/Employer/pages/TrashPage';
import JobDetails from './pages/Employer/pages/JobDetails';
import JobApplications from './pages/Employer/pages/JobApplications';
import ChatApp from './pages/Employer/pages/ChatApp';
// Admin
import adminRoutes from './pages/admin/adminRoutes.jsx';
// Posts
import PostsList from './Posts/components/posts/PostList.jsx';
// Public/Jobseeker
import JobsPage from './pages/JobsPage.jsx';
import JobDetailsPublic from './pages/JobDetails.jsx';
import ApplyForm from './pages/ApplyForm.jsx';
import MyApplications from './pages/MyApplications.jsx';
import ProposalDetails from './pages/ProposalDetails.jsx';
// Profiles
import CreateEmployerProfile from './pages/CreateEmployerProfile';
import EmployerProfile from './pages/EmployerProfile.jsx';
import CreateItianProfile from './pages/CreateItianProfile';
import ItianProfile from './pages/ItianProfile.jsx';
import ViewItianProfile from './pages/ViewItianProfile';
import ViewEmployerProfile from './pages/ViewEmployerProfile.jsx';
import { fetchItianProfile } from './store/itianProfileSlice';
import { fetchEmployerProfile } from './store/employerProfileSlice';

function App() {
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      if (user.role === 'ITIAN') {
        dispatch(fetchItianProfile(user.id));
      } else if (user.role === 'EMPLOYER') {
        dispatch(fetchEmployerProfile(user.id));
      }
    }
  }, [user, dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{height: 80, margin: '2rem auto', display: 'block'}} /><h1>Home Page</h1></div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {adminRoutes}
          {/* Employer routes */}
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/jobs" element={<JobList />} />
          <Route path="/employer/trash" element={<TrashPage />} />
          <Route path="/employer/job/:id" element={<JobDetails />} />
          <Route path="/employer/job/:id/applications" element={<JobApplications />} />
          <Route path="/mychat" element={<ChatApp />} />
          {/* Posts */}
          <Route path="/posts" element={<PostsList />} />
          {/* Public job seeker routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPublic />} />
          <Route path="/apply/:id" element={<ApplyForm />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/my-applications/:id" element={<ProposalDetails />} />
          {/* Profile routes */}
          <Route path="/create-employer-profile" element={<CreateEmployerProfile />} />
          <Route path="/employer-profile" element={<EmployerProfile />} />
          <Route path="/employer-public-profile/:username" element={<ViewEmployerProfile />} />
          <Route path="/employer-profiles/:userId" element={<ViewEmployerProfile />} />
          <Route path="/create-itian-profile" element={<CreateItianProfile />} />
          <Route path="/itian-profile" element={<ItianProfile />} />
          <Route path="/employer-profile/:userId" element={<ViewEmployerProfile />} />
          <Route path="/itian-profile/:userId" element={<ViewItianProfile />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
