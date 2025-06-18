import React, { useState } from "react";
import "./Register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  function validateUserData(userData) {
    const errors = {};
    if (!userData.email || typeof userData.email !== 'string' || userData.email.trim() === '') {
      errors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userData.email)) {
      errors.email = 'Email must be a valid email address.';
    }
    if (!userData.password || typeof userData.password !== 'string') {
      errors.password = 'Password is required.';
    }
    const allowedRoles = ['itian', 'employer'];
    if (!userData.role || !allowedRoles.includes(userData.role)) {
      errors.role = 'Role is required and must be itian or employer.';
    }
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    const validationErrors = validateUserData(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', formData);
      console.log('Login successful!', response);

      // store access-token in localstorage
      localStorage.setItem('access-token', response.data.access_token);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data && error.response.data.message) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError('Login failed. Please try again.');
      }
    }
  };

  return (
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
            <div className="register-field">
              <label htmlFor="role" className="register-label">Role</label>
              <select id="role" name="role" className="register-input" value={formData.role} onChange={handleInputChange}>
                <option value="" disabled>Select Role</option>
                <option value="itian">ITIAN</option>
                <option value="employer">Employer</option>
              </select>
              {errors.role && <div className="input-error">{errors.role}</div>}
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
                
                  const response =  await axios.post('http://localhost:8000/api/forgot-password', { email: formData.email });
                  setGeneralError('Password reset link sent to your email.');
                } catch (error) {
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
          {formData.role === 'employer' ? (
            <>
              <h1 className="register-hero-title">Welcome Back, Employer!</h1>
              <p className="register-hero-desc">Log in to find and connect with the best ITIANs for your company.</p>
              <div className="register-hero-people">
                <div className="register-hero-person">🏢</div>
                <div className="register-hero-person">🤝</div>
                <div className="register-hero-person">💼</div>
              </div>
            </>
          ) : (
            <>
              <h1 className="register-hero-title">Welcome Back to the Community!</h1>
              <p className="register-hero-desc">Log in to connect with companies and students through our powerful platform.</p>
              <div className="register-hero-people">
                <div className="register-hero-person">👨‍💼</div>
                <div className="register-hero-person">👩‍💻</div>
                <div className="register-hero-person">👨‍🎓</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
