import React, { useState, useEffect } from "react";
import Api from "../Components/Reuseable/Api";
import { FaBell } from "react-icons/fa";
import io from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Survey {
  _id: string;
  responses: { question: string; answer: number }[];
  comments: string;
  createdAt: string;
}

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const socket = io("https://zyrahr-backend.onrender.com"); // Backend Socket.IO URL

const Feedback: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const token = localStorage.getItem("authToken");

  const fetchSurveysAndNotifications = async () => {
    if (!token) {
      setError("Please log in to view surveys");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Fetch surveys
      const surveyRes = await Api.get("/api/v1/surveys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSurveys(surveyRes.data);

      // Fetch survey_submission notifications
      const notifRes = await Api.get<Notification[]>("/api/v1/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const surveyNotifications = notifRes.data.filter(
        (n) => n.type === "survey_submission"
      );
      setNotifications(surveyNotifications);
      setUnreadCount(surveyNotifications.filter((n) => !n.read).length);
    } catch (err) {
      setError("Failed to fetch surveys or notifications");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await Api.put(
        `/api/v1/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      toast.error("Failed to mark notification as read");
    }
  };

  useEffect(() => {
    fetchSurveysAndNotifications();

    // Join admin room for notifications
    socket.emit("join_admin");

    // Listen for survey_submission notifications only
    socket.on("survey_submission", (notification: Notification) => {
      if (notification.type === "survey_submission") {
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

    // Debug Socket.IO connection
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err.message);
    });

    return () => {
      socket.off("survey_submission");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [token]);

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900 flex items-center space-x-4">
              <span>Mental Health Survey Overview</span>
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                {new Date().toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                WAT
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
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
                        Survey Notifications
                      </h3>
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No survey notifications available.
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
                                {new Date(notif.createdAt).toLocaleString()}
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
          </div>
          <ToastContainer />
          <div className="overflow-y-auto max-h-[600px] pr-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-600 text-lg">{error}</p>
            ) : surveys.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No surveys submitted yet.
              </p>
            ) : (
              surveys.map((survey) => (
                <div
                  key={survey._id}
                  className="mb-6 bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-md border border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-sm text-gray-600 mb-4">
                    Submitted:{" "}
                    {new Date(survey.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {survey.responses.map((response, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {response.question}
                        </span>
                        <span className="text-indigo-600 text-2xl font-bold">
                          {response.answer} / 5
                        </span>
                      </div>
                    ))}
                  </div>
                  {survey.comments && (
                    <div>
                      <span className="font-semibold text-gray-800">
                        Comments:
                      </span>
                      <p className="text-gray-600 mt-2 p-4 bg-white rounded-lg border border-indigo-100">
                        {survey.comments}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
