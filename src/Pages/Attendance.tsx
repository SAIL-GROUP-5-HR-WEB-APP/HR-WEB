// src/pages/AdminAttendancePage.tsx
import React, { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api";
import { MapPin, Clock, User } from "lucide-react";

interface Attendance {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  clockIn: string;
  clockOut: string;
  status: string;
  location: {
    lat: number;
    long: number;
    isWithinGeofence: boolean;
  };
}

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await Api.get("/api/v1/attendance/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendance(res.data);
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-xl animate-pulse">
        Loading attendance...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-black mb-6">Attendance Records</h1>

      {/* Card Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {attendance.map((log) => (
          <div
            key={log._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition transform hover:scale-[1.02]"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-400 p-3 rounded-full">
                <User className="text-indigo-600" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {log.userId?.firstName} {log.userId?.lastName}
              </h2>
            </div>

            {/* Clock In / Out */}
            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-600" />
                <span>
                  <span className="text-gray-600">Clock-In:</span>{" "}
                  {log.clockIn ? new Date(log.clockIn).toLocaleString() : "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-red-600" />
                <span>
                  <span className="text-gray-800">Clock-Out:</span>{" "}
                  {log.clockOut ? new Date(log.clockOut).toLocaleString() : "—"}
                </span>
              </div>
            </div>

            {/* Location + Status */}
            <div className="mt-4 flex items-center ">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  log.status === "present"
                    ? "bg-green-800 text-white"
                    : "bg-red-800 text-white"
                }`}
              >
                {log.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attendance;
