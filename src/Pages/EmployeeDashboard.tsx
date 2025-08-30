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
  LuPen,
} from "react-icons/lu";
import Api from "../Components/Reuseable/Api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface LeaveRequest {
  id: number;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
}

const EmployeeDashboard = () => {
  const [leaveType, setLeaveType] = useState<string>("Sick Leave");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<"Present" | "Absent" | null>(
    null
  );

  // ✅ User state
  const [user, setUser] = useState<{
    firstname: string;
    email: string;
    role?: string;
  } | null>(null);

  const navigate = useNavigate();

  // ✅ On mount, check localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login", { replace: true }); // route guard
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // ✅ Submit Leave Request API call
  const submitLeaveRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!leaveReason || !startDate || !endDate || !leaveType) return;

    try {
      const res = await Api.post("/api/v1/leave/request", {
        type: leaveType,
        reason: leaveReason,
        startDate,
        endDate,
      });

      MySwal.fire("Success", res.data.message, "success");

      const newRequest: LeaveRequest = {
        id: Date.now(),
        type: leaveType,
        reason: leaveReason,
        startDate,
        endDate,
      };

      setLeaveRequests([...leaveRequests, newRequest]);
      setLeaveType("Sick Leave");
      setLeaveReason("");
      setStartDate("");
      setEndDate("");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Leave request failed",
        icon: "error",
      });
    }
  };

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

    if (result.isConfirmed) {
      MySwal.fire({
        title: "Logging out...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await Api.post("/api/v1/auth/logout");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");

        Swal.close();
        MySwal.fire("Logged out!", "You have been logged out.", "success");

        navigate("/login", { replace: true });
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.response?.data?.message || "Logout failed",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Profile Section */}
      <header className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] transition-all duration-300 transform hover:scale-105 max-w-sm mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full shadow bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-extrabold text-white">
                  {user?.firstname
                    ? user.firstname.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="text-gray-700">
                  <h1 className="text-2xl font-extrabold text-shadow">
                    {user?.firstname || "Employee"}
                  </h1>
                  <p className="text-sm font-medium">
                    {user?.role || "Employee Role"}
                  </p>
                  <p className="text-xs opacity-80">
                    {user?.email || "No email found"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items center gap-3">
                <Link to={"/setting"}>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-xl">
                    <LuPen size={15} />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-xl"
                  aria-label="Log out"
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
              className={`backdrop-blur-md p-6 rounded-2xl border border-white/20 animate-pulse-once bg-gradient-to-r from-indigo-700 to-indigo-400 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300`}
            >
              <div className="text-white">{stat.icon}</div>
              <p className="text-sm font-medium text-white/80">{stat.label}</p>
              <h2 className={`text-3xl font-extrabold ${stat.color}`}>
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* Leave Section */}
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
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
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
                    aria-required="true"
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
                    aria-required="true"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-md hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:rounded-2xl"
                aria-label="Submit Leave Request"
              >
                Submit Leave Request
              </button>
            </form>
          </section>

          {/* Leave History */}
          <section className="p-6 rounded-2xl border border-indigo-800">
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
