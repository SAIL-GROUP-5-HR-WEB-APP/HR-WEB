// src/pages/admin/AdminLeavePage.tsx
import React, { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api";

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

  if (loading) return <p className="text-center py-6">Loading leaves...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const renderTable = (
    title: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    const filtered = leaves.filter((leave) => leave.status === status);

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        {filtered.length === 0 ? (
          <p className="text-gray-500">No {status} requests.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Status</th>
                  {status === "pending" && <th className="p-3">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((leave) => (
                  <tr key={leave._id} className="border-b">
                    <td className="p-3">
                      {leave.userId?.firstName} {leave.userId?.lastName}
                    </td>
                    <td className="p-3 capitalize">{leave.type}</td>
                    <td className="p-3">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{leave.reason || "-"}</td>
                    <td
                      className={`p-3 font-semibold ${
                        leave.status === "pending"
                          ? "text-yellow-500"
                          : leave.status === "approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {leave.status}
                    </td>
                    {status === "pending" && (
                      <td className="p-3 flex gap-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-2xl"
                          onClick={() => handleApprove(leave._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-2xl"
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Leave Requests</h2>
      {renderTable("⏳ Pending Requests", "pending")}
      {renderTable("✅ Approved Requests", "approved")}
      {renderTable("❌ Rejected Requests", "rejected")}
    </div>
  );
};

export default AdminLeavePage;
