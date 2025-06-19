import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import viteLogo from '../public/vite.svg';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Approvals from './pages/admin/Approvals.jsx';
import Posts from './pages/admin/Posts.jsx';
import Users from './pages/admin/Users.jsx';
import Jobs from './pages/admin/Jobs.jsx';
import Reports from './pages/admin/Reports.jsx';
import adminRoutes from './pages/admin/adminRoutes.jsx';
import { Provider } from 'react-redux';
import store from './store';

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
        </Routes>
      </Router>
    </Provider>
  )
}

export default App
