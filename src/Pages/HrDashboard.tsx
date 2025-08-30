import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import {
  LuUsers,
  LuBuilding2,
  LuUserCheck,
  LuUserX,
  LuPlus,
  LuClipboard,
  LuCheck,
  LuTrash,
  LuPlane,
  LuCalendarCheck,
  LuClock,
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

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const HrDashboard = () => {
  const [todo, setTodo] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);

  // Fetch total employees
  const fetchTotalEmployees = async () => {
    try {
      const res = await Api.get("/api/v1/users/all");
      setTotalEmployees(res.data.length || 0); // Assuming backend returns an array of employees
    } catch (err) {
      console.error("Failed to fetch total employees:", err);
    }
  };

  useEffect(() => {
    fetchTotalEmployees();
  }, []);

  const addTask = () => {
    if (todo.trim() === "") return;
    const newTask: Task = { id: Date.now(), text: todo, completed: false };
    setTasks([...tasks, newTask]);
    setTodo("");
  };
  const saveData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTask();
  };
  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const leaveCards = [
    { title: "Employees on Leave", total: "5", icon: <LuPlane size={30} /> },
    {
      title: "Leave Requests",
      total: "2",
      icon: <LuCalendarCheck size={30} />,
    },
    { title: <DateTime />, icon: <LuClock size={30} /> },
  ];

  const statCard = [
    {
      title: "Total employees",
      total: totalEmployees,
      icon: <LuUsers size={30} />,
    }, // DYNAMIC
    { title: "Departments", total: "7", icon: <LuBuilding2 size={30} /> },
    { title: "Present", total: "55", icon: <LuUserCheck size={30} /> },
    { title: "Absent", total: "35", icon: <LuUserX size={30} /> },
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
          Welcome back HR{" "}
        </h1>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-4 gap-4 mt-6 max-[900px]:grid-cols-2 max-[550px]:grid-cols-1 ">
        {statCard.map((data, i) => (
          <div
            key={i}
            className="hover:shadow-2xs shadow-2xl rounded-lg p-5 bg-gradient-to-r from-indigo-900 to-indigo-600  text-white hover:bg-indigo-950  flex flex-col  max-[550px]:items-center"
          >
            <div>{data.icon}</div>
            <h1 className="text-xl mt-2 ">{data.title}</h1>
            <p className="text-2xl font-bold">{data.total}</p>
          </div>
        ))}
      </div>

      {/* task + chart section */}
      <div className="grid grid-cols-2 gap-4 mt-5 max-[900px]:grid-cols-1">
        {/* Todo Section */}
        <div className="relative border-2 p-2 border-indigo-800 rounded-lg flex flex-col h-[350px]">
          <div className="flex items-center justify-center">
            <h1>
              <LuClipboard />
            </h1>
            <h1 className="text-center font-bold ml-2">TODO</h1>
          </div>

          <form onSubmit={saveData} className="relative">
            <input
              type="text"
              placeholder="Add a task..."
              className="relative w-full pl-10 pr-10 py-2 border bg-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 border-indigo-200"
              value={todo}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTodo(e.target.value)
              }
            />
            {/* Plus icon inside input */}
            <LuPlus
              onClick={addTask}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-800 cursor-pointer"
              size={20}
            />
          </form>

          {/* Todo List */}
          <div className="flex-1 overflow-y-auto mt-3 px-2">
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">No tasks yet</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center py-2 px-3 rounded-lg shadow-sm mb-2 bg-indigo-50"
                >
                  <span
                    className={`${
                      task.completed ? "line-through text-red-500" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <LuCheck size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
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
      <div>
        <div className="grid grid-cols-3  gap-4 mt-6  max-[550px]:grid-cols-1 ">
          {leaveCards.map((data, i) => (
            <div
              key={i}
              className="hover:shadow-2xs shadow-2xl rounded-lg p-5  bg-gradient-to-r from-indigo-300 to-indigo-200  text-black text-center "
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
