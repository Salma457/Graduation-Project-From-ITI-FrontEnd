import { Sparkles, ChevronLeft, Star, Award, MapPin, Download, Eye, X, AlertCircle, Calendar, Mail, Phone, User, Bookmark, Info, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';

const JobApplications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [openCoverLetter, setOpenCoverLetter] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access-token");

        // Fetch job title
        const jobRes = await axios.get(`http://localhost:8000/api/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          }
        );
        if (jobRes.status === 200) {
          const jobData = jobRes.data;
          setJobTitle(jobData.data?.job_title || "");
        }

        // Fetch applications
        const response = await axios.get(`http://localhost:8000/api/job/${id}/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        let data = response.data;
        let apps = [];
        if (Array.isArray(data)) {
          apps = data;
        } else if (Array.isArray(data.data)) {
          apps = data.data;
        } else if (data && typeof data === 'object') {
          apps = [data];
        }
        setApplications(apps);
        console.log("Fetched applications:", apps);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);


  // Map frontend status to backend expected values
  const STATUS_MAP = {
    accepted: 'approved', // Backend expects 'approved'
    rejected: 'rejected',
    pending: 'pending',
  };

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Move status normalization to a helper for reuse
  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    status = status.toLowerCase();
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending';
  };

  // Filtered and searched applications
  const filteredApplications = applications.filter(app => {
    const status = normalizeStatus(app.status);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    const matchesSearch =
      (app.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.itian_id?.toString().includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  // Group applications by status for separate display
  const groupedApplications = {
    approved: [],
    rejected: [],
    pending: []
  };
  applications.forEach(app => {
    groupedApplications[normalizeStatus(app.status)].push(app);
  });

  const handleStatusChange = async (appId, status) => {
    try {
      const backendStatus = STATUS_MAP[status] || status;
      const token = localStorage.getItem("access-token");
      await axios.put(
        `http://localhost:8000/api/job-application/${appId}`,
        { status: backendStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      // Update the application status in-place without refresh
      setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: backendStatus } : app));
      setOpenCoverLetter(null);
      if (status === 'accepted') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3500);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
      </div>
      <p className="ml-6 text-red-700 text-xl font-medium animate-pulse">Loading applications...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-xl border">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200 mb-4"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Jobs
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            Applications for: <span className="text-red-600">{jobTitle || `Job #${id}`}</span>
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium border ${statusFilter === 'all' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-red-600'} transition`}
                onClick={() => setStatusFilter('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium border ${statusFilter === 'pending' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-red-600'} transition`}
                onClick={() => setStatusFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium border ${statusFilter === 'approved' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-red-600'} transition`}
                onClick={() => setStatusFilter('approved')}
              >
                Approved
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium border ${statusFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-red-600'} transition`}
                onClick={() => setStatusFilter('rejected')}
              >
                Rejected
              </button>
            </div>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 w-full md:w-64"
              placeholder="Search by name, university, location, ITI ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-gray-600 mt-2">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
          </p>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">No applications match your filter or search.</p>
          </div>
        ) : (
          <>
            {/* Show Approved Applications */}
            {groupedApplications.approved.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-green-700 mb-4">Approved Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedApplications.approved.map((app, index) => (
                    <div key={app.id || index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                      {/* Card Header with Number and Bookmark */}
                      <div className="flex justify-between items-start p-4 pb-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Bookmark className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Profile Section */}
                      <div className="px-4 pb-4 text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <User className="w-8 h-8 text-red-600" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                          {app.applicant_name || app.user?.name || `Applicant #${app.iti_id || app.id}`}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                            ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'}`}
                          >
                            {app.status === 'approved' ? 'Approved' :
                              app.status === 'rejected' ? 'Rejected' :
                              'Pending'}
                          </span>
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-1">
                          {app.university || 'Centurion University'}
                        </p>
                        
                        <div className="flex items-center justify-center text-gray-500 text-xs mb-4">
                          <MapPin className="w-3 h-3 mr-1" />
                          {app.location || 'Location'}
                        </div>

                        {/* Scores */}
                        <div className="flex justify-between items-center mb-4 px-2">
                          <div className="text-center">
                            <span className="text-xs text-gray-500">Magic Score:</span>
                            <div className="font-bold text-gray-900">
                              {app.magic_score || 90}/100
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-gray-500">CGPA:</span>
                            <div className="font-bold text-gray-900">
                              {app.cgpa || 9.0}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 flex items-center justify-center bg-red-700 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                            onClick={() => setOpenCoverLetter(index)}
                          >
                            <Info className="w-4 h-4 mr-1" />
                            More Info
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center bg-red-900 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                            onClick={() => {
                              const userId = app.user_id || app.user?.id || app.iti_id || app.id;
                              if (userId) {
                                window.open(`/itian-profile/${userId}`, '_blank');
                              }
                            }}
                          >
                            <User className="w-4 h-4 mr-1" />
                            Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Show Pending Applications */}
            {groupedApplications.pending.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-yellow-700 mb-4">Pending Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedApplications.pending.map((app, index) => (
                    <div key={app.id || index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                      {/* Card Header with Number and Bookmark */}
                      <div className="flex justify-between items-start p-4 pb-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Bookmark className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Profile Section */}
                      <div className="px-4 pb-4 text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <User className="w-8 h-8 text-red-600" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                          {app.applicant_name || app.user?.name || `Applicant #${app.iti_id || app.id}`}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                            ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'}`}
                          >
                            {app.status === 'approved' ? 'Approved' :
                              app.status === 'rejected' ? 'Rejected' :
                              'Pending'}
                          </span>
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-1">
                          {app.university || 'Centurion University'}
                        </p>
                        
                        <div className="flex items-center justify-center text-gray-500 text-xs mb-4">
                          <MapPin className="w-3 h-3 mr-1" />
                          {app.location || 'Location'}
                        </div>

                        {/* Scores */}
                        <div className="flex justify-between items-center mb-4 px-2">
                          <div className="text-center">
                            <span className="text-xs text-gray-500">Magic Score:</span>
                            <div className="font-bold text-gray-900">
                              {app.magic_score || 90}/100
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-gray-500">CGPA:</span>
                            <div className="font-bold text-gray-900">
                              {app.cgpa || 9.0}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 flex items-center justify-center bg-red-700 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-800 transition-colors"
                            onClick={() => setOpenCoverLetter(index)}
                          >
                            <Info className="w-4 h-4 mr-1" />
                            More Info
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center bg-red-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                            onClick={() => {
                              const userId = app.user_id || app.user?.id || app.iti_id || app.id;
                              if (userId) {
                                window.open(`/itian-profile/${userId}`, '_blank');
                              }
                            }}
                          >
                            <User className="w-4 h-4 mr-1" />
                            Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Show Rejected Applications */}
            {groupedApplications.rejected.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-red-700 mb-4">Rejected Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {groupedApplications.rejected.map((app, index) => (
                    <div key={app.id || index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
                      {/* Card Header with Number and Bookmark */}
                      <div className="flex justify-between items-start p-4 pb-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <Bookmark className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {/* Profile Section */}
                      <div className="px-4 pb-4 text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <User className="w-8 h-8 text-red-600" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                          {app.applicant_name || app.user?.name || `Applicant #${app.iti_id || app.id}`}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                            ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                              app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'}`}
                          >
                            {app.status === 'approved' ? 'Approved' :
                              app.status === 'rejected' ? 'Rejected' :
                              'Pending'}
                          </span>
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-1">
                          {app.university || 'Centurion University'}
                        </p>
                        
                        <div className="flex items-center justify-center text-gray-500 text-xs mb-4">
                          <MapPin className="w-3 h-3 mr-1" />
                          {app.location || 'Location'}
                        </div>

                        {/* Scores */}
                        <div className="flex justify-between items-center mb-4 px-2">
                          <div className="text-center">
                            <span className="text-xs text-gray-500">Magic Score:</span>
                            <div className="font-bold text-gray-900">
                              {app.magic_score || 90}/100
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-xs text-gray-500">CGPA:</span>
                            <div className="font-bold text-gray-900">
                              {app.cgpa || 9.0}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 flex items-center justify-center bg-red-700 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-800 transition-colors"
                            onClick={() => setOpenCoverLetter(index)}
                          >
                            <Info className="w-4 h-4 mr-1" />
                            More Info
                          </button>
                          <button
                            className="flex-1 flex items-center justify-center bg-red-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                            onClick={() => {
                              const userId = app.user_id || app.user?.id || app.iti_id || app.id;
                              if (userId) {
                                window.open(`/itian-profile/${userId}`, '_blank');
                              }
                            }}
                          >
                            <User className="w-4 h-4 mr-1" />
                            Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Enhanced Cover Letter Modal */}
        {openCoverLetter !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-red-500 p-6 text-white relative">
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                  onClick={() => setOpenCoverLetter(null)}
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {applications[openCoverLetter]?.applicant_name || 'Applicant'}
                    </h2>
                    <p className="text-red-100 text-sm">
                      {applications[openCoverLetter]?.university || 'Centurion University'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-96 bg-white">
                {/* Scores Section */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-black">
                      {applications[openCoverLetter]?.magic_score || 90}/100
                    </div>
                    <div className="text-sm text-gray-600">Magic Score</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-black">
                      {applications[openCoverLetter]?.cgpa || 9.0}
                    </div>
                    <div className="text-sm text-gray-600">CGPA</div>
                  </div>
                </div>
                {/* Cover Letter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3">Cover Letter</h3>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {applications[openCoverLetter]?.cover_letter || 'No cover letter provided.'}
                    </p>
                  </div>
                </div>
                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-black" />
                    {applications[openCoverLetter]?.location || 'Location not provided'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-black" />
                    Applied: {applications[openCoverLetter]?.created_at ? new Date(applications[openCoverLetter].created_at).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              </div>
              {/* Modal Footer */}
              <div className="p-6 bg-red-50 border-t border-red-100 flex gap-3 justify-between">
                <a
                  href={applications[openCoverLetter]?.cv || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </a>
                <div className="flex gap-2">
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    onClick={() => handleStatusChange(applications[openCoverLetter].id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    onClick={() => handleStatusChange(applications[openCoverLetter].id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={350} recycle={false} />
        )}
      </div>
    </div>
  );
};

export default JobApplications;