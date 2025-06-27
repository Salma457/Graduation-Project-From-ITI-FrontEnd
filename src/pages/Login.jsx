import React, { useEffect, useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/userSlice';
import LoaderOverlay from '../components/LoaderOverlay';

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user.user);
  console.log('Redux user slice (Login.jsx):', user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    // Only redirect if there's a token AND user data in Redux
    if (localStorage.getItem('access-token') && user) {
      // Redirect admins to approvals page, others to home
      if (user.role === 'admin') {
        navigate('/admin/approvals', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, user]);

  // On mount: if token exists, fetch user from backend and set in Redux
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access-token');
      if (token && !user) {
        setLoadingUser(true);
        try {
          const res = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setUser(res.data));
        } catch {
          localStorage.removeItem('access-token');
        } finally {
          setLoadingUser(false);
        }
      }
    };
    fetchUser();
  }, [dispatch, user]);

  const validateUserData = (userData) => {
    const errors = {};
    if (!userData.email?.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!userData.password) {
      errors.password = 'Password is required.';
    } else if (userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setGeneralError("");
    
    const validationErrors = validateUserData(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      
      // Store token and user data
      localStorage.setItem('access-token', response.data.access_token);
dispatch(setUser({
  ...response.data.user,
  role: response.data.user.role,
}));
     localStorage.setItem('user-id', JSON.stringify(response.data.user.id));
      const userRole = response.data.user.role;
      if (userRole === 'employer') {
        try {
          const profileCheck = await axios.get("http://127.0.0.1:8000/api/employer-profile", {
            headers: { Authorization: `Bearer ${response.data.access_token}` },
          });
          if (profileCheck.status === 200) {
            navigate("/employer-profile");
          } else {
            navigate("/create-employer-profile");
          }
        } catch (err) {
          if (err.response?.status === 404) {
            navigate("/create-employer-profile");
          } else {
            throw err;
          }
        }
      } else if (userRole === 'itian') {
        try {
          const profileCheck = await axios.get("http://127.0.0.1:8000/api/itian-profile", {
            headers: { Authorization: `Bearer ${response.data.access_token}` },
          });
          if (profileCheck.status === 200) {
            navigate("/itian-profile");
          } else {
            navigate("/create-itian-profile");
          }
        } catch (err) {
          if (err.response?.status === 404) {
            navigate("/create-itian-profile");
          } else {
            throw err;
          }
        }
      } else if (userRole === 'admin') {
        navigate('/admin');
      }
    } catch (error) {
      setIsSubmitting(false);
      handleLoginError(error);
    }
  };

  const getDefaultRoute = (role) => {
    switch(role) {
      case 'employer':
        return checkEmployerProfile();
      case 'itian':
        return checkItianProfile();
      case 'admin':
        return '/admin/approvals'; // Redirect admin to approvals page
      default:
        return '/';
    }
  };

  const checkEmployerProfile = async () => {
    try {
      const token = localStorage.getItem('access-token');
      await axios.get("http://127.0.0.1:8000/api/employer-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return "/employer-profile";
    } catch (err) {
      return err.response?.status === 404 
        ? "/create-employer-profile" 
        : "/error"; // Fallback for other errors
    }
  };

  const checkItianProfile = async () => {
    try {
      const token = localStorage.getItem('access-token');
      await axios.get("http://127.0.0.1:8000/api/itian-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return "/itian-profile";
    } catch (err) {
      return err.response?.status === 404 
        ? "/create-itian-profile" 
        : "/error"; // Fallback for other errors
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      if (error.response.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response.data?.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError('Login failed. Please check your credentials.');
      }
    } else {
      setGeneralError('Network error. Please try again later.');
    }
  };

  return (
    loadingUser ? <LoaderOverlay /> : (
      <div className="register-root">
        <div className="register-left">
          <div className="register-container">
            <div className="register-header">
              <h2 className="register-title">Login</h2>
            </div>
            {generalError && <div className="input-error" style={{textAlign: 'center', marginBottom: '1rem'}}>{generalError}</div>}
            <form onSubmit={handleSubmit} method="post">
              <div className="register-field">
                <label htmlFor="email" className="register-label">Email</label>
                <input type="text" id="email" name="email" className="register-input" placeholder="Email" onChange={handleInputChange} />
                {errors.email && <div className="input-error">{errors.email}</div>}
              </div>
              <div className="register-field">
                <label htmlFor="password" className="register-label">Password</label>
                <input type="password" id="password" name="password" className="register-input" placeholder="Password" onChange={handleInputChange} />
                {errors.password && <div className="input-error">{errors.password}</div>}
              </div>
              <button type="submit" className="register-button">Login</button>
            </form>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem'}}>
              <Link to="/register" style={{color: '#e35d5b', fontWeight: 600}}>Don't have an account? Register</Link>
              <button
                type="button"
                className="register-link"
                style={{background: 'none', border: 'none', color: '#e35d5b', cursor: 'pointer', fontWeight: 600, padding: 0}}
                onClick={async () => {
                  if (!formData.email) {
                    setErrors(prev => ({...prev, email: 'Please enter your email to reset password.'}));
                    return;
                  }
                  try {
                    await axios.post('http://localhost:8000/api/forgot-password', { email: formData.email });
                    setGeneralError('Password reset link sent to your email.');
                  } catch {
                    setGeneralError('Failed to send reset link. Please try again.');
                  }
                }}
              >
                Forgot password?
              </button>
            </div>
          </div>
        </div>
        <div className="register-hero">
          <div className="register-hero-bg1" />
          <div className="register-hero-bg2" />
          <div className="register-hero-content">
            <h1 className="register-hero-title">Welcome Back to the Community!</h1>
            <p className="register-hero-desc">Log in to connect with companies and students through our powerful platform.</p>
            <div className="register-hero-people">
              <div className="register-hero-person">👨‍💼</div>
              <div className="register-hero-person">👩‍💻</div>
              <div className="register-hero-person">👨‍🎓</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Login;