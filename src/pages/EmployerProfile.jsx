import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setEmployerProfile } from "../store/employerSlice";
import { setRole } from "../store/userSlice"; // Assuming you have a userSlice to manage role
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Users,
  Edit3,
  Save,
  X,
  Upload,
  Sparkles, // Make sure Sparkles is imported
  User, // For contact person icon
} from "lucide-react";

const EmployerProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.employer.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // To indicate if auth check is complete
  const [formErrors, setFormErrors] = useState({}); // For validation errors from backend

  // Form state - Initialize with profile data or empty strings
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [contactPersonName, setContactPersonName] = useState(""); // Changed to contactPersonName
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [companyLogo, setCompanyLogo] = useState(null); // For new logo file to be uploaded
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null); // For displaying current/new logo

  const BASE_URL = "http://localhost:8000"; // Make sure this matches your Laravel backend URL

  // Effect to fetch employer profile on component mount
  useEffect(() => {
    const fetchEmployerProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      if (role !== "employer") {
        setError("You are not authorized to view this profile.");
        dispatch(setRole(role)); // Update Redux role
        setLoading(false);
        setAuthChecked(true);
        return;
      }
      dispatch(setRole(role)); // Set role in Redux

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${BASE_URL}/api/employer-profile`);
        dispatch(setEmployerProfile(response.data.data)); // Store fetched profile in Redux
        populateForm(response.data.data); // Populate form fields
        setError(""); // Clear any previous errors
      } catch (err) {
        console.error("Failed to fetch employer profile:", err);
        if (err.response && err.response.status === 404) {
          setError("Employer profile not found. Please create your profile.");
        } else if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load profile. Please try again.");
        }
        dispatch(setEmployerProfile(null)); // Clear profile from Redux on error
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchEmployerProfile();
  }, [dispatch, BASE_URL]); // Add BASE_URL to dependency array if it's dynamic

  // Effect to update form fields when Redux profile state changes (e.g., after successful update)
  useEffect(() => {
    if (profile) {
      populateForm(profile);
    }
  }, [profile]);

  // Helper function to populate form state from profile data
  const populateForm = (profileData) => {
    setCompanyName(profileData.company_name || "");
    setIndustry(profileData.industry || "");
    setCompanySize(profileData.company_size || "");
    setLocation(profileData.location || "");
    setContactPersonName(profileData.contact_person_name || ""); // Use contact_person_name
    setContactEmail(profileData.contact_email || "");
    setPhoneNumber(profileData.phone_number || "");
    setWebsiteUrl(profileData.website_url || "");
    setCompanyDescription(profileData.company_description || "");
    setCompanyLogoPreview(profileData.company_logo_url || null); // Display current logo
    setCompanyLogo(null); // Clear any pending file selection
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMsg("");
    setError("");
    setFormErrors({}); // Clear previous validation errors
    // Populate form fields with current profile data before editing
    if (profile) {
      populateForm(profile);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccessMsg("");
    setError("");
    setFormErrors({}); // Clear validation errors
    // Reset form fields to original profile data
    if (profile) {
      populateForm(profile);
    }
    setCompanyLogo(null); // Clear any selected new logo file
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file); // Store the actual file
      setCompanyLogoPreview(URL.createObjectURL(file)); // Create URL for preview
    } else {
      setCompanyLogo(null); // No file selected
      // If no file is selected, revert preview to current profile logo or null
      setCompanyLogoPreview(profile?.company_logo_url || null);
    }
  };

  const handleRemoveLogo = () => {
    setCompanyLogo(null); // Clear the file input
    setCompanyLogoPreview(null); // Clear the preview
    // When submitting, if companyLogo is null and companyLogoPreview is null,
    // we'll send a signal to the backend to remove the logo.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");
    setFormErrors({}); // Clear previous errors

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("_method", "POST"); // Laravel expects POST for FormData with _method override
    // formData.append("_method", "PUT"); // This is the correct way for Laravel to interpret it as PUT
    // However, the route is defined as POST, so we send POST and Laravel handles _method internally.

    // Append all form fields
    formData.append("company_name", companyName);
    formData.append("industry", industry);
    formData.append("company_size", companySize);
    formData.append("location", location);
    formData.append("contact_person_name", contactPersonName); // Use contactPersonName
    formData.append("contact_email", contactEmail);
    formData.append("phone_number", phoneNumber);
    formData.append("website_url", websiteUrl);
    formData.append("company_description", companyDescription);

    // Handle company logo
    if (companyLogo) {
      formData.append("company_logo", companyLogo); // Append the new file
    } else if (profile?.company_logo_url && companyLogoPreview === null) {
      // If there was an existing logo but it was removed (preview is null)
      formData.append("company_logo", ""); // Send an empty string to signal removal
    }
    // If companyLogo is null and companyLogoPreview is not null, it means no change to existing logo.
    // In this case, we don't append 'company_logo' to formData, and Laravel will keep the old one.


    try {
      // Use the POST route for update with FormData
      const response = await axios.post(
        `${BASE_URL}/api/employer-profile/update`, // Use the new update route
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      dispatch(setEmployerProfile(response.data.data)); // Update Redux store with new data
      setSuccessMsg(response.data.message || "Profile updated successfully!");
      setIsEditing(false); // Exit edit mode on success
    } catch (err) {
      console.error("Error updating employer profile:", err);
      if (err.response) {
        if (err.response.status === 422) {
          // Validation errors from Laravel
          setFormErrors(err.response.data.errors);
          setError("Validation failed. Please check your inputs.");
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to update profile. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading && !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Sparkles className="h-10 w-10 text-red-600 animate-pulse" />
        <p className="ml-3 text-lg font-semibold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  // Render error state if profile not found or unauthorized
  if (error && !profile && authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
          <p className="text-red-600 text-xl font-semibold mb-6">{error}</p>
          {error.includes("not found") && (
            <a
              href="/create-employer-profile"
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
            >
              Create Your Profile
            </a>
          )}
          {error.includes("authorized") && (
             <a
             href="/login"
             className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
           >
             Go to Login
           </a>
          )}
        </div>
      </div>
    );
  }

  // Render message if no profile exists and not in editing mode (e.g., first time user)
  if (!profile && !isEditing && authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center">
          <p className="text-gray-700 text-xl font-semibold mb-6">No employer profile found.</p>
          <a
            href="/create-employer-profile"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors duration-200"
          >
            Create Your Profile
          </a>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex justify-center items-start">
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-sm">
          {isEditing ? "Edit Your Company Profile" : "Company Profile"}
        </h2>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {successMsg && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{successMsg}</span>
          </div>
        )}

        {profile && ( // Only render profile details if profile exists
          <div className="space-y-10">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-8 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {companyLogoPreview ? (
                      <img
                        src={companyLogoPreview}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-16 h-16 text-gray-500" />
                    )}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-4xl font-extrabold text-white">
                      {profile.company_name}
                    </h3>
                    <p className="text-red-200 text-xl font-medium mt-1">
                      {profile.industry}
                    </p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 flex items-center shadow-lg transform hover:scale-105"
                  >
                    <Edit3 className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Profile Details (Display Mode) */}
              {!isEditing ? (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-lg">
                  <div className="flex items-center text-gray-800">
                    <Building2 className="h-6 w-6 text-red-500 mr-3" />
                    <span className="font-semibold">Company Size:</span>{" "}
                    {profile.company_size || "N/A"}
                  </div>
                  <div className="flex items-center text-gray-800">
                    <MapPin className="h-6 w-6 text-red-500 mr-3" />
                    <span className="font-semibold">Location:</span>{" "}
                    {profile.location || "N/A"}
                  </div>
                  <div className="flex items-center text-gray-800">
                    <User className="h-6 w-6 text-red-500 mr-3" /> {/* Changed from Users to User */}
                    <span className="font-semibold">Contact Person:</span>{" "}
                    {profile.contact_person_name || "N/A"} {/* Changed to contact_person_name */}
                  </div>
                  <div className="flex items-center text-gray-800">
                    <Mail className="h-6 w-6 text-red-500 mr-3" />
                    <span className="font-semibold">Contact Email:</span>{" "}
                    {profile.contact_email || "N/A"}
                  </div>
                  <div className="flex items-center text-gray-800">
                    <Phone className="h-6 w-6 text-red-500 mr-3" />
                    <span className="font-semibold">Phone Number:</span>{" "}
                    {profile.phone_number || "N/A"}
                  </div>
                  <div className="flex items-center text-gray-800">
                    <Globe className="h-6 w-6 text-red-500 mr-3" />
                    <span className="font-semibold">Website:</span>{" "}
                    {profile.website_url ? (
                      <a
                        href={profile.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        {profile.website_url}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="md:col-span-2 text-gray-800 mt-4">
                    <p className="font-semibold mb-2 flex items-center">
                      <Building2 className="h-6 w-6 text-red-500 mr-3" />
                      Company Description:
                    </p>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {profile.company_description || "No description provided."}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="mb-6">
                    <label
                      htmlFor="company_logo"
                      className="block text-gray-700 text-lg font-semibold mb-3"
                    >
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      {companyLogoPreview && (
                        <div className="relative">
                          <img
                            src={companyLogoPreview}
                            alt="Company Logo Preview"
                            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                            title="Remove logo"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        id="company_logo"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                      />
                    </div>
                    {formErrors.company_logo && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.company_logo[0]}
                        </p>
                      )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                    {/* Company Name */}
                    <div>
                      <label
                        htmlFor="company_name"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company_name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.company_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="Enter company name"
                        required
                      />
                      {formErrors.company_name && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.company_name[0]}
                        </p>
                      )}
                    </div>

                    {/* Industry */}
                    <div>
                      <label
                        htmlFor="industry"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Industry
                      </label>
                      <input
                        type="text"
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.industry
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="e.g., Tech, Healthcare"
                      />
                      {formErrors.industry && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.industry[0]}
                        </p>
                      )}
                    </div>

                    {/* Company Size */}
                    <div>
                      <label
                        htmlFor="company_size"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Company Size
                      </label>
                      <input
                        type="text"
                        id="company_size"
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.company_size
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="e.g., 1-10, 50-200"
                      />
                      {formErrors.company_size && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.company_size[0]}
                        </p>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.location
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="e.g., Cairo, Egypt"
                      />
                      {formErrors.location && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.location[0]}
                        </p>
                      )}
                    </div>

                    {/* Contact Person Name */}
                    <div>
                      <label
                        htmlFor="contact_person_name"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Contact Person Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact_person_name"
                        value={contactPersonName}
                        onChange={(e) => setContactPersonName(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.contact_person_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="Name of contact person"
                        required
                      />
                      {formErrors.contact_person_name && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.contact_person_name[0]}
                        </p>
                      )}
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label
                        htmlFor="contact_email"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact_email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.contact_email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="company@example.com"
                        required
                      />
                      {formErrors.contact_email && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.contact_email[0]}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="phone_number"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone_number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.phone_number
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="e.g., +201234567890"
                      />
                      {formErrors.phone_number && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.phone_number[0]}
                        </p>
                      )}
                    </div>

                    {/* Website URL */}
                    <div>
                      <label
                        htmlFor="website_url"
                        className="block text-gray-700 text-lg font-semibold mb-3"
                      >
                        Website URL
                      </label>
                      <input
                        type="url"
                        id="website_url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className={`w-full px-6 py-4 border-2 ${
                          formErrors.website_url
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg`}
                        placeholder="https://www.example.com"
                      />
                      {formErrors.website_url && (
                        <p className="text-red-500 text-sm mt-2">
                          {formErrors.website_url[0]}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company Description */}
                  <div className="mt-8">
                    <label
                      htmlFor="company_description"
                      className="block text-gray-700 text-lg font-semibold mb-3"
                    >
                      Company Description
                    </label>
                    <textarea
                      id="company_description"
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      className={`w-full px-6 py-4 border-2 ${
                        formErrors.company_description
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 text-lg h-40 resize-none`}
                      placeholder="Enter company description..."
                    />
                    {formErrors.company_description && (
                      <p className="text-red-500 text-sm mt-2">
                        {formErrors.company_description[0]}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-6 pt-8 border-t-2 border-gray-200 mt-10">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-8 py-4 bg-gray-500 text-white rounded-2xl font-bold hover:bg-gray-600 transition-all duration-200 flex items-center space-x-3 shadow-lg transform hover:scale-105"
                      disabled={loading}
                    >
                      <X className="h-5 w-5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all duration-200 flex items-center space-x-3 shadow-lg transform hover:scale-105"
                      disabled={loading}
                    >
                      {loading ? (
                        <Sparkles className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <Save className="h-5 w-5" />
                      )}
                      <span>{loading ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;