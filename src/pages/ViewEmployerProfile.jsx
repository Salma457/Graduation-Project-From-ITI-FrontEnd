import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users, // For company size or general users
  Edit3, // Not used in view, but keeping for consistency if needed
  Save, // Not used in view
  X, // Not used in view
  Upload, // Not used in view
  Sparkles, // For loading animation
  User, // For contact person icon
  Link, // For website URL icon
} from "lucide-react";

// Component for section headers (reusable)
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 rounded-t-xl">
    <h3 className="text-2xl font-bold text-white flex items-center">
      <Icon className="h-7 w-7 mr-4 text-white" />
      {title}
    </h3>
  </div>
);

const ViewEmployerProfile = () => {
  const { username } = useParams(); // Get username from URL
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8000"; // Your Laravel backend URL

  useEffect(() => {
    const fetchEmployerProfile = async () => {
      try {
        setLoading(true);
        // Use the public route to fetch profile by username
        const response = await axios.get(
          `${BASE_URL}/api/employer-public-profile/${username}`
        );
        setProfile(response.data.data); // Access data.data as per controller response
        setError("");
      } catch (err) {
        console.error("Error fetching public employer profile:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load employer profile. Please try again.");
        }
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchEmployerProfile();
    }
  }, [username, BASE_URL]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <Sparkles className="h-12 w-12 animate-pulse text-red-600" />
        <p className="text-gray-700 text-xl ml-4">Loading employer profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
          <p className="text-red-600 text-xl font-semibold mb-6">{error}</p>
          <a
            href="/" // Or a more appropriate fallback page
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
        <p className="text-gray-600 text-xl">No employer profile found for this user.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="relative h-48 bg-gradient-to-r from-red-700 to-red-900 flex items-center justify-center">
            {profile.company_logo_url ? (
              <img
                src={profile.company_logo_url}
                alt={`${profile.company_name} Logo`}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <Building2 className="w-24 h-24 text-red-200" />
            )}
          </div>
          <div className="p-8 text-center -mt-16 relative z-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              {profile.company_name}
            </h2>
            <p className="text-red-600 text-xl font-medium mb-4">
              {profile.industry || "Industry Not Specified"}
            </p>
            <div className="flex items-center justify-center text-gray-700 text-lg space-x-4">
              {profile.location && (
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  {profile.location}
                </span>
              )}
              {profile.company_size && (
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500" />
                  {profile.company_size}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Company Description Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200">
          <SectionHeader icon={Building2} title="About Our Company" />
          <div className="p-8 text-gray-700 text-lg leading-relaxed">
            <p>{profile.company_description || "No company description provided yet."}</p>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200">
          <SectionHeader icon={Mail} title="Contact Information" />
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-lg">
            <div className="flex items-center text-gray-800">
              <User className="h-6 w-6 text-red-500 mr-3" />
              <span className="font-semibold">Contact Person:</span>{" "}
              {profile.contact_person_name || "N/A"}
            </div>
            <div className="flex items-center text-gray-800">
              <Mail className="h-6 w-6 text-red-500 mr-3" />
              <span className="font-semibold">Email:</span>{" "}
              {profile.contact_email || "N/A"}
            </div>
            <div className="flex items-center text-gray-800">
              <Phone className="h-6 w-6 text-red-500 mr-3" />
              <span className="font-semibold">Phone:</span>{" "}
              {profile.phone_number || "N/A"}
            </div>
            <div className="flex items-center text-gray-800">
              <Link className="h-6 w-6 text-red-500 mr-3" />
              <span className="font-semibold">Website:</span>{" "}
              {profile.website_url ? (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {profile.website_url}
                </a>
              ) : (
                "N/A"
              )}
            </div>
            {profile.username && (
              <div className="flex items-center text-gray-800">
                <User className="h-6 w-6 text-red-500 mr-3" />
                <span className="font-semibold">Username:</span>{" "}
                {profile.username}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployerProfile;