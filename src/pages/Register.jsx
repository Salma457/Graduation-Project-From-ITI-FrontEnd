import React, { useState } from "react";
import "./Register.css";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    certificate: null
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, certificate: file }));
  };

  function validateUserData(userData) {
    const errors = {};
    if (!userData.name || typeof userData.name !== 'string' || userData.name.trim() === '') {
      errors.name = 'Name is required.';
    } else if (userData.name.length > 255) {
      errors.name = 'Name must not exceed 255 characters.';
    }
    if (!userData.email || typeof userData.email !== 'string' || userData.email.trim() === '') {
      errors.email = 'Email is required.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userData.email)) {
      errors.email = 'Email must be a valid email address.';
    }
    if (!userData.password || typeof userData.password !== 'string') {
      errors.password = 'Password is required.';
    } else if (userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (userData.password !== userData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match.';
    }
    const allowedRoles = ['admin', 'itian', 'employer'];
    if (!userData.role || !allowedRoles.includes(userData.role)) {
      errors.role = 'Role is required and must be admin, itian, or employer.';
    }
    if (userData.role === 'itian') {
      if (!userData.certificate) {
        errors.certificate = 'Certificate is required for ITIAN role.';
      } else {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(userData.certificate.type)) {
          errors.certificate = 'Certificate must be a PDF, JPG, or PNG file.';
        }
        if (userData.certificate.size > 2 * 1024 * 1024) {
          errors.certificate = 'Certificate must not exceed 2MB.';
        }
      }
    } else if (userData.certificate) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(userData.certificate.type)) {
        errors.certificate = 'Certificate must be a PDF, JPG, or PNG file.';
      }
      if (userData.certificate.size > 2 * 1024 * 1024) {
        errors.certificate = 'Certificate must not exceed 2MB.';
      }
    }
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateUserData(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    // Prepare form data for API
    const apiData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) apiData.append(key, value);
    });
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', apiData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Registration successful!', response);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.log('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-root">
      <div className="register-left">
        <div className="register-container">
          <div className="register-header">
            <h2 className="register-title">Register</h2>
          </div>
          <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div className="register-field">
              <label htmlFor="name" className="register-label">Name</label>
              <input type="text" id="name" name="name" className="register-input" placeholder="Name" onChange={handleInputChange} />
              {errors.name && <div className="input-error">{errors.name}</div>}
            </div>
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
              <label htmlFor="password_confirmation" className="register-label">Confirm Password</label>
              <input type="password" id="password_confirmation" name="password_confirmation" className="register-input" placeholder="Confirm Password" onChange={handleInputChange} />
              {errors.password_confirmation && <div className="input-error">{errors.password_confirmation}</div>}
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
            {/* Show certificate field only for ITIAN */}
            {formData.role === 'itian' && (
              <div className="register-field">
                <label htmlFor="certificate" className="register-label">Certificate</label>
                <input type="file" id="certificate" name="certificate" className="register-input" accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} />
                {errors.certificate && <div className="input-error">{errors.certificate}</div>}
              </div>
            )}
            <button type="submit" className="register-button">Register</button>
          </form>
        </div>
      </div>
      <div className="register-hero">
        <div className="register-hero-bg1" />
        <div className="register-hero-bg2" />
        <div className="register-hero-content">
          {formData.role === 'employer' ? (
            <>
              <h1 className="register-hero-title">Find the Best ITIANs for Your Company</h1>
              <p className="register-hero-desc">Register as an employer to connect with top IT talents and grow your business with the right people.</p>
              <div className="register-hero-people">
                <div className="register-hero-person">🏢</div>
                <div className="register-hero-person">🤝</div>
                <div className="register-hero-person">💼</div>
              </div>
            </>
          ) : (
            <>
              <h1 className="register-hero-title">Become a part of our ever-growing community.</h1>
              <p className="register-hero-desc">Join now to connect with both companies and students through our powerful platform.</p>
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

export default Register;