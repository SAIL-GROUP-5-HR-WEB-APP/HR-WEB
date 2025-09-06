import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
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
  LuHeart,
  LuBell,
} from "react-icons/lu";
import Api from "../Components/Reuseable/Api";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MySwal = withReactContent(Swal);

interface LeaveRequest {
  id: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

interface Kudo {
  id: string;
  senderId: { firstName: string; lastName?: string };
  receiverId: { firstName: string; lastName?: string };
  message: string;
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
}

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const socket = io("https://zyrahr-backend.onrender.com");

const EmployeeDashboard = () => {
  const [leaveType, setLeaveType] = useState<string>("sick");
  const [leaveReason, setLeaveReason] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<"ClockIn" | "ClockOut" | null>(
    null
  );
  const [user, setUser] = useState<{
    id?: string;
    firstName: string;
    lastName?: string;
    email: string;
    role?: string;
    profile?: {
      department?: string;
      position?: string;
      phone?: string;
      address?: string;
      avatarUrl: string;
    };
  } | null>(null);
  const [daysPresent, setDaysPresent] = useState<number>(0);
  const [daysAbsent, setDaysAbsent] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] =
    useState<boolean>(false);
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [kudoReceiverId, setKudoReceiverId] = useState<string>("");
  const [kudoMessage, setKudoMessage] = useState<string>("");
  const [loadingKudos, setLoadingKudos] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    socket.emit("join", userData.id);
    console.log("Socket.IO: Joined room with user ID:", userData.id);

    // Listen for notifications
    socket.on("notification", (notification: Notification) => {
      console.log("Received Socket.IO notification:", notification);
      if (
        notification.type === "leave_request" ||
        notification.type === "leave_approval" ||
        notification.type === "leave_rejection" ||
        notification.type === "kudo" ||
        notification.type === "announcement"
      ) {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "light",
        });
      } else {
        console.log("Ignored notification with type:", notification.type);
      }
    });

    // Debug Socket.IO connection
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    const fetchNotifications = async () => {
      try {
        const res = await Api.get("/api/v1/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const readNotificationIds = JSON.parse(
          localStorage.getItem("readNotifications") || "[]"
        );
        const filteredNotifications = res.data
          .filter(
            (n: Notification) =>
              n.type === "leave_request" ||
              n.type === "leave_approval" ||
              n.type === "leave_rejection" ||
              n.type === "kudo" ||
              n.type === "announcement"
          )
          .map((n: Notification) => ({
            ...n,
            read: readNotificationIds.includes(n._id) ? true : n.read,
          }));
        console.log("Fetched notifications:", filteredNotifications);
        setNotifications(filteredNotifications);
        setUnreadCount(
          filteredNotifications.filter((n: Notification) => !n.read).length
        );
      } catch (err: any) {
        console.error("Failed to fetch notifications:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await Api.get(`/api/v1/users/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setUser(userData);
      }
    };

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
        console.error("Failed to fetch leave requests:", err);
      }
    };

    // Polling for leave request updates as a fallback
    const pollLeaveRequests = async () => {
      try {
        const res = await Api.get("/api/v1/leave/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedRequests: LeaveRequest[] = res.data.map((r: any) => ({
          id: r._id,
          type: r.type,
          reason: r.reason,
          startDate: new Date(r.startDate).toISOString().split("T")[0],
          endDate: new Date(r.endDate).toISOString().split("T")[0],
          status: r.status,
        }));

        // Check for status changes
        updatedRequests.forEach((newReq) => {
          const oldReq = leaveRequests.find((req) => req.id === newReq.id);
          if (oldReq && oldReq.status !== newReq.status) {
            const notification = {
              _id: `${newReq.id}-${newReq.status}`,
              message: `Your ${newReq.type} leave request has been ${newReq.status}.`,
              type:
                newReq.status === "approved"
                  ? "leave_approval"
                  : "leave_rejection",
              read: false,
              createdAt: new Date().toISOString(),
            };
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast.info(notification.message, {
              position: "top-right",
              autoClose: 5000,
              theme: document.documentElement.classList.contains("dark")
                ? "dark"
                : "light",
            });
          }
        });
        setLeaveRequests(updatedRequests);
      } catch (err) {
        console.error("Failed to poll leave requests:", err);
      }
    };

    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const res = await Api.get("/api/v1/announcements");
        const formatted: Announcement[] = res.data.map((a: any) => ({
          id: a.id || a._id,
          title: a.title,
          message: a.message || a.content,
          createdAt: a.createdAt,
        }));
        setAnnouncements(formatted);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    const fetchAttendanceSummary = async () => {
      try {
        if (!userData?.id) {
          console.error("User ID missing, cannot fetch logs");
          return;
        }
        const res = await Api.get(`/api/v1/attendance/logs/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

    const fetchKudos = async () => {
      setLoadingKudos(true);
      try {
        const res = await Api.get("/api/v1/kudos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formatted: Kudo[] = res.data.map((k: any) => ({
          id: k._id,
          senderId: {
            firstName: k.senderId.firstName,
            lastName: k.senderId.lastName,
          },
          receiverId: {
            firstName: k.receiverId.firstName,
            lastName: k.receiverId.lastName,
          },
          message: k.message,
          createdAt: k.createdAt,
        }));
        setKudos(formatted);
      } catch (err: any) {
        console.error("Failed to fetch kudos:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      } finally {
        setLoadingKudos(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await Api.get("/api/v1/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err: any) {
        console.error("Failed to fetch users:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      }
    };

    fetchUserProfile();
    fetchLeaveRequests();
    fetchAttendanceSummary();
    fetchAnnouncements();
    fetchKudos();
    fetchUsers();
    fetchNotifications();

    // Set up polling for leave requests (every 30 seconds)
    const pollingInterval = setInterval(pollLeaveRequests, 30000);

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("connect_error");
      clearInterval(pollingInterval);
    };
  }, [navigate]);

  const handleToggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      // Mark all unread notifications as read and save to localStorage
      const readNotificationIds = notifications.map((n) => n._id);
      setNotifications((prev) =>
        prev.map((n) => (n.read ? n : { ...n, read: true }))
      );
      localStorage.setItem(
        "readNotifications",
        JSON.stringify(readNotificationIds)
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    }
    setShowNotifications(!showNotifications);
  };

  const getPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      }
    });

  const handleClockIn = async () => {
    try {
      Swal.fire({
        title: "Clocking in...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const pos = await getPosition();
      const { latitude, longitude, accuracy } = pos.coords;

      if (accuracy > 100) {
        throw new Error(
          "Geolocation accuracy too low. Please ensure a stronger GPS signal."
        );
      }

      // Validate latitude and longitude ranges
      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error("Invalid coordinates provided");
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please log in to continue");
      }

      const res = await Api.post(
        "/api/v1/attendance/clock-in",
        {
          latitude: Number(latitude),
          longitude: Number(longitude), // Fixed bug: was Number(latitude)
          consent: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.close();
      Swal.fire({
        title: "Success",
        text: res.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setAttendance("ClockIn");
    } catch (err: any) {
      Swal.close();
      Swal.fire({
        title: "Clock-In Failed",
        text:
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred",
        icon: "error",
        timer: 3000,
        showConfirmButton: true,
      });
      console.error("Clock-in error:", err);
    }
  };

  const handleClockOut = async () => {
    try {
      Swal.fire({
        title: "Clocking out...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const pos = await getPosition();
      const { latitude, longitude, accuracy } = pos.coords;

      if (accuracy > 100) {
        throw new Error(
          "Geolocation accuracy too low. Please ensure a stronger GPS signal."
        );
      }

      // Validate latitude and longitude ranges
      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error("Invalid coordinates provided");
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please log in to continue");
      }

      const res = await Api.post(
        "/api/v1/attendance/clock-out",
        {
          latitude: Number(latitude),
          longitude: Number(longitude),
          consent: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.close();
      Swal.fire({
        title: "Success",
        text: res.data.message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setAttendance("ClockOut");
    } catch (err: any) {
      Swal.close();
      Swal.fire({
        title: "Clock-Out Failed",
        text:
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred",
        icon: "error",
        timer: 3000,
        showConfirmButton: true,
      });
      console.error("Clock-out error:", err);
    }
  };

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
          id: Date.now().toString(),
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
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.message || err.message || "Leave request failed",
        icon: "error",
      });
    }
  };

  const submitKudo = async (e: FormEvent) => {
    e.preventDefault();
    if (!kudoReceiverId || !kudoMessage)
      return MySwal.fire(
        "Missing fields",
        "Please select a recipient and enter a message.",
        "warning"
      );
    if (kudoReceiverId === user?.id)
      return MySwal.fire(
        "Invalid recipient",
        "You cannot send a kudo to yourself.",
        "warning"
      );

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      await Api.post(
        "/api/v1/kudos",
        {
          receiverId: kudoReceiverId,
          message: kudoMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      MySwal.fire("Success", "Kudo sent successfully!", "success");

      const res = await Api.get("/api/v1/kudos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formatted: Kudo[] = res.data.map((k: any) => ({
        id: k._id,
        senderId: {
          firstName: k.senderId.firstName,
          lastName: k.senderId.lastName,
        },
        receiverId: {
          firstName: k.receiverId.firstName,
          lastName: k.receiverId.lastName,
        },
        message: k.message,
        createdAt: k.createdAt,
      }));
      setKudos(formatted);

      setKudoReceiverId("");
      setKudoMessage("");
    } catch (err: any) {
      console.error("Failed to send kudo:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage =
        err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
        err.response?.data?.message ||
        err.message ||
        "Failed to send kudo";
      Swal.fire({
        title: "Error",
        text: errorMessage,
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
      localStorage.removeItem("readNotifications");
      Swal.close();
      MySwal.fire("Logged out!", "You have been logged out.", "success");
      navigate("/login", { replace: true });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Logout failed",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <ToastContainer />
      <header className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 max-w-lg mx-auto border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user?.profile?.avatarUrl ? (
                  <img
                    src={user.profile.avatarUrl}
                    alt={`${user.firstName} ${user.lastName || ""}`}
                    className="h-16 w-16 rounded-full object-cover border-2 border-purple-400 dark:border-purple-600 shadow-md hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
                    <span className="animate-pulse">
                      {user?.firstName
                        ? `${user.firstName.charAt(0)}${
                            user.lastName ? user.lastName.charAt(0) : ""
                          }`.toUpperCase()
                        : "?"}
                    </span>
                  </div>
                )}
                <div className="text-gray-900 dark:text-gray-100">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {user?.firstName} {user?.lastName || ""}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email || "No email provided"}
                  </p>
                  {user?.profile && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {user.profile.department && (
                        <p className="flex items-center">
                          <span className="mr-1">🏢</span>{" "}
                          {user.profile.department}
                        </p>
                      )}
                      {user.profile.position && (
                        <p className="flex items-center">
                          <span className="mr-1">💼</span>{" "}
                          {user.profile.position}
                        </p>
                      )}
                      {user.profile.phone && (
                        <p className="flex items-center">
                          <span className="mr-1">📞</span> {user.profile.phone}
                        </p>
                      )}
                      {user.profile.address && (
                        <p className="flex items-center">
                          <span className="mr-1">📍</span>{" "}
                          {user.profile.address}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <button
                    onClick={handleToggleNotifications}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <LuBell size={16} />

                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-4 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Notifications
                        </h3>
                        {notifications.length === 0 ? (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            No notifications available.
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {notifications.map((notif) => (
                              <li
                                key={notif._id}
                                className={`p-3 rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 animate-fade-in ${
                                  notif.read
                                    ? "bg-gray-100 dark:bg-gray-700"
                                    : "bg-blue-100 dark:bg-blue-900"
                                }`}
                              >
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/setting">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    <LuPen size={16} />
                    <span className="text-sm font-medium max-[700px]:hidden">
                      Edit
                    </span>
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <LuLogOut size={16} />
                  <span className="text-sm font-medium max-[700px]:hidden">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <LuUserCheck size={32} className="text-green-400" />,
              label: "Days Present",
              value: daysPresent,
            },
            {
              icon: <LuUserX size={32} className="text-red-400" />,
              label: "Days Absent",
              value: daysAbsent,
            },
            {
              icon: <LuBaggageClaim size={32} className="text-purple-400" />,
              label: "Leave Requests",
              value: leaveRequests.length,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </h2>
                </div>
                <div>{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/vote")}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <LuThumbsUp size={20} />
            <span>Vote for Employee of the Month</span>
          </button>
          <button
            onClick={() => navigate("/survey")}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <span role="img" aria-label="survey">
              📋
            </span>
            <span>Take Anonymous Survey</span>
          </button>
        </div>
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="font-bold text-xl md:text-2xl flex items-center space-x-2 text-gray-900 dark:text-white mb-6 justify-center">
            <LuClipboardList size={28} className="text-purple-500" />
            <span>Attendance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={handleClockIn}
              className={`flex flex-col items-center justify-center p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                attendance === "ClockIn"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-green-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <LuClock10 size={40} className="mb-2" />
              <span className="text-lg font-semibold">Clock-In</span>
            </button>
            <button
              onClick={handleClockOut}
              className={`flex flex-col items-center justify-center p-8 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                attendance === "ClockOut"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-700 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105"
              }`}
            >
              <LuClock6 size={40} className="mb-2" />
              <span className="text-lg font-semibold">Clock-Out</span>
            </button>
          </div>
          {attendance && (
            <div
              className={`mt-6 text-center p-6 rounded-xl text-white animate-fade-in ${
                attendance === "ClockIn"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            >
              <p className="text-lg font-semibold flex flex-col items-center">
                {attendance === "ClockIn" ? (
                  <LuThumbsUp size={36} className="mb-2 animate-pulse" />
                ) : (
                  <LuThumbsDown size={36} className="mb-2 animate-pulse" />
                )}
                You have successfully{" "}
                {attendance === "ClockIn" ? "clocked in" : "clocked out"} today
              </p>
            </div>
          )}
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-xl md:text-2xl flex items-center space-x-2 text-gray-900 dark:text-white mb-6">
              <LuCalendar size={28} className="text-purple-500" />
              <span>Request Leave</span>
            </h2>
            <form onSubmit={submitLeaveRequest} className="space-y-4">
              <div>
                <label
                  htmlFor="leaveType"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Leave Type
                </label>
                <select
                  id="leaveType"
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mt-1"
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
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Reason for Leave
                </label>
                <input
                  id="leaveReason"
                  type="text"
                  placeholder="Enter reason for leave"
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mt-1"
                  value={leaveReason}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setLeaveReason(e.target.value)
                  }
                  aria-required="true"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mt-1"
                    value={startDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setStartDate(e.target.value)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Date
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mt-1"
                    value={endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEndDate(e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Submit Leave Request
              </button>
            </form>
          </section>
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 max-h-[430px] overflow-y-auto">
            <h2 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-6">
              Leave Requests
            </h2>
            {leaveRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                No leave requests submitted.
              </p>
            ) : (
              <ul className="space-y-4">
                {leaveRequests.map((req) => (
                  <li
                    key={req.id}
                    className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 animate-fade-in"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {req.type} - {req.reason}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {req.startDate} → {req.endDate}
                        </p>
                        <p className="text-xs font-medium mt-1">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              req.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                                : req.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                            }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </p>
                      </div>
                      {req.status === "approved" && (
                        <LuCheck
                          className="text-green-500 dark:text-green-400 animate-check"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="font-bold text-xl md:text-2xl flex items-center space-x-2 text-gray-900 dark:text-white mb-6">
              <LuHeart size={28} className="text-purple-500" />
              <span>Send Kudos</span>
            </h2>
            <form onSubmit={submitKudo} className="space-y-4">
              <div>
                <label
                  htmlFor="kudoReceiver"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Send Kudos To
                </label>
                <select
                  id="kudoReceiver"
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mt-1"
                  value={kudoReceiverId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setKudoReceiverId(e.target.value)
                  }
                >
                  <option value="">Select a colleague</option>
                  {users
                    .filter((u) => u._id !== user?.id)
                    .map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName || ""}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="kudoMessage"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Kudo Message
                </label>
                <textarea
                  id="kudoMessage"
                  placeholder="Write your kudos message"
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors mt-1"
                  value={kudoMessage}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setKudoMessage(e.target.value)
                  }
                  rows={4}
                  aria-required="true"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send Kudos
              </button>
            </form>
          </section>
          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 max-h-[430px] overflow-y-auto">
            <h2 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-white mb-6">
              Kudos Wall
            </h2>
            {loadingKudos ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : kudos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
                No kudos yet. Send one to get started!
              </p>
            ) : (
              <ul className="space-y-4">
                {kudos.map((kudo) => (
                  <li
                    key={kudo.id}
                    className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 animate-fade-in"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {kudo.senderId.firstName} {kudo.senderId.lastName || ""}{" "}
                      to {kudo.receiverId.firstName}{" "}
                      {kudo.receiverId.lastName || ""}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {kudo.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(kudo.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <section className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="font-bold text-xl md:text-2xl flex items-center space-x-2 text-gray-900 dark:text-white mb-6 text-center">
          <LuClipboardList size={28} className="text-purple-500" />
          <span>Announcements</span>
        </h2>
        {loadingAnnouncements ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
            No announcements available.
          </p>
        ) : (
          <ul className="space-y-4 max-h-[300px] overflow-y-auto">
            {announcements.map((ann) => (
              <li
                key={ann.id}
                className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <p className="font-semibold text-gray-900 dark:text-white">
                  {ann.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {ann.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(ann.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes check {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-pulse { animation: pulse 0.5s ease-in-out; }
        .animate-check { animation: check 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;
