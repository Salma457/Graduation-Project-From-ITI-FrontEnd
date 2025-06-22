import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import applicationStore from './applicationStore';
import './App.css';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import PostJob from './pages/Employer/pages/PostJob.jsx';
import JobList from './pages/Employer/pages/DisplayJob';
import TrashPage from './pages/Employer/pages/TrashPage';
import JobDetails from './pages/Employer/pages/JobDetails';
import JobApplications from './pages/Employer/pages/JobApplications';
import ChatApp from './pages/Employer/pages/ChatApp';
import viteLogo from '../public/vite.svg';
import adminRoutes from './pages/admin/adminRoutes.jsx';
import PostsList from './Posts/components/posts/PostList.jsx';
import JobsPage from './pages/Itian/JobsPage.jsx';
import JobDetailsPublic from './pages/Itian/JobDetails.jsx';
import ApplyForm from './pages/Itian/ApplyForm.jsx';
import MyApplications from './pages/Itian/MyApplications.jsx';
import ProposalDetails from './pages/Itian/ProposalDetails.jsx';
import StripeProvider from './components/StripeProvider.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
function App() {
  return (
    <Provider store={applicationStore}>
      <Router>
        <StripeProvider>
        <Routes>
          <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{height: 80, margin: '2rem auto', display: 'block'}} /><h1>Home Page</h1></div>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {adminRoutes}
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/jobs" element={<JobList />} />
          <Route path="/employer/trash" element={<TrashPage />} />
          <Route path="/employer/job/:id" element={<JobDetails />} />
          <Route path="/employer/job/:id/applications" element={<JobApplications />} />
          <Route path="/mychat" element={<ChatApp />} />
          <Route path="/posts" element={<PostsList />} />
          {/* Public job seeker routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPublic />} />
          <Route path="/apply/:id" element={<ApplyForm />} />
          
          
         
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/my-applications/:id" element={<ProposalDetails />} />
        <Route path="/payment" element={<PaymentPage />} />
       <Route path="/success" element={<PaymentSuccess />} />
        </Routes>
        </StripeProvider>
        
      </Router>
    </Provider>
  );
   
 
}

export default App;
