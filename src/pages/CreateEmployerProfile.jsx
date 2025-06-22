import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Building, // Changed icon for company
  Mail,
  Globe,
  MapPin,
  Upload,
  X,
  Sparkles,
  User as UserIcon, // Renamed to avoid conflict with `User` component if used
} from "lucide-react";

// Yup validation schema for Employer Profile
const schema = Yup.object().shape({
  company_name: Yup.string()
    .required("Company name is required")
    .max(255, "Company name must be at most 255 characters"),
  company_logo: Yup.mixed()
    .nullable()
    .test("fileSize", "Company logo is too large (max 2MB)", (value) => {
      if (!value || !value[0]) return true; // allow null or no file
      return value[0].size <= 2048 * 1024; // 2MB
    })
    .test("fileType", "Invalid company logo type (jpeg, png, jpg, gif)", (value) => {
      if (!value || !value[0]) return true;
      return ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(value[0].type);
    }),
  company_description: Yup.string().nullable(),
  website_url: Yup.string()
    .nullable()
    .url("Website URL must be a valid URL")
    .max(500, "Website URL must be at most 500 characters"),
  industry: Yup.string().nullable().max(255, "Industry must be at most 255 characters"),
  company_size: Yup.string().nullable().max(100, "Company size must be at most 100 characters"),
  location: Yup.string().nullable().max(255, "Location must be at most 255 characters"),
  contact_person_name: Yup.string()
    .nullable()
    .max(255, "Contact person name must be at most 255 characters"),
  contact_email: Yup.string()
    .nullable()
    .email("Contact email must be a valid email address")
    .max(255, "Contact email must be at most 255 characters"),
  phone_number: Yup.string().nullable().max(20, "Phone number must be at most 20 characters"),
  // is_verified: Yup.boolean().nullable(), // ليس هناك حاجة للتحقق من النوع هنا بالضبط، سنرسلها كـ '1' أو '0'
});

