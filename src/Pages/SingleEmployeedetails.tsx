import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

interface Employee {
  _id: string;
  username: string;
  bio?: string;
  address?: string;
  age?: number;
  email: string;
  status: "online" | "offline";
  avatar?: string;
}

const SingleEmployeedetails = () => {
  const { id } = useParams();
  const [getSingleUser, setGetSingleUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const singleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<{ data: Employee }>(
        `https://user-data-ci61.onrender.com/user/viewoneuser/${id}`
      );
      setGetSingleUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setGetSingleUser(null);
      setError("Failed to fetch user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) singleData();
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
          onClick={singleData}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!getSingleUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10 flex flex-col justify-center items-centers">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        User Detail
      </h1>

      <section className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex justify-center items-center text-white text-4xl font-bold mb-4">
          {getSingleUser.username?.charAt(0).toUpperCase()}
        </div>

        {/* Name & Email */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {getSingleUser.username}
        </h2>
        <p className="text-gray-500 mb-6">{getSingleUser.email}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left w-full max-w-md">
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-gray-800">
              {getSingleUser.address || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Age</p>
            <p className="font-medium text-gray-800">
              {getSingleUser.age ?? "N/A"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-500">Bio</p>
            <p className="font-medium text-gray-800">
              {getSingleUser.bio || "No bio provided."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleEmployeedetails;
