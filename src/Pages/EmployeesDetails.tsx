
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiMail,
  FiPhone,
  FiMoreHorizontal,
  FiUserPlus,
} from "react-icons/fi";

interface Employee {
  _id: string;
  name: string;
  role: string;
  department: string;
  hiredDate: string;
  email: string;
  phone: string;
  status: "online" | "offline";
  avatar: string;
}

export default function EmployeeDashboard() {
  const [employees, setEmployees] = useState<Employee>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);



  // Fetch from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("https://user-data-ci61.onrender.com/user/viewallUser");
        const data = await res.json();
        setEmployees(data.data || []);   // assumes API returns an array of employees
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Search filter
  const filteredEmployees = employees.filter((emp) =>
  emp.username?.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          <span className="text-indigo-900">{employees.length}</span> Employee
        </h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
            <FiFilter /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg shadow hover:bg-orange-600">
            <FiUserPlus /> Add Candidate
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md mb-8">
        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Loading State */}
      {loading && <p className="text-gray-500">Loading employees...</p>}

      {/* Employee Cards */}
     <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredEmployees.map((emp) => (
    <div
      key={emp._id}
      className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={emp.avatar || "https://via.placeholder.com/150"}
              alt={emp.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                emp.status === "online" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
          <div>
            <h3 className="font-semibold">{emp.username}</h3>
            <p className="text-sm text-gray-500">{emp.bio || "No role"}</p>
          </div>
        </div>
        <FiMoreHorizontal className="text-gray-400 cursor-pointer" />
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-medium">Address:</span>{" "}
          {emp.address || "N/A"}
        </p>
        <p>
          <span className="font-medium">Age:</span>{" "}
          {emp.age || "N/A"}
        </p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FiMail className="text-indigo-900" /> {emp.email || "N/A"}
        </div>
        <div className="flex items-center gap-2">
          <FiPhone className="text-indigo-900" /> N/A
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Empty State */}
      {!loading && filteredEmployees.length === 0 && (
        <p className="text-gray-500 mt-6">No employees found.</p>
      )}
    </div>
  );
}
// const EmployeesDetails = () => {
//   return (
//     <div>
//       <h1>This is the employee page</h1>
//     </div>
//   );
// };

// 
