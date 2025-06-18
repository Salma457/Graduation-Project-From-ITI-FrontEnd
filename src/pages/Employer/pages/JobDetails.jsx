import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, Clock, DollarSign, Calendar, FileText, 
  Award, Briefcase, ArrowLeft, Users, Sparkles,
  CheckCircle, AlertCircle, Building
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobById } from '../jobPostSlice';

const JobDetails = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.jobPost);
  const { id } = useParams();
const navigate = useNavigate();

useEffect(() => {
  dispatch(fetchJobById(id));
}, [dispatch, id]);

const job = useSelector(state => state.jobPost.jobDetails);
    
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'from-red-500 to-red-600';
      case 'closed': return 'from-gray-600 to-gray-700';
      case 'draft': return 'from-red-300 to-red-400';
      default: return 'from-red-400 to-red-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin animation-delay-150"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
        </div>
        <p className="ml-6 text-gray-800 text-xl font-medium animate-pulse">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg border border-red-300/50 rounded-3xl p-8 text-center max-w-md animate-bounce shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error?.message || 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg border border-gray-300/50 rounded-3xl p-8 text-center max-w-md shadow-2xl">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Job not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-50/40 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gray-100/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 mb-8 text-gray-600 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-3xl p-8 mb-8 shadow-2xl hover:shadow-red-500/10 transition-all duration-500 transform hover:-translate-y-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-6 h-6 text-red-500" />
                  <span className="text-red-600 font-medium">{job.company}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {job.job_title}
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {job.description}
                </p>
                
                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-red-50 backdrop-blur-sm border border-red-200 rounded-full px-4 py-2 hover:bg-red-100 transition-all duration-300">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-gray-800 font-medium">{job.job_location}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-100 transition-all duration-300">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-800 font-medium">{job.job_type}</span>
                  </div>
                  <div className={`flex items-center gap-2 bg-gradient-to-r ${getStatusColor(job.status)} rounded-full px-4 py-2 shadow-lg`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-white font-medium">{job.status}</span>
                  </div>
                </div>
              </div>

              {/* Salary Card */}
              <div className="bg-gradient-to-br from-red-500 to-red-600 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[200px] hover:scale-105 transition-transform duration-300 shadow-xl">
                <DollarSign className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-red-100 text-sm font-medium mb-1">Salary Range</p>
                <p className="text-white text-2xl font-bold">
                  {job.salary_range?.min || job.salary_range_min} - {job.salary_range?.max || job.salary_range_max}
                </p>
                <p className="text-red-100 text-sm">{job.currency}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Requirements */}
            <div className="bg-white/80 backdrop-blur-xl border border-red-200/30 rounded-2xl p-6 hover:bg-red-50/30 transition-all duration-500 group shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors duration-300">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Requirements</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
            </div>

            {/* Qualifications */}
            <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 hover:bg-gray-50/50 transition-all duration-500 group shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors duration-300">
                  <Award className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Qualifications</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{job.qualifications}</p>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="bg-white/80 backdrop-blur-xl border border-red-200/30 rounded-2xl p-6 mb-8 hover:bg-red-50/20 transition-all duration-500 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Important Dates</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <Clock className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-gray-600 text-sm">Posted Date</p>
                  <p className="text-gray-900 font-medium">{job.posted_date ? formatDate(job.posted_date) : 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50/80 rounded-xl border border-red-200/50">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-gray-600 text-sm">Application Deadline</p>
                  <p className="text-gray-900 font-medium">{job.application_deadline ? formatDate(job.application_deadline) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => navigate(`/employer/job/${id}/applications`)}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-red-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              <Users className="relative w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
<span className="relative text-lg cursor-pointer">View Applications</span>
              <Sparkles className="relative w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;