const CreateEmployerProfile = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: "",
      company_description: "",
      website_url: "",
      industry: "",
      company_size: "",
      location: "",
      contact_person_name: "",
      contact_email: "",
      phone_number: "",
      is_verified: false, // القيمة الافتراضية هنا مهمة
    },
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Preview company logo
  const companyLogoFile = watch("company_logo");
  useEffect(() => {
    if (companyLogoFile && companyLogoFile[0]) {
      setPreviewLogo(URL.createObjectURL(companyLogoFile[0]));
    } else {
      setPreviewLogo(null);
    }
  }, [companyLogoFile]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("access-token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "company_logo") {
        if (data[key] && data[key][0]) {
          formData.append(key, data[key][0]);
        }
      } else if (key === "is_verified") { // <--- التعديل الرئيسي هنا
        formData.append(key, data[key] ? '1' : '0'); // إرسال '1' إذا كانت true، و '0' إذا كانت false
      }
      else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.post("http://localhost:8000/api/employer-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      // You might want to store a flag in local storage for employer profile creation too
      localStorage.setItem("employerProfileCreated", "true");
      navigate("/employer-profile"); // Navigate to the employer profile view
    } catch (err) {
      let errorMsg = "Failed to create employer profile. Please try again.";
      if (err.response) {
        if (err.response.status === 409) {
          errorMsg = "Employer profile already exists.";
          localStorage.setItem("employerProfileCreated", "true");
          navigate("/employer-profile"); // Navigate if profile already exists
        } else if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.data?.errors) { // معالجة الأخطاء التفصيلية من Laravel
            const backendErrors = err.response.data.errors;
            if (backendErrors.is_verified) {
                errorMsg = backendErrors.is_verified[0]; // عرض أول خطأ لحقل is_verified
            } else {
                errorMsg = Object.values(backendErrors).flat().join(", "); // جمع كل الأخطاء الأخرى
            }
        }
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 rounded-full animate-spin animation-delay-150"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 w-8 h-8 animate-pulse" />
        </div>
        <p className="ml-6 text-gray-800 text-xl font-medium animate-pulse">
          Loading employer profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#FFF5F5",
            borderLeft: "8px solid #E63946",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#E63946",
              borderRadius: "50%",
              padding: "0.5rem",
              marginRight: "1rem",
            }}
          >
            <X style={{ width: "1.5rem", height: "1.5rem", color: "#FFFFFF" }} />
          </div>
          <div>
            <h3
              style={{
                color: "#E63946",
                fontWeight: "bold",
                fontSize: "1.125rem",
              }}
            >
              Error
            </h3>
            <p
              style={{
                color: "#E63946",
                marginTop: "0.25rem",
              }}
            >
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        padding: "3rem 1rem",
      }}
    >
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #4285F4, #2A68C6)", // Blue gradient for employer
            borderRadius: "1.5rem",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            marginBottom: "2.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Building // Changed icon
              style={{
                width: "2rem",
                height: "2rem",
                color: "#FFFFFF",
                marginRight: "1rem",
              }}
            />
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: "0.5px",
              }}
            >
              Create Employer Profile
            </h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            background: "#FFFFFF",
            borderRadius: "1.5rem",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            border: "1px solid #A8A8A8",
            padding: "2.5rem",
            gap: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Company Information */}
          <div>
            <h4
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#4285F4", // Blue color
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Building // Changed icon
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#4285F4",
                  marginRight: "0.75rem",
                }}
              />
              Company Information
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
              }}
            >
              {[
                { label: "Company Name", name: "company_name", type: "text" },
                { label: "Company Description", name: "company_description", type: "textarea" },
                { label: "Website URL", name: "website_url", type: "text" },
                { label: "Industry", name: "industry", type: "text" },
                { label: "Company Size", name: "company_size", type: "text" },
                { label: "Location", name: "location", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "#A8A8A8",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {label}
                  </label>
                  {type === "textarea" ? (
                    <textarea
                      {...register(name)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #A8A8A8",
                        borderRadius: "0.75rem",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                        height: "6rem",
                      }}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type="text"
                      {...register(name)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "2px solid #A8A8A8",
                        borderRadius: "0.75rem",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  )}
                  {errors[name] && (
                    <p
                      style={{
                        color: "#E63946",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors[name].message}
                    </p>
                  )}
                </div>
              ))}
              <div
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: "#A8A8A8",
                    marginBottom: "0.5rem",
                  }}
                >
                  Company Logo
                </label>
                {previewLogo && (
                  <div
                    style={{
                      marginBottom: "1rem",
                    }}
                  >
                    <img
                      src={previewLogo}
                      alt="Logo preview"
                      style={{
                        width: "8rem",
                        height: "8rem",
                        objectFit: "contain", // Use contain for logos
                        borderRadius: "0.75rem",
                        border: "4px solid #A8A8A8",
                      }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  {...register("company_logo")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #A8A8A8",
                    borderRadius: "0.75rem",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                  }}
                />
                 {errors.company_logo && (
                    <p
                      style={{
                        color: "#E63946",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors.company_logo.message}
                    </p>
                  )}
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    color: "#A8A8A8",
                    marginBottom: "0.5rem",
                  }}
                >
                  Is Verified
                </label>
                <input
                  type="checkbox"
                  {...register("is_verified")}
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    accentColor: "#4285F4", // Blue color
                    border: "2px solid #A8A8A8",
                    borderRadius: "0.25rem",
                  }}
                />
                {errors.is_verified && (
                  <p
                    style={{
                      color: "#E63946",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {errors.is_verified.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Person Information */}
          <div>
            <h4
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                color: "#4285F4", // Blue color
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <UserIcon // Changed icon
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  color: "#4285F4",
                  marginRight: "0.75rem",
                }}
              />
              Contact Person Information
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
              }}
            >
              {[
                { label: "Contact Person Name", name: "contact_person_name", type: "text" },
                { label: "Contact Email", name: "contact_email", type: "text" },
                { label: "Phone Number", name: "phone_number", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "bold",
                      color: "#A8A8A8",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    {...register(name)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #A8A8A8",
                      borderRadius: "0.75rem",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                    }}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  {errors[name] && (
                    <p
                      style={{
                        color: "#E63946",
                        fontSize: "0.875rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {errors[name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 2rem",
                background: loading ? "#A8A8A8" : "#4285F4", // Blue color for button
                color: "#FFFFFF",
                borderRadius: "0.75rem",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = "#2A68C6")} // Darker blue on hover
              onMouseOut={(e) => !loading && (e.target.style.background = "#4285F4")}
            >
              {loading ? (
                <span
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    border: "2px solid #FFFFFF",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <Building style={{ width: "1.25rem", height: "1.25rem" }} /> // Changed icon
              )}
              <span>{loading ? "Creating..." : "Create Profile"}</span>
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          input:focus, textarea:focus {
            border-color: #4285F4; /* Blue focus color */
            box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
          }
          button:hover:not(:disabled) {
            transform: scale(1.05);
          }
        `}
      </style>
    </div>
  );
};

export default CreateEmployerProfile;