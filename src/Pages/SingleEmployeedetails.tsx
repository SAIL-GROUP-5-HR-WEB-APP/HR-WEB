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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <ClipLoader color="#6366f1" size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 gap-6">
        <p className="text-red-600 font-medium text-lg animate-pulse">
          {error}
        </p>
        <button
          onClick={fetchUser}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <p className="text-red-600 font-medium text-lg">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8 transition-all duration-300"
        >
          <FiArrowLeft
            className="group-hover:-translate-x-1 transition-transform"
            size={24}
          />
          <span className="font-medium">Back to List</span>
        </button>

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Employee Profile
        </h1>

        {/* Employee Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            {user.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt="User Avatar"
                className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100 shadow-md mb-6"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-md">
                {user.firstName?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name & Email */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 mb-4 text-lg">{user.email}</p>

            {/* Role */}
            <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              {user.role}
            </span>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              {[
                { label: "Phone", value: user.profile?.phone || "N/A" },
                { label: "Address", value: user.profile?.address || "N/A" },
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
                <div key={idx} className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    {item.label}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Documents */}
              <div className="sm:col-span-2">
                <span className="text-sm text-gray-500 font-medium">
                  Documents
                </span>
                <ul className="mt-2 space-y-2">
                  {user.profile?.documents?.length ? (
                    user.profile.documents.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                        >
                          Document {idx + 1}
                        </a>
                      </li>
                    ))
                  ) : (
                    <span className="text-gray-600">No documents uploaded</span>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEmployeeDetails;
