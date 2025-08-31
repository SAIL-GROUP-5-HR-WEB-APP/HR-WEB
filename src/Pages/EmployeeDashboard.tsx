import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  LuClipboardList,
  LuClock10,
  LuClock6,
  LuThumbsUp,
  LuThumbsDown,
  LuCalendar,
  LuCheck,
  LuBaggageClaim,
  LuLogOut,
  LuPen,
  LuUserX,
  LuUserCheck,
} from "react-icons/lu";
import Api from "../Components/Reuseable/Api";
import { useNavigate, Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface LeaveRequest {
  id: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "hr" | "employee";
  verified: boolean;
  profile?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    department?: string;
    position?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
  };
}

const EmployeeDashboard = () => {
  const { id } = useParams(); // Get user ID from URL (e.g., /dashboard/:id)
  const [leaveType, setLeaveType] = useState<string>("sick");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<"ClockIn" | "ClockOut" | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [daysPresent, setDaysPresent] = useState<number>(0);
  const [daysAbsent, setDaysAbsent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Fetch user data, leave requests, and attendance summary
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !id) {
      navigate("/login", { replace: true });
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const res = await Api.get(`/api/v1/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // Update localStorage
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load user data");
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
        }
      }
    };

    // Fetch leave requests
    const fetchLeaveRequests = async () => {
      try {
        const res = await Api.get("/api/v1/leave/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formatted: LeaveRequest[] = res.data.map((r: any) => ({
          id: r._id,
          type: r.type,
          reason: r.reason,
          startDate: new Date(r.startDate).toISOString().split("T")[0],
          endDate: new Date(r.endDate).toISOString().split("T")[0],
          status: r.status,
        }));
        setLeaveRequests(formatted);
      } catch (err) {
        console.error("Failed to fetch leave requests", err);
      }
    };

    // Fetch attendance KPI
    const fetchAttendanceSummary = async () => {
      try {
        if (!id) {
          console.error("User ID missing, cannot fetch logs");
          return;
        }
        const res = await Api.get(
          `/api/v1/attendance/logs(protocol://localhost:3000logs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const logs = Array.isArray(res.data) ? res.data : [];
        const presentCount = logs.filter(
          (log: any) => log.status?.toLowerCase() === "present"
        ).length;
        const absentCount = logs.filter(
          (log: any) => log.status?.toLowerCase() === "absent"
        ).length;
        setDaysPresent(presentCount);
        setDaysAbsent(absentCount);
      } catch (err) {
        console.error("Failed to fetch attendance summary:", err);
        setDaysPresent(0);
        setDaysAbsent(0);
      }
    };

    fetchUser();
    fetchLeaveRequests();
    fetchAttendanceSummary();
  }, [id, navigate]);

  // Clock-in
  const handleClockIn = async () => {
    if (!navigator.geolocation)
      return MySwal.fire("Error", "Geolocation is not supported", "error");

    MySwal.fire({
      title: "Clocking in...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const token = localStorage.getItem("authToken");
          const res = await Api.post(
            "/api/v1/attendance/clock-in",
            { lat: latitude, long: longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.close();
          MySwal.fire(
            "Success",
            res.data.isWithinGeofence
              ? "Clock-In successful within office area!"
              : "Clock-In recorded outside geofence",
            "success"
          );
          setAttendance("ClockIn");
        } catch (err: any) {
          Swal.close();
          MySwal.fire(
            "Error",
            err.response?.data?.message || "Clock-In failed",
            "error"
          );
        }
      },
      (error) => {
        Swal.close();
        MySwal.fire("Error", "Unable to get your location", "error");
        console.error(error);
      }
    );
  };

  // Clock-out
  const handleClockOut = async () => {
    if (!navigator.geolocation)
      return MySwal.fire("Error", "Geolocation is not supported", "error");

    MySwal.fire({
      title: "Clocking out...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const token = localStorage.getItem("authToken");
          const res = await Api.post(
            "/api/v1/attendance/clock-out",
            { lat: latitude, long: longitude },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.close();
          MySwal.fire(
            "Success",
            res.data.isWithinGeofence
              ? "Clock-Out successful within office area!"
              : "Clock-Out recorded outside geofence",
            "success"
          );
          setAttendance("ClockOut");
        } catch (err: any) {
          Swal.close();
          MySwal.fire(
            "Error",
            err.response?.data?.message || "Clock-Out failed",
            "error"
          );
        }
      },
      (error) => {
        Swal.close();
        MySwal.fire("Error", "Unable to get your location", "error");
        console.error(error);
      }
    );
  };

  // Leave request submission
  const submitLeaveRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !startDate || !endDate)
      return MySwal.fire(
        "Missing fields",
        "Please fill all fields.",
        "warning"
      );
    if (new Date(endDate) < new Date(startDate))
      return MySwal.fire(
        "Invalid dates",
        "End date cannot be before start date.",
        "warning"
      );

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Auth token missing");
      const res = await Api.post(
        "/api/v1/leave/request",
        {
          type: leaveType,
          reason: leaveReason,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      MySwal.fire(
        "Success",
        res.data.message || "Leave request submitted",
        "success"
      );
      setLeaveRequests((prev) => [
        ...prev,
        {
          id: res.data._id || Date.now().toString(),
          type: leaveType,
          reason: leaveReason,
          startDate,
          endDate,
          status: "pending",
        },
      ]);
      setLeaveType("sick");
      setLeaveReason("");
      setStartDate("");
      setEndDate("");
    } catch (err: any) {
      MySwal.fire(
        "Error",
        err.response?.data?.message || err.message || "Leave request failed",
        "error"
      );
    }
  };

  // Logout
  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    MySwal.fire({
      title: "Logging out...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const token = localStorage.getItem("authToken");
      await Api.post(
        "/api/v1/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      Swal.close();
      MySwal.fire("Logged out!", "You have been logged out.", "success");
      navigate("/login", { replace: true });
    } catch (err: any) {
      Swal.close();
      MySwal.fire(
        "Error",
        err.response?.data?.message || "Logout failed",
        "error"
      );
    }
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Profile Section */}
      <header className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] transition-all duration-300 transform hover:scale-105 max-w-lg mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user?.profile?.avatarUrl ? (
                  <img
                    src={user.profile.avatarUrl}
                    alt="Profile"
                    className="h-16 w-16 rounded-full shadow"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full shadow bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-extrabold text-white">
                    {user?.firstName?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="text-gray-700">
                  <h1 className="text-2xl font-extrabold text-shadow">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-sm font-medium capitalize">
                    {user?.role || "Employee"}
                  </p>
                  <p className="text-xs opacity-80">
                    {user?.email || "No email found"}
                  </p>
                  {user?.profile && (
                    <div className="text-xs opacity-80 mt-1">
                      <p>
                        Department: {user.profile.department || "Not provided"}
                      </p>
                      <p>Position: {user.profile.position || "Not provided"}</p>
                      <p>Phone: {user.profile.phone || "Not provided"}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Link to="/settings">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-xl">
                    <LuPen size={15} />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-xl"
                >
                  <LuLogOut size={15} />
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
              value: daysPresent,
            },
            {
              icon: <LuUserX size={30} />,
              label: "Days Absent",
              value: daysAbsent,
            },
            {
              icon: <LuBaggageClaim size={30} />,
              label: "Leave Requests",
              value: leaveRequests.length,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="backdrop-blur-md p-6 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-700 to-indigo-400 transition-all"
            >
              <div className="text-white">{stat.icon}</div>
              <p className="text-sm font-medium text-white/80">{stat.label}</p>
              <h2 className="text-3xl font-extrabold text-white">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Attendance Section */}
        <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-8">
          <h2 className="font-extrabold text-xl md:text-2xl flex items-center space-x-2 text-gray-600 mb-6 justify-center">
            <LuClipboardList className="text-gray-600" size={28} />
            <span>Attendance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <button
              onClick={handleClockIn}
              className={`px-6 py-8 text-lg font-semibold flex flex-col items-center justify-center rounded-xl border border-white/20 transition-all duration-300 ${
                attendance === "ClockIn"
                  ? "bg-gradient-to-r from-green-500 to-green-700 text-white scale-105 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  : "bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:scale-105"
              }`}
            >
              <LuClock10 size={36} className="mb-2" /> Clock-In
            </button>
            <button
              onClick={handleClockOut}
              className={`px-6 py-8 text-lg font-semibold flex flex-col items-center justify-center rounded-xl border border-white/20 transition-all duration-300 ${
                attendance === "ClockOut"
                  ? "bg-gradient-to-r from-red-500 to-red-700 text-white scale-105 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:scale-105"
              }`}
            >
              <LuClock6 size={36} className="mb-2" /> Clock-Out
            </button>
          </div>
          {attendance && (
            <div
              className={`mt-6 text-center p-5 rounded-xl text-white animate-slide-up ${
                attendance === "ClockIn"
                  ? "bg-gradient-to-r from-green-500 to-green-700"
                  : "bg-gradient-to-r from-red-500 to-red-700"
              }`}
            >
              <p className="text-lg font-semibold flex flex-col items-center">
                {attendance === "ClockIn" ? (
                  <LuThumbsUp size={36} className="mb-2" />
                ) : (
                  <LuThumbsDown size={36} className="mb-2" />
                )}
                You have successfully{" "}
                {attendance === "ClockIn" ? "clocked in" : "clocked out"} today
              </p>
            </div>
          )}
        </section>

        {/* Leave Form & History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Leave Form */}
          <section className="backdrop-blur-md p-6 rounded-2xl border border-indigo-800">
            <h2 className="font-extrabold text-xl md:text-2xl flex items-center space-x-2 text-gray-600 mb-6">
              <LuCalendar className="text-gray-600" size={28} />
              <span>Request Leave</span>
            </h2>
            <form onSubmit={submitLeaveRequest} className="space-y-4">
              <div>
                <label
                  htmlFor="leaveType"
                  className="text-sm font-medium text-white/80"
                >
                  Leave Type
                </label>
                <select
                  id="leaveType"
                  className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={leaveType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setLeaveType(e.target.value)
                  }
                >
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="annual">Annual Leave</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="leaveReason"
                  className="text-sm font-medium text-white/80"
                >
                  Reason for Leave
                </label>
                <input
                  id="leaveReason"
                  type="text"
                  placeholder="Enter reason for leave"
                  className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                    className="text-sm font-medium text-white/80"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={startDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStartDate(e.target.value)
                    }
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium text-white/80"
                  >
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full bg-transparent border border-indigo-300 px-4 py-3 rounded-md text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    value={endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEndDate(e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-2xl"
              >
                Submit Leave Request
              </button>
            </form>
          </section>

          {/* Leave History */}
          <section className="p-6 rounded-2xl border border-indigo-800 overflow-y-scroll">
            <h2 className="font-extrabold text-xl md:text-2xl text-gray-600 mb-6">
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
                        <p className="font-semibold text-gray-500">
                          {req.type} - {req.reason}
                        </p>
                        <p className="text-sm text-gray-600">
                          {req.startDate} → {req.endDate}
                        </p>
                        <p className="text-xs font-medium mt-1">
                          Status:{" "}
                          <span
                            className={
                              req.status === "pending"
                                ? "text-yellow-400"
                                : req.status === "approved"
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </p>
                      </div>
                      {req.status === "approved" && (
                        <LuCheck
                          className="text-green-400 animate-check"
                          size={24}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <style>{`
        @keyframes pulse-once {0% { opacity: 0.8; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); }}
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes check { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .animate-pulse-once { animation: pulse-once 0.5s ease-in-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-in-out; }
        .animate-check { animation: check 0.3s ease-in-out; }
        .text-shadow { text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
