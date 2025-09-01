import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import {
  LuUsers,
  LuBuilding2,
  LuUserCheck,
  LuUserX,
  LuPlus,
  LuClipboard,
  LuTrash,
  LuCalendarCheck,
  LuClock,
  LuPencil,
} from "react-icons/lu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DateTime from "../Components/Reuseable/DateTime";
import Api from "../Components/Reuseable/Api";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  publishAt?: string;
  expiresAt?: string;
  createdAt: string;
}

const HrDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementTitle, setAnnouncementTitle] = useState<string>("");
  const [announcementContent, setAnnouncementContent] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [leaveStats, setLeaveStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
  });

  const fetchAttendanceStats = async () => {
    try {
      const res = await Api.get("/api/v1/attendance/all");
      const attendance = res.data || [];
      setAttendanceStats({
        present: attendance.filter((a: any) => a.status === "present").length,
        absent: attendance.filter((a: any) => a.status === "absent").length,
      });
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  const fetchTotalEmployees = async () => {
    try {
      const res = await Api.get("/api/v1/users/all");
      setTotalEmployees(res.data.length || 0);
    } catch (err) {
      console.error("Failed to fetch total employees:", err);
    }
  };

  const fetchTotalLeaves = async () => {
    try {
      const res = await Api.get("/api/v1/leave/all");
      const leaves = res.data || [];
      setLeaveStats({
        pending: leaves.filter((l: any) => l.status === "pending").length,
        approved: leaves.filter((l: any) => l.status === "approved").length,
        rejected: leaves.filter((l: any) => l.status === "rejected").length,
      });
    } catch (err) {
      console.error("Failed to fetch total leaves:", err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await Api.get("/api/v1/announcements");
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  useEffect(() => {
    fetchTotalEmployees();
    fetchTotalLeaves();
    fetchAttendanceStats();
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async () => {
    if (announcementTitle.trim() === "" || announcementContent.trim() === "")
      return;
    try {
      const res = await Api.post("/api/v1/announcements", {
        title: announcementTitle,
        content: announcementContent,
        publishAt: new Date(),
      });
      setAnnouncements([...announcements, res.data]);
      setAnnouncementTitle("");
      setAnnouncementContent("");
    } catch (err) {
      console.error("Failed to post announcement:", err);
    }
  };

  const updateAnnouncement = async (id: string) => {
    if (announcementTitle.trim() === "" || announcementContent.trim() === "")
      return;
    try {
      const res = await Api.patch(`/api/v1/announcements/${id}`, {
        title: announcementTitle,
        content: announcementContent,
      });
      setAnnouncements(announcements.map((a) => (a._id === id ? res.data : a)));
      setEditingId(null);
      setAnnouncementTitle("");
      setAnnouncementContent("");
    } catch (err) {
      console.error("Failed to update announcement:", err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await Api.delete(`/api/v1/announcements/${id}`);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };

  const saveAnnouncement = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId) {
      updateAnnouncement(editingId);
    } else {
      addAnnouncement();
    }
  };

  const leaveCards = [
    {
      title: "Pending Requests",
      total: leaveStats.pending,
      icon: <LuClock size={30} />,
    },
    {
      title: "Approved Leaves",
      total: leaveStats.approved,
      icon: <LuCalendarCheck size={30} />,
    },
    {
      title: "Rejected Leaves",
      total: leaveStats.rejected,
      icon: <LuUserX size={30} />,
    },
    { title: <DateTime />, total: "", icon: <LuClock size={30} /> },
  ];

  const statCard = [
    {
      title: "Total employees",
      total: totalEmployees,
      icon: <LuUsers size={30} />,
    },
    { title: "Departments", total: "7", icon: <LuBuilding2 size={30} /> },
    {
      title: "Present",
      total: attendanceStats.present,
      icon: <LuUserCheck size={30} />,
    },
    {
      title: "Absent",
      total: attendanceStats.absent,
      icon: <LuUserX size={30} />,
    },
  ];

  const barData = [
    { name: "Jan", employees: 30 },
    { name: "Feb", employees: 45 },
    { name: "Mar", employees: 60 },
    { name: "Apr", employees: 40 },
    { name: "May", employees: 80 },
    { name: "Jun", employees: 55 },
  ];

  return (
    <div className="px-10">
      {/* dashboard header */}
      <div className="flex justify-between items-center  max-[890px]:flex-col ">
        <h1 className="text-3xl font-semibold">
          <span className="text-indigo-800">HR</span> DASHBOARD
        </h1>
        <input
          type="text"
          className="border border-black px-8 rounded-xl py-3 max-[890px]:mt-3"
          placeholder="search anything"
        />
        <h1 className="text-lg font-semibold  max-[890px]:hidden">
          Welcome back HR
        </h1>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4 mt-6 max-[900px]:grid-cols-2 max-[550px]:grid-cols-1 ">
        {statCard.map((data, i) => (
          <div
            key={i}
            className="hover:shadow-2xs shadow-2xl rounded-lg p-5 bg-gradient-to-r from-indigo-900 to-indigo-600 text-white hover:bg-indigo-950 flex flex-col max-[550px]:items-center"
          >
            <div>{data.icon}</div>
            <h1 className="text-xl mt-2">{data.title}</h1>
            <p className="text-2xl font-bold">{data.total}</p>
          </div>
        ))}
      </div>

      {/* announcement + chart section */}
      <div className="grid grid-cols-2 gap-4 mt-5 max-[900px]:grid-cols-1">
        {/* Announcement Section */}
        <div className="relative border-2 p-2 border-indigo-800 rounded-lg flex flex-col h-[350px]">
          <div className="flex items-center justify-center">
            <LuClipboard />
            <h1 className="text-center font-bold ml-2">ANNOUNCEMENTS</h1>
          </div>

          <form onSubmit={saveAnnouncement} className="space-y-2 mt-2">
            <input
              type="text"
              placeholder="Title"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-indigo-500"
              value={announcementTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAnnouncementTitle(e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Content"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-indigo-500"
              value={announcementContent}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAnnouncementContent(e.target.value)
              }
            />
            <button
              type="submit"
              className="bg-indigo-700 text-white px-4 py-2 rounded-lg hover:bg-indigo-800"
            >
              {editingId ? "Update" : "Add"} Announcement
            </button>
          </form>

          <div className="flex-1 overflow-y-auto mt-3 px-2">
            {announcements.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                No announcements yet
              </p>
            ) : (
              announcements.map((a) => (
                <div
                  key={a._id}
                  className="flex justify-between items-center py-2 px-3 rounded-lg shadow-sm mb-2 bg-indigo-50"
                >
                  <div>
                    <p className="font-semibold">{a.title}</p>
                    <p>{a.content}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(a._id);
                        setAnnouncementTitle(a.title);
                        setAnnouncementContent(a.content);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <LuPencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(a._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <LuTrash size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="shadow rounded-lg p-4 flex flex-col h-[350px] border-2 border-indigo-800">
          <h2 className="font-bold mb-4">Employees Joined (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                cursor={{ fill: "rgba(49,46,129,0.1)" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #312E81",
                }}
              />
              <defs>
                <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#312E81" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="employees"
                fill="url(#colorIndigo)"
                radius={[6, 6, 0, 0]}
                label={{ position: "top", fill: "#374151", fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* leave stats */}
      <div>
        <div className="grid grid-cols-4 gap-4 mt-6 max-[550px]:grid-cols-1 ">
          {leaveCards.map((data, i) => (
            <div
              key={i}
              className="hover:shadow-2xs shadow-2xl rounded-lg p-5 bg-gradient-to-r from-indigo-300 to-indigo-200 text-black text-center"
            >
              <div className="place-items-center">{data.icon}</div>
              <h1 className="text-xl mt-2">{data.title}</h1>
              <p className="text-2xl font-bold">{data.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
