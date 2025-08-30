import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
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

const SingleEmployeedetails = () => {
  const { id } = useParams();
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
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#5B5CE6" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <p className="text-red-500 font-semibold">{error}</p>
        <button
          onClick={fetchUser}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Employee Details
      </h1>

      <section className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
        {/* Avatar */}
        {user.profile?.avatarUrl ? (
          <img
            src={user.profile.avatarUrl}
            alt="User Avatar"
            className="h-24 w-24 rounded-full object-cover mb-4"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex justify-center items-center text-white text-4xl font-bold mb-4">
            {user.firstName?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Name & Email */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-500 mb-6">{user.email}</p>

        {/* Role */}
        <p className="text-sm text-gray-600 mb-4">
          Role: <span className="font-medium">{user.role}</span>
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left w-full max-w-md">
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-800">
              {user.profile?.phone || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-gray-800">
              {user.profile?.address || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium text-gray-800">
              {user.profile?.department || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-medium text-gray-800">
              {user.profile?.position || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Emergency Contact</p>
            <p className="font-medium text-gray-800">
              {user.profile?.emergencyContact || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium text-gray-800">
              {user.profile?.dateOfBirth
                ? new Date(user.profile.dateOfBirth).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Documents</p>
            <ul className="list-disc list-inside text-gray-800">
              {user.profile?.documents?.length
                ? user.profile.documents.map((doc, idx) => (
                    <li key={idx}>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        Document {idx + 1}
                      </a>
                    </li>
                  ))
                : "No documents uploaded"}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleEmployeedetails;
