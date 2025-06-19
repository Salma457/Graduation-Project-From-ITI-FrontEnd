import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import viteLogo from '../public/vite.svg';
import JobsPage from "./pages/JobsPage.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import ApplyForm from "./pages/ApplyForm.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import ProposalDetails from "./pages/ProposalDetails.jsx";
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{height: 80, margin: '2rem auto', display: 'block'}} /><h1>Home Page</h1></div>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:id" element={<ApplyForm />} />
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/my-applications/:id" element={<ProposalDetails />} />

      </Routes>
    </Router>
  )
}

export default App
