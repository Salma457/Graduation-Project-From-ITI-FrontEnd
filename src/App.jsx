import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import store from './store';
import './App.css';
import viteLogo from '/vite.svg';

// Layouts
import NoLayout from './pages/layouts/NoLayout';
import ItianLayout from './pages/layouts/ItianLayout';
import EmployerLayout from './pages/layouts/EmployerLayout';
import AdminLayout from './pages/layouts/AdminLayout.jsx'; // Default import

// Redux actions
import { fetchItianProfile } from './store/itianProfileSlice';
import { fetchEmployerProfile } from './store/employerProfileSlice';

// Auth
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

// Payment
import PaymentPage from './pages/PaymentPage.jsx';

// Posts
import PostsList from './Posts/components/posts/PostList.jsx';

// Itian
import JobsPage from './pages/Itian/JobsPage.jsx';
import JobDetailsPublic from './pages/Itian/JobDetails.jsx';
import ApplyForm from './pages/Itian/ApplyForm.jsx';
import MyApplications from './pages/Itian/MyApplications.jsx';
import ProposalDetails from './pages/Itian/ProposalDetails.jsx';

// Profiles
import CreateEmployerProfile from './pages/profiles/CreateEmployerProfile';
import EmployerProfile from './pages/profiles/EmployerProfile.jsx';
import CreateItianProfile from './pages/profiles/CreateItianProfile';
import ItianProfile from './pages/profiles/ItianProfile.jsx';
import ViewItianProfile from './pages/profiles/ViewItianProfile';
import ViewEmployerProfile from './pages/profiles/ViewEmployerProfile.jsx';

import useAuthInit from './hooks/useAuthInit';
function App() {
  useAuthInit();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      if (user.role === 'itian') {
        dispatch(fetchItianProfile(user.id));
      } else if (user.role === 'employer') {
        dispatch(fetchEmployerProfile(user.id));
      }
    }
  }, [user, dispatch]);

  return (
    <Provider store={store}>
      
      <Router>
        <Routes>
          {/* 🟩 Pages without layout */}
          <Route element={<NoLayout />}>
            <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{ height: 80, margin: '2rem auto', display: 'block' }} /><h1>Home Page</h1></div>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* 🟧 Admin layout */}
          <Route element={<AdminLayout />}>
            {adminRoutes}
          </Route>

          {/* 🟨 Itian layout */}
          <Route element={<ItianLayout />}>
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailsPublic />} />
            <Route path="/apply/:id" element={<ApplyForm />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/my-applications/:id" element={<ProposalDetails />} />
            <Route path="/posts" element={<PostsList />} />
            <Route path="/itian-profile" element={<ItianProfile />} />
            <Route path="/create-itian-profile" element={<CreateItianProfile />} />
            <Route path="/itian/mychat" element={<ChatApp />} />
            <Route path="/employer-public-profile/:username" element={<ViewEmployerProfile />} />
           <Route path="/employer-profile/:userId" element={<ViewEmployerProfile />} />
           <Route path="/employer-profiles/:userId" element={<ViewEmployerProfile />} />
          </Route>

          {/* 🟦 Employer layout */}
          <Route element={<EmployerLayout />}>
            <Route path="/employer/post-job" element={<PostJob />} />
            <Route path="/employer/jobs" element={<JobList />} />
            <Route path="/employer/trash" element={<TrashPage />} />
            <Route path="/employer/job/:id" element={<JobDetails />} />
            <Route path="/employer/job/:id/applications" element={<JobApplications />} />
            <Route path="/employer/mychat" element={<ChatApp />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/employer-profile" element={<EmployerProfile />} />
            <Route path="/create-employer-profile" element={<CreateEmployerProfile />} />
            <Route path="/itian-profile/:userId" element={<ViewItianProfile />} />
            <Route path="/profile/:username" element={<ViewItianProfile />} />

          </Route>


          {/* 🟪 Public profiles (outside layout or custom later) */}


        </Routes>
        
      </Router>
      </Provider>
  );
}

export default App;
