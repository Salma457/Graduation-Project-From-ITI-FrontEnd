import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postJob, resetJobState } from "../jobPostSlice";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.jobPost);

  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    requirements: '',
    qualifications: '',
    job_location: 'Remote',
    job_type: 'Full-time',
    salary_range_min: '',
    salary_range_max: '',
    currency: 'EGP',
    posted_date: new Date().toISOString(),
    application_deadline: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    return () => {
      dispatch(resetJobState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate('/employer/jobs');
    }
  }, [success, navigate]);

  // Real-time validation - يتم استدعاؤها عند كل تغيير في البيانات
  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'job_title':
        if (!value.trim()) {
          errors.job_title = 'Job title is required';
        }
        break;
        
      case 'description':
        if (!value.trim()) {
          errors.description = 'Job description is required';
        } else if (value.length < 50) {
          errors.description = 'Description should be at least 50 characters';
        }
        break;
        
      case 'salary_range_min':
        if (value && formData.salary_range_max && parseInt(value) >= parseInt(formData.salary_range_max)) {
          errors.salary_range_min = 'Minimum salary must be less than maximum salary';
        }
        break;
        
      case 'salary_range_max':
        if (value && formData.salary_range_min && parseInt(formData.salary_range_min) >= parseInt(value)) {
          errors.salary_range_max = 'Maximum salary must be greater than minimum salary';
        }
        break;
        
      case 'application_deadline':
        if (value) {
          const deadlineDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (deadlineDate <= today) {
            errors.application_deadline = 'Application deadline must be in the future';
          }
        }
        break;
        
      default:
        break;
    }
    
    return errors;
  };

  // Enhanced form validation للتحقق من جميع الحقول عند الإرسال
  const validateForm = () => {
    const errors = {};
    
    // التحقق من جميع الحقول المطلوبة
    Object.keys(formData).forEach(key => {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(errors, fieldErrors);
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // تحديد أن الحقل تم لمسه
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // التحقق من صحة الحقل فوراً إذا كان تم لمسه من قبل
    if (touched[name] || formErrors[name]) {
      const fieldErrors = validateField(name, value);
      
      setFormErrors(prev => {
        const newErrors = { ...prev };
        
        // إزالة الخطأ القديم للحقل
        delete newErrors[name];
        
        // إضافة الخطأ الجديد إن وجد
        if (fieldErrors[name]) {
          newErrors[name] = fieldErrors[name];
        }
        
        // التحقق من حقول الراتب المترابطة
        if (name === 'salary_range_min' && formData.salary_range_max) {
          const maxErrors = validateField('salary_range_max', formData.salary_range_max);
          if (maxErrors.salary_range_max) {
            newErrors.salary_range_max = maxErrors.salary_range_max;
          } else {
            delete newErrors.salary_range_max;
          }
        }
        
        if (name === 'salary_range_max' && formData.salary_range_min) {
          const minErrors = validateField('salary_range_min', formData.salary_range_min);
          if (minErrors.salary_range_min) {
            newErrors.salary_range_min = minErrors.salary_range_min;
          } else {
            delete newErrors.salary_range_min;
          }
        }
        
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // تحديد أن الحقل تم لمسه عند فقدان التركيز
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // التحقق من صحة الحقل
    const fieldErrors = validateField(name, value);
    
    setFormErrors(prev => {
      const newErrors = { ...prev };
      
      // إزالة الخطأ القديم
      delete newErrors[name];
      
      // إضافة الخطأ الجديد إن وجد
      if (fieldErrors[name]) {
        newErrors[name] = fieldErrors[name];
      }
      
      return newErrors;  
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // تحديد جميع الحقول كملموسة
    const allFields = Object.keys(formData);
    const touchedAll = {};
    allFields.forEach(field => {
      touchedAll[field] = true;
    });
    setTouched(touchedAll);
    
    if (!validateForm()) {
      return;
    }
    
    // Convert data to proper format
    const jobData = {
      ...formData,
      posted_date: new Date().toISOString().split('T')[0],
      salary_range_min: formData.salary_range_min ? parseInt(formData.salary_range_min) : null,
      salary_range_max: formData.salary_range_max ? parseInt(formData.salary_range_max) : null,
    };
    
    dispatch(postJob(jobData));
  };

  const handleReset = () => {
    setFormData({
      job_title: '',
      description: '',
      requirements: '',
      qualifications: '',
      job_location: 'Remote',
      job_type: 'Full-time',
      salary_range_min: '',
      salary_range_max: '',
      currency: 'EGP',
      posted_date: new Date().toISOString(),
      application_deadline: '',
    });
    setFormErrors({});
    setTouched({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Post a New Job</h2>
              <p className="mt-2 text-lg text-gray-600">
                Fill in the details below to create a comprehensive job posting
              </p>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Job posted successfully! Your job listing is now live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error.message || "Error posting job. Please try again."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.job_title 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="e.g. Senior Frontend Developer"
                />
                {formErrors.job_title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.job_title}</p>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="5"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.description 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed description of the job role, responsibilities, and what makes this position exciting..."
                />
                <div className="mt-1 text-sm text-gray-500">
                  {formData.description.length} characters
                </div>
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="List the essential technical skills, experience level, and must-have qualifications..."
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Qualifications</label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Specify preferred qualifications, certifications, or nice-to-have skills..."
                />
              </div>

              {/* Three column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Job Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Location</label>
                  <select
                    name="job_location"
                    value={formData.job_location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="EGP">EGP - Egyptian Pound</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                    <option value="SAR">SAR - Saudi Riyal</option>
                  </select>
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Salary</label>
                  <input
                    type="number"
                    name="salary_range_min"
                    value={formData.salary_range_min}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.salary_range_min 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="10000"
                  />
                  {formErrors.salary_range_min && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.salary_range_min}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Salary</label>
                  <input
                    type="number"
                    name="salary_range_max"
                    value={formData.salary_range_max}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.salary_range_max 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="20000"
                  />
                  {formErrors.salary_range_max && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.salary_range_max}</p>
                  )}
                </div>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                <input
                  type="date"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.application_deadline 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  }`}
                />
                {formErrors.application_deadline && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.application_deadline}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Form
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Posting Job...</span>
                      </div>
                    ) : (
                      'Post Job'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;