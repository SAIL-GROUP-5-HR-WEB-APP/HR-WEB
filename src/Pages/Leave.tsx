import React, { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api";
import {
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface Leave {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const AdminLeavePage: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get<Leave[]>("/api/v1/leave/all");
      setLeaves(data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await Api.patch(`/api/v1/leave/approve/${id}`);
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: "approved" } : leave
        )
      );
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await Api.patch(`/api/v1/leave/reject/${id}`);
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: "rejected" } : leave
        )
      );
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Filter leaves based on search term
  const filteredLeaves = leaves.filter(
    (leave) =>
      `${leave.userId.firstName} ${leave.userId.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return <p className="text-center py-6 text-gray-600">Loading leaves...</p>;
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  const renderTable = (
    title: string,
    status: "pending" | "approved" | "rejected",
    icon: React.ReactNode
  ) => {
    const filtered = filteredLeaves.filter((leave) => leave.status === status);

    return (
      <div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No {status} requests.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-left">
                <tr>
                  <th className="p-4 font-medium text-gray-700">Employee</th>
                  <th className="p-4 font-medium text-gray-700">Type</th>
                  <th className="p-4 font-medium text-gray-700">Dates</th>
                  <th className="p-4 font-medium text-gray-700">Reason</th>
                  <th className="p-4 font-medium text-gray-700">Status</th>
                  {status === "pending" && (
                    <th className="p-4 font-medium text-gray-700">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((leave) => (
                  <tr
                    key={leave._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-800">
                      {leave.userId?.firstName} {leave.userId?.lastName}
                    </td>
                    <td className="p-4 text-gray-800 capitalize">
                      {leave.type}
                    </td>
                    <td className="p-4 text-gray-800">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-800">{leave.reason || "-"}</td>
                    <td
                      className={`p-4 font-medium ${
                        leave.status === "pending"
                          ? "text-yellow-600"
                          : leave.status === "approved"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {leave.status.charAt(0).toUpperCase() +
                        leave.status.slice(1)}
                    </td>
                    {status === "pending" && (
                      <td className="p-4 flex gap-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleApprove(leave._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleReject(leave._id)}
                        >
                          Reject
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-10 bg-gradient-to-br from-indigo-50 via-purple-50 to-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <FaClock className="text-indigo-600" />
          Leave Requests Management
        </h2>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, type, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-1/2 p-4 pl-12 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-md transition-all duration-300 placeholder-gray-400"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {renderTable(
          "⏳ Pending Requests",
          "pending",
          <FaClock className="text-yellow-600" />
        )}
        {renderTable(
          "✅ Approved Requests",
          "approved",
          <FaCheckCircle className="text-green-600" />
        )}
        {renderTable(
          "❌ Rejected Requests",
          "rejected",
          <FaTimesCircle className="text-red-600" />
        )}
      </div>
    </div>
  );
};

export default AdminLeavePage;
