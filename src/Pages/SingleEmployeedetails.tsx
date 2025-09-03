import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-gray-50">
        <ClipLoader color="#9333ea" size={80} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-gray-50 gap-6">
        <p className="text-red-500 font-semibold text-xl animate-pulse">
          {error}
        </p>
        <button
          onClick={fetchUser}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-gray-50">
        <p className="text-red-500 font-semibold text-xl">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-purple-600 hover:text-purple-800 mb-10 transition-all duration-300"
        >
          <FiArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={28}
          />
          <span className="font-semibold text-lg">Back to List</span>
        </button>

        {/* Header */}
        <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 mb-12 animate-fade-in">
          Employee Profile
        </h1>

        {/* Employee Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-indigo-100/50 transform hover:shadow-3xl transition-all duration-300">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            {user.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt="User Avatar"
                className="h-48 w-48 rounded-full object-cover border-4 border-gradient-to-r from-indigo-100 to-purple-100 shadow-lg mb-8 hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error("Image load failed:", user.profile?.avatarUrl);
                  (e.target as HTMLImageElement).src =
                    "/placeholder-avatar.png"; // Fallback image
                }}
              />
            ) : (
              <div className="h-48 w-48 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold mb-8 shadow-lg hover:scale-105 transition-transform duration-300">
                {user.firstName?.charAt(0).toUpperCase()}
                {user.lastName?.charAt(0).toUpperCase() || ""}
              </div>
            )}

            {/* Name & Email */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600 text-xl mt-3">{user.email}</p>
            </div>

            {/* Role Badge */}
            <span className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-lg font-semibold mb-10 animate-pulse-slow">
              {user.role}
            </span>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                { label: "Phone", value: user.profile?.phone || "N/A" },
                { label: "Address", value: user.profile?.address || "N/A" },
                { label: "City", value: user.profile?.city || "N/A" },
                { label: "State", value: user.profile?.state || "N/A" },
                { label: "Country", value: user.profile?.country || "N/A" },
                {
                  label: "Department",
                  value: user.profile?.department || "N/A",
                },
                { label: "Position", value: user.profile?.position || "N/A" },
                {
                  label: "Emergency Contact",
                  value: user.profile?.emergencyContact || "N/A",
                },
                {
                  label: "Date of Birth",
                  value: user.profile?.dateOfBirth
                    ? new Date(user.profile.dateOfBirth).toLocaleDateString()
                    : "N/A",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-white/50 to-indigo-50/50 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <span className="text-sm text-gray-500 font-medium">
                    {item.label}
                  </span>
                  <span className="text-gray-900 font-semibold text-lg mt-1 block">
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Documents */}
              <div className="md:col-span-2 lg:col-span-3">
                <span className="text-sm text-gray-500 font-medium">
                  Documents
                </span>
                <ul className="mt-3 space-y-3">
                  {user.profile?.documents?.length ? (
                    user.profile.documents.map((doc, idx) => (
                      <li
                        key={idx}
                        className="bg-gradient-to-br from-white/50 to-indigo-50/50 p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-purple-700 font-medium text-lg hover:underline transition-colors"
                        >
                          Document {idx + 1}
                        </a>
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-600 text-lg">
                      No documents uploaded
                    </span>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
        .border-gradient-to-r {
          border-image: linear-gradient(to right, #a78bfa, #9333ea) 1;
        }
      `}</style>
    </div>
  );
};

export default SingleEmployeeDetails;
