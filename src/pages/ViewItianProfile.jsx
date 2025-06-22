import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  User,
  Mail,
  Globe,
  Calendar,
  Briefcase,
  MapPin,
  Github,
  Linkedin,
  Award,
  BookOpen,
  Star,
  X,
  Upload,
  FileText,
  MessageSquare,
  Sparkles,
} from "lucide-react";

// Section header component
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 rounded-t-xl">
    <h3 className="text-2xl font-bold text-white flex items-center">
      <Icon className="h-7 w-7 mr-4 text-white" />
      {title}
    </h3>
  </div>
);

const ViewItianProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8000";

  // Fetch profile data with optional authentication token
  const fetchProfileData = async () => {
    if (!username) {
      setError("Username is required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Fetching profile for username:", username);
      
      const token = localStorage.getItem('token'); // Retrieve token if available
      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`; // Add token if exists
      }

      const response = await axios.get(`${BASE_URL}/public-profile/${username}`, {
        headers,
      });

      console.log("Response:", response);

      if (response.status === 200 && response.data) {
        const profileData = response.data;
        
        console.log("Profile data:", profileData);
        
        if (!profileData.first_name && !profileData.last_name) {
          setError("Profile data is incomplete.");
          setLoading(false);
          return;
        }
        
        setProfile(profileData);
        setSkills(Array.isArray(profileData.skills) ? profileData.skills : []);
        setProjects(Array.isArray(profileData.projects) ? profileData.projects : []);
      } else {
        setError("No profile data available for this user.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      
      if (err.response) {
        // Server responded with error status
        const status = err.response.status;
        const message = err.response.data?.message || err.message;
        
        if (status === 404) {
          setError("Profile not found for this username.");
        } else if (status === 500) {
          setError("Server error occurred. Please try again later.");
        } else {
          setError(`Error ${status}: ${message}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Network error. Please check your connection and try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin animation-delay-150"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
        </div>
        <p className="ml-6 text-gray-800 text-xl font-medium animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border-l-8 border-red-600 p-8 rounded-lg shadow-lg max-w-lg w-full">
          <div className="flex items-center">
            <div className="bg-red-600 rounded-full p-2 mr-4">
              <X className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-red-800 font-bold text-lg">Error</h3>
              <p className="text-gray-700 mt-1">{error || "No profile found."}</p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={fetchProfileData}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 px-10 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 shadow-md">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-white mb-2">ITIAN Profile</h1>
                <p className="text-red-100 text-lg">Personal information and professional details</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => console.log("View Posts Clicked")}
                className="bg-white text-red-600 px-6 py-3 rounded-full hover:bg-red-50 transition-colors flex items-center shadow-lg font-semibold"
              >
                <FileText className="h-5 w-5 mr-2" /> View Posts
              </button>
              <button
                onClick={() => console.log("Chat Clicked")}
                className="bg-white text-red-600 px-6 py-3 rounded-full hover:bg-red-50 transition-colors flex items-center shadow-lg font-semibold"
              >
                <MessageSquare className="h-5 w-5 mr-2" /> Chat
              </button>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* Personal Information Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <SectionHeader icon={User} title="Personal Information" />
            <div className="p-10">
              <div className="flex flex-col lg:flex-row items-start gap-10">
                <div className="flex-shrink-0 w-full lg:w-auto flex flex-col items-center">
                  {profile.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt="Profile Picture"
                      className="w-48 h-48 object-cover rounded-full shadow-lg border-4 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-48 h-48 bg-gray-100 rounded-full shadow-lg border-4 border-gray-200 flex items-center justify-center" style={{ display: profile.profile_picture_url ? 'none' : 'flex' }}>
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                  <h2 className="text-4xl font-extrabold text-gray-900 mt-6 text-center">
                    {profile.first_name || ""} {profile.last_name || ""}
                  </h2>
                  {profile.bio && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 leading-relaxed text-lg text-center mt-4 max-w-md">{profile.bio}</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4">
                  <div className="flex items-center space-x-4">
                    <Briefcase className="h-7 w-7 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Track</p>
                      <p className="text-lg font-medium text-gray-800">{profile.iti_track || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-7 w-7 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Graduation Year</p>
                      <p className="text-lg font-medium text-gray-800">{profile.graduation_year || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Star className="h-7 w-7 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="text-lg font-medium text-gray-800">
                        {profile.experience_years || "0"} {profile.experience_years === 1 ? "year" : "years"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-7 w-7 flex items-center justify-center">
                      <div className={`h-4 w-4 rounded-full ${profile.is_open_to_work ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Open to Work</p>
                      <p className="text-lg font-medium">
                        {profile.is_open_to_work ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                  {profile.current_job_title && (
                    <div className="flex items-center space-x-4">
                      <Briefcase className="h-7 w-7 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Current Role</p>
                        <p className="text-lg font-medium text-gray-800">{profile.current_job_title}</p>
                      </div>
                    </div>
                  )}
                  {profile.current_company && (
                    <div className="flex items-center space-x-4">
                      <Briefcase className="h-7 w-7 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-500">Current Company</p>
                        <p className="text-lg font-medium text-gray-800">{profile.current_company}</p>
                      </div>
                    </div>
                  )}
                  {profile.cv_url && (
                    <div className="mt-4 col-span-full">
                      <a
                        href={profile.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                      >
                        <Upload className="h-5 w-5 mr-2" /> View CV
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Position Section */}
          {profile.current_job_title && (
            <div className="bg-white rounded-xl border border-gray-200">
              <SectionHeader icon={Briefcase} title="Current Position" />
              <div className="p-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-4 rounded-xl">
                    <Briefcase className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{profile.current_job_title}</h4>
                    <p className="text-gray-600 text-lg">{profile.current_company}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="bg-white rounded-xl border border-gray-200">
            <SectionHeader icon={Mail} title="Contact Information" />
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {profile.email && (
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                    <p className="text-gray-800 text-lg break-all">{profile.email}</p>
                  </div>
                </div>
              )}
              {profile.portfolio_url && (
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Globe className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Portfolio</p>
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline break-all text-lg font-medium"
                    >
                      {profile.portfolio_url}
                    </a>
                  </div>
                </div>
              )}
              {profile.preferred_job_locations && (
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Preferred Job Locations</p>
                    <p className="text-gray-800 text-lg">{profile.preferred_job_locations}</p>
                  </div>
                </div>
              )}
              {profile.linkedin_profile_url && (
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Linkedin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">LinkedIn</p>
                    <a
                      href={profile.linkedin_profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline break-all text-lg font-medium"
                    >
                      {profile.linkedin_profile_url}
                    </a>
                  </div>
                </div>
              )}
              {profile.github_profile_url && (
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Github className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">GitHub</p>
                    <a
                      href={profile.github_profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-red-600 hover:text-red-700 hover:underline break-all text-lg font-medium"
                    >
                      {profile.github_profile_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <SectionHeader icon={Award} title="Skills" />
              <div className="p-8">
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium border border-gray-200"
                    >
                      {skill.skill_name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200">
              <SectionHeader icon={BookOpen} title="Projects" />
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300"
                  >
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{project.project_title}</h4>
                    <p className="text-gray-700 mb-4 text-base leading-relaxed">{project.description}</p>
                    {project.project_link && (
                      <a
                        href={project.project_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium hover:underline group"
                      >
                        View Project
                        <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewItianProfile;