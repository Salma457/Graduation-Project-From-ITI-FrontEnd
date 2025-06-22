import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import viteLogo from '../public/vite.svg';
import CreateEmployerProfile from "./pages/CreateEmployerProfile";
import EmployerProfile from "./pages/EmployerProfile.jsx";
import CreateItianProfile from "./pages/CreateItianProfile";
import ItianProfile from "./pages/ItianProfile.jsx";
import ViewItianProfile from "./pages/ViewItianProfile";
import ViewEmployerProfile from "./pages/ViewEmployerProfile.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{height: 80, margin: '2rem auto', display: 'block'}} /><h1>Home Page</h1></div>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/create-employer-profile" element={<CreateEmployerProfile />} />
        <Route path="/employer-profile" element={<EmployerProfile />} />
        <Route path="/employer-public-profile/:username" element={<ViewEmployerProfile />} />

        <Route path="/create-itian-profile" element={<CreateItianProfile />} />
        <Route path="/itian-profile" element={<ItianProfile />} />
        <Route path="/profile/:username" element={<ViewItianProfile />} />
      </Routes>
    </Router>
  );
}

export default App;