import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMail, FiPhone, FiMoreHorizontal } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

interface Employee {
  _id: string;
  username: string;
  bio?: string;
  address?: string;
  age?: number;
  email: string;
  status: "online" | "offline";
  avatar?: string;
}

const EmployeesDetails = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://user-data-ci61.onrender.com/user/viewallUser"
      );
      const data = await res.json();
      setEmployees(data.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className=" flex justify-between">
          <h2 className="text-2xl font-semibold">
            <span className="text-indigo-900">{employees.length}</span> Employee
          </h2>
          <div className="flex items-center gap-3"></div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md mb-8">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#5B5CE6" size={40} />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2 text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchEmployees}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Employee Cards */}
      {!loading && !error && (
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
                    <p className="text-sm text-gray-500">
                      {emp.bio || "No role"}
                    </p>
                  </div>
                </div>
                <Link to={`/SingleEmployeedetails/${emp._id}`}>
                  <FiMoreHorizontal className="text-gray-400 cursor-pointer" />
                </Link>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {emp.address || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {emp.age || "N/A"}
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

          {/* Empty State */}
          {!loading && filteredEmployees.length === 0 && (
            <p className="text-gray-500 mt-6">No employees found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeesDetails;
