import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Upload, Globe, X } from "lucide-react";

const CreateEmployerProfile = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access-token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("company_name", companyName);
    formData.append("industry", industry);
    formData.append("company_size", companySize);
    formData.append("location", location);
    formData.append("contact_person_name", contactPerson);
    formData.append("contact_email", contactEmail);
    formData.append("phone_number", phoneNumber);
    formData.append("website_url", websiteUrl);
    formData.append("company_description", companyDescription);
    if (companyLogo) formData.append("company_logo", companyLogo);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/employer-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Profile created:", response.data);
      setLoading(false);
      localStorage.setItem("profileCreated", "true"); // حفظ حالة إنشاء البروفايل
      navigate("/employer-profile");
    } catch (err) {
      let errorMsg = "Failed to create profile. Please try again.";
      if (err.response) {
        if (err.response.status === 409) {
          errorMsg = "Profile already exists.";
          localStorage.setItem("profileCreated", "true");
          navigate("/employer-profile");
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data?.errors) {
          errorMsg = Object.values(err.response.data.errors).flat().join(". ");
        }
      }
      setError(errorMsg);
      setLoading(false);
      console.error("Error details:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-8 py-6">
            <h1 className="text-4xl font-bold text-white flex items-center">
              <Building2 className="h-8 w-8 mr-4" />
              Create Employer Profile
            </h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-2xl mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-full p-2 mr-4">
                <X className="h-6 w-6 text-white" />
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 space-y-8">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Building2 className="h-6 w-6 text-red-500 mr-3" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter industry"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Company Size</label>
                <input
                  type="text"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter company size"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="h-6 w-6 text-red-500 mr-3" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter contact person"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="h-6 w-6 text-red-500 mr-3" />
              Online Presence
            </h4>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="h-6 w-6 text-red-500 mr-3" />
              Company Logo
            </h4>
            <input
              type="file"
              onChange={(e) => setCompanyLogo(e.target.files[0])}
              accept="image/jpeg,image/png,application/pdf"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
            />
          </div>

          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Building2 className="h-6 w-6 text-red-500 mr-3" />
              Company Description
            </h4>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 h-32"
              placeholder="Enter company description"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <Building2 className="h-5 w-5" />
              )}
              <span>{loading ? "Creating..." : "Create Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployerProfile;