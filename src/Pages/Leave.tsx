import React, { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api";
import {
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
} from "react-icons/fa";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const socket = io("https://zyrahr-backend.onrender.com"); // Backend Socket.IO URL

const AdminLeavePage: React.FC = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get<Leave[]>("/api/v1/leave/all");
      setLeaves(data);
    } catch (err: any) {
      console.error("Error fetching leaves:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await Api.get<Notification[]>("/api/v1/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const readNotificationIds = JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );
      // Filter for leave-related notifications
      const leaveNotifications = data
        .filter((n) => n.type.toLowerCase().includes("leave"))
        .map((n) => ({
          ...n,
          read: readNotificationIds.includes(n._id) ? true : n.read,
        }));
      console.log("Fetched notifications:", leaveNotifications);
      setNotifications(leaveNotifications);
      setUnreadCount(leaveNotifications.filter((n) => !n.read).length);
    } catch (err: any) {
      console.error("Failed to fetch notifications:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("Failed to fetch notifications");
    }
  };

  const markAsRead = (notificationId: string) => {
    try {
      const readNotificationIds = JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );
      if (!readNotificationIds.includes(notificationId)) {
        readNotificationIds.push(notificationId);
        localStorage.setItem(
          "readNotifications",
          JSON.stringify(readNotificationIds)
        );
        console.log(
          "Marked notification as read in localStorage:",
          notificationId
        );
      }
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
      toast.success("Notification marked as read");
    } catch (err: any) {
      console.error("Failed to mark notification as read in localStorage:", {
        message: err.message,
      });
      toast.error("Failed to mark notification as read");
    }
  };

  const handleToggleNotifications = () => {
    if (!showNotifications && unreadCount > 0) {
      // Mark all unread notifications as read
      const readNotificationIds = notifications
        .filter((n) => !n.read)
        .map((n) => n._id);
      const currentReadIds = JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );
      const updatedReadIds = [
        ...new Set([...currentReadIds, ...readNotificationIds]),
      ];
      localStorage.setItem("readNotifications", JSON.stringify(updatedReadIds));
      console.log(
        "Marked all notifications as read in localStorage:",
        updatedReadIds
      );
      setNotifications((prev) =>
        prev.map((n) => (n.read ? n : { ...n, read: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    }
    setShowNotifications(!showNotifications);
  };

  const handleApprove = async (id: string) => {
    try {
      await Api.patch(`/api/v1/leave/approve/${id}`);
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status: "approved" } : leave
        )
      );
      if (activeTab !== "approved") setActiveTab("approved");
      toast.success("Leave request approved");
    } catch (err: any) {
      console.error("Approve error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("Failed to approve leave request");
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
      if (activeTab !== "rejected") setActiveTab("rejected");
      toast.success("Leave request rejected");
    } catch (err: any) {
      console.error("Reject error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      toast.error("Failed to reject leave request");
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchNotifications();

    // Join admin room for notifications
    socket.emit("join_admin");
    console.log("Socket.IO: Joined admin room");

    // Listen for all notifications to debug
    socket.on("notification", (notification: Notification) => {
      console.log("Received Socket.IO notification:", notification);
      if (notification.type.toLowerCase().includes("leave")) {
        setNotifications((prev) => {
          const readNotificationIds = JSON.parse(
            localStorage.getItem("readNotifications") || "[]"
          );
          const updatedNotification = {
            ...notification,
            read: readNotificationIds.includes(notification._id)
              ? true
              : notification.read,
          };
          return [updatedNotification, ...prev];
        });
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

    // Polling for notifications as a fallback
    const pollingInterval = setInterval(fetchNotifications, 30000);

    return () => {
      socket.off("notification");
      socket.off("connect");
      socket.off("connect_error");
      clearInterval(pollingInterval);
    };
  }, []);

  // Filter leaves based on search term and active tab
  const filteredLeaves = leaves.filter(
    (leave) =>
      leave.status === activeTab &&
      (`${leave.userId.firstName} ${leave.userId.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading)
    return <p className="text-center py-6 text-gray-600">Loading leaves...</p>;
  if (error)
    return <p className="text-center text-red-500 font-medium">{error}</p>;

  const renderTable = (
    status: "pending" | "approved" | "rejected",
    icon: React.ReactNode
  ) => {
    const isActive = activeTab === status;
    if (!isActive) return null;

    return (
      <div className="mb-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-indigo-100/50 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="text-xl font-semibold text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1)} Requests
          </h3>
        </div>
        {filteredLeaves.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No {status} requests.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl max-h-96 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-left sticky top-0">
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
                {filteredLeaves.map((leave) => (
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-gray-50 p-0">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FaClock className="text-indigo-600" />
            Leave Requests Management
          </h2>
          <div className="relative">
            <button
              onClick={handleToggleNotifications}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaBell size={16} />
              <span className="text-sm font-medium">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-indigo-200 z-10 max-h-96 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Leave Notifications
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No leave notifications available.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {notifications.map((notif) => (
                        <li
                          key={notif._id}
                          className={`p-3 rounded-lg border border-indigo-200 transition-all duration-200 ${
                            notif.read ? "bg-gray-100" : "bg-blue-100"
                          }`}
                        >
                          <p className="text-sm text-gray-900">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.createdAt).toLocaleString("en-NG", {
                              timeZone: "Africa/Lagos",
                            })}
                          </p>
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="text-xs text-indigo-500 hover:text-indigo-600 mt-1"
                            >
                              Mark as read
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
        <div className="mb-6">
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
        <div className="flex gap-4 mb-6 border-b-2 border-indigo-100">
          {["pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as "pending" | "approved" | "rejected")
              }
              className={`px-6 py-3 font-semibold text-lg capitalize transition-all duration-300 ${
                activeTab === tab
                  ? "text-indigo-700 border-b-2 border-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {renderTable("pending", <FaClock className="text-yellow-600" />)}
        {renderTable("approved", <FaCheckCircle className="text-green-600" />)}
        {renderTable("rejected", <FaTimesCircle className="text-red-600" />)}
      </div>
    </div>
  );
};

export default AdminLeavePage;
