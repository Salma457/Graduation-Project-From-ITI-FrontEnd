import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import viteLogo from '../public/vite.svg';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className=""><img src={viteLogo} alt="Vite Logo" style={{height: 80, margin: '2rem auto', display: 'block'}} /><h1>Home Page</h1></div>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </Router>
  )
}

export default App
