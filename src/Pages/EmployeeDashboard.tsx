import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import {
  LuClipboardList,
  LuUserX,
  LuUserCheck,
  LuThumbsUp,
  LuThumbsDown,
  LuCalendar,
  LuCheck,
  LuBaggageClaim,
  LuLogOut,
  LuPen, // Added for edit icon
} from "react-icons/lu";
import Api from "../Components/Reuseable/Api";
import { useNavigate } from "react-router-dom";

interface LeaveRequest {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
}

const EmployeeDashboard = () => {
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<"Present" | "Absent" | null>(
    null
  );

  const [user, setUser] = useState<{
    firstname: string;
    email: string;
    role?: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const submitLeaveRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !startDate || !endDate) return;

    const newRequest: LeaveRequest = {
      id: Date.now(),
      reason: leaveReason,
      startDate,
      endDate,
    };

    setLeaveRequests([...leaveRequests, newRequest]);
    setLeaveReason("");
    setStartDate("");
    setEndDate("");
  };

  const handleLogout = async () => {
    try {
      await Api.post("/api/v1/auth/logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error: any) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handleEditProfile = () => {
    navigate("/setting"); // Navigate to edit profile page
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-100 to-gray-100">
      {/* Profile Section */}
      <header className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] transition-all duration-300 transform hover:scale-[1.02] max-w-md mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-extrabold text-white">
                  {user?.firstname
                    ? user.firstname.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="text-gray-800">
                  <h1 className="text-2xl font-extrabold text-shadow">
                    {user?.firstname || "Employee"}
                  </h1>
                  <p className="text-sm font-medium text-gray-600">
                    {user?.role || "Employee Role"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "No email found"}
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleEditProfile}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:rounded-xl shadow-sm hover:shadow-md"
                  aria-label="Edit Profile"
                >
                  <LuPen size={15} />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:rounded-xl shadow-sm hover:shadow-md"
                  aria-label="Log out"
                >
                  <LuLogOut size={15} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {[
            {
              icon: <LuUserCheck size={30} />,
              label: "Days Present",
              value: 0,
              color: "text-white",
            },
            {
              icon: <LuUserX size={30} />,
              label: "Days Absent",
              value: 0,
              color: "text-white",
            },
            {
              icon: <LuBaggageClaim size={30} />,
              label: "Leave Requests",
              value: leaveRequests.length,
              color: "text-white",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`backdrop-blur-md p-6 rounded-2xl border border-white/20 animate-pulse-once bg-gradient-to-r from-indigo-600 to-purple-500 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300`}
            >
              <div className="text-white">{stat.icon}</div>
              <p className="text-sm font-medium text-white/80">{stat.label}</p>
              <h2 className={`text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Attendance Section */}
        <section className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl border border-white/20 mb-8 shadow-sm">
          <h2 className="font-extrabold text-xl md:text-2xl flex items-center space-x-2 text-gray-700 mb-6 justify-center">
            <LuClipboardList className="text-gray-700" size={28} />
            <span>Attendance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <button
              onClick={() => setAttendance("Present")}
              className={`px-6 py-8 text-lg font-semibold flex flex-col items-center justify-center rounded-xl border border-white/20 transition-all duration-300 ${
                attendance === "Present"
                  ? "bg-gradient-to-r from-green-500 to-green-700 text-white scale-105 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:scale-105"
              }`}
              aria-label="Mark as Present"
            >
              <LuUserCheck size={36} className="mb-2" />
              Present
            </button>
            <button
              onClick={() => setAttendance("Absent")}
              className={`px-6 py-8 text-lg font-semibold flex flex-col items-center justify-center rounded-xl border border-white/20 transition-all duration-300 ${
                attendance === "Absent"
                  ? "bg-gradient-to-r from-red-500 to-red-700 text-white scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105"
              }`}
              aria-label="Mark as Absent"
            >
              <LuUserX size={36} className="mb-2" />
              Absent
            </button>
          </div>

          {attendance && (
            <div
              className={`mt-6 text-center p-5 rounded-xl text-white animate-slide-up ${
                attendance === "Present"
                  ? "bg-gradient-to-r from-green-500 to-green-700"
                  : "bg-gradient-to-r from-red-500 to-red-700"
              }`}
            >
              <p className="text-lg font-semibold flex flex-col items-center">
                {attendance === "Present" ? (
                  <LuThumbsUp size={36} className="mb-2" />
                ) : (
                  <LuThumbsDown size={36} className="mb-2" />
                )}
                You have been marked {attendance} for today
              </p>
            </div>
          )}
        </section>

        {/* Leave Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Leave Form */}
          <section className="backdrop-blur-lg p-6 rounded-2xl border border-indigo-800 bg-white/90 shadow-sm">
            <h2 className="font-extrabold text-xl md:text-2xl flex items-center space-x-2 text-gray-700 mb-6">
              <LuCalendar className="text-gray-700" size={28} />
              <span>Request Leave</span>
            </h2>
            <form onSubmit={submitLeaveRequest} className="space-y-4">
              <div>
                <label
                  htmlFor="leaveReason"
                  className="text-sm font-medium text-gray-700"
                >
                  Reason for Leave
                </label>
                <input
                  id="leaveReason"
                  type="text"
                  placeholder="Enter reason for leave"
                  className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={leaveReason}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLeaveReason(e.target.value)
                  }
                  aria-required="true"
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={startDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStartDate(e.target.value)
                    }
                    aria-required="true"
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEndDate(e.target.value)
                    }
                    aria-required="true"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-xl shadow-sm hover:shadow-md"
                aria-label="Submit Leave Request"
              >
                Submit Leave Request
              </button>
            </form>
          </section>

          {/* Leave History */}
          <section className="p-6 rounded-2xl border border-indigo-800 bg-white/90 shadow-sm">
            <h2 className="font-extrabold text-xl md:text-2xl text-gray-700 mb-6">
              Pending Leave Requests
            </h2>
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500 text-center text-sm">
                No leave requests submitted.
              </p>
            ) : (
              <ul className="space-y-4">
                {leaveRequests.map((req) => (
                  <li
                    key={req.id}
                    className="p-4 border border-white/20 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-200 animate-slide-up"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-600">
                          {req.reason}
                        </p>
                        <p className="text-sm text-gray-500">
                          {req.startDate} → {req.endDate}
                        </p>
                      </div>
                      <LuCheck
                        className="text-green-400 animate-check"
                        size={24}
                        aria-label="Approved"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* Custom Animations */}
      <style>{`
        @keyframes pulse-once {
          0% { opacity: 0.8; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes check {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-in-out;
        }
        .animate-check {
          animation: check 0.3s ease-in-out;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
