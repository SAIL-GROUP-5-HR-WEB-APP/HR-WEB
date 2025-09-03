import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaBriefcase,
  FaExclamationCircle,
  FaBirthdayCake,
  FaCity,
  FaGlobeAmericas,
  FaFileAlt,
} from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Api from "../Components/Reuseable/Api";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    department?: string;
    position?: string;
    emergencyContact?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    documents?: string[];
  };
}

const SingleEmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!id) return setError("No user ID provided.");
    setLoading(true);
    setError(null);

    try {
      const res = await Api.get<Employee>(`/api/v1/users/${id}`);
      console.log("API response:", res.data);
      setUser(res.data);
    } catch (err: any) {
      console.error("Error fetching user:", err);
      if (err.response?.status === 404) {
        setError("User not found.");
      } else {
        setError("Failed to fetch user. Please try again.");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-gray-50">
        <ClipLoader color="#6366f1" size={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-gray-50 gap-6">
        <p className="text-red-500 font-semibold text-xl animate-pulse">
          {error}
        </p>
        <button
          onClick={fetchUser}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-gray-50">
        <p className="text-red-500 font-semibold text-xl">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-gray-50 py-16 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-indigo-700 hover:text-indigo-900 mb-12 transition-all duration-300 font-medium text-lg"
        >
          <FiArrowLeft
            className="group-hover:-translate-x-2 transition-transform duration-300"
            size={28}
          />
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 rounded-t-3xl p-8 text-white text-center shadow-2xl">
          <h1 className="text-5xl font-bold tracking-wide">Employee Profile</h1>
          <p className="text-lg opacity-80 mt-2">Detailed Information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-b-3xl shadow-2xl -mt-4 p-10 relative z-10 transform transition-all duration-500 hover:shadow-3xl">
          <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8 lg:mb-0">
              {user.profile?.avatarUrl ? (
                <img
                  src={user.profile.avatarUrl}
                  alt="User Avatar"
                  className="h-48 w-48 rounded-full object-cover shadow-xl ring-4 ring-indigo-200 hover:ring-indigo-400 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                  onError={(e) => {
                    console.error(
                      "Image load failed:",
                      user.profile?.avatarUrl
                    );
                    (e.target as HTMLImageElement).src =
                      "/placeholder-avatar.png";
                  }}
                />
              ) : (
                <div className="h-48 w-48 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-6xl font-bold shadow-xl ring-4 ring-indigo-200 hover:ring-indigo-400 transition-all duration-300 transform hover:scale-110 hover:rotate-3">
                  {user.firstName?.charAt(0).toUpperCase()}
                  {user.lastName?.charAt(0).toUpperCase() || ""}
                </div>
              )}
              <h2 className="text-3xl font-semibold text-gray-800 mt-6 mb-2">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 text-lg mb-4">{user.email}</p>
              <span className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-full font-medium text-sm uppercase tracking-wide">
                {user.role}
              </span>
            </div>

            {/* Details Section */}
            <div className="flex-1 w-full mt-8 lg:mt-0">
              {/* Personal Info */}
              <section className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <FaBirthdayCake className="text-indigo-500" />,
                      label: "Date of Birth",
                      value: user.profile?.dateOfBirth
                        ? new Date(
                            user.profile.dateOfBirth
                          ).toLocaleDateString()
                        : "N/A",
                    },
                    {
                      icon: <FaExclamationCircle className="text-indigo-500" />,
                      label: "Emergency Contact",
                      value: user.profile?.emergencyContact || "N/A",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-xl hover:bg-indigo-100/50 transition-colors duration-300"
                    >
                      <div className="p-2 bg-white rounded-full shadow-md">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 font-medium block">
                          {item.label}
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contact Info */}
              <section className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <FaPhoneAlt className="text-indigo-500" />,
                      label: "Phone",
                      value: user.profile?.phone || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-indigo-500" />,
                      label: "Address",
                      value: user.profile?.address || "N/A",
                    },
                    {
                      icon: <FaCity className="text-indigo-500" />,
                      label: "City",
                      value: user.profile?.city || "N/A",
                    },
                    {
                      icon: <FaMapMarkerAlt className="text-indigo-500" />,
                      label: "State",
                      value: user.profile?.state || "N/A",
                    },
                    {
                      icon: <FaGlobeAmericas className="text-indigo-500" />,
                      label: "Country",
                      value: user.profile?.country || "N/A",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-xl hover:bg-indigo-100/50 transition-colors duration-300"
                    >
                      <div className="p-2 bg-white rounded-full shadow-md">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 font-medium block">
                          {item.label}
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Work Info */}
              <section className="mb-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2">
                  Work Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: <FaBuilding className="text-indigo-500" />,
                      label: "Department",
                      value: user.profile?.department || "N/A",
                    },
                    {
                      icon: <FaBriefcase className="text-indigo-500" />,
                      label: "Position",
                      value: user.profile?.position || "N/A",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-xl hover:bg-indigo-100/50 transition-colors duration-300"
                    >
                      <div className="p-2 bg-white rounded-full shadow-md">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 font-medium block">
                          {item.label}
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-indigo-100 pb-2">
                  Documents
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {user.profile?.documents?.length ? (
                    user.profile.documents.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-xl hover:bg-indigo-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="p-2 bg-white rounded-full shadow-md">
                          <FaFileAlt className="text-indigo-500" />
                        </div>
                        <span className="text-indigo-700 font-medium hover:underline">
                          Document {idx + 1}
                        </span>
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-6 bg-indigo-50/50 rounded-xl">
                      No documents uploaded
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default SingleEmployeeDetails;
