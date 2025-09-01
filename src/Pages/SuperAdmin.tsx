import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Api from "../Components/Reuseable/Api";
import { motion, AnimatePresence } from "framer-motion";

// Define allowed roles
type Role = "employee" | "hr";

// Define department type
interface Department {
  _id: string;
  name: string;
}

// Define form shape
interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  department: string;
}

const SuperAdmin = () => {
  const [form, setForm] = useState<CreateUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [departmentLoading, setDepartmentLoading] = useState<boolean>(true);
  const [departmentError, setDepartmentError] = useState<string>("");

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Authentication token missing");
        const res = await Api.get<Department[]>("/api/v1/admin/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data);
        if (res.data.length > 0) {
          setForm((prev) => ({ ...prev, department: res.data[0]._id }));
        } else {
          setDepartmentError("No departments available");
        }
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setDepartmentError(
          error.response?.data?.message || "Failed to load departments"
        );
      } finally {
        setDepartmentLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token)
        throw new Error("Authentication token missing. Please log in.");

      const res = await Api.post<{ message: string }>(
        "/api/v1/admin/create-user",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "employee",
        department: departments.length > 0 ? departments[0]._id : "",
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          <span className="text-blue-600">zyraHR</span> Create User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              required
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              required
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              required
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temporary Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              required
              placeholder="Enter temporary password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              required
            >
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
            </motion.select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <motion.select
              whileFocus={{ scale: 1.02 }}
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50/50 transition-all duration-200"
              required
              disabled={departmentLoading || departments.length === 0}
            >
              <option value="" disabled>
                {departmentLoading
                  ? "Loading departments..."
                  : "Select a department"}
              </option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </motion.select>
            {departmentError && (
              <p className="mt-2 text-sm text-red-600">{departmentError}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || departmentLoading || departments.length === 0}
            className={`w-full py-3 flex justify-center items-center font-semibold rounded-lg shadow-md transition-all duration-300 ${
              loading || departmentLoading || departments.length === 0
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                ></path>
              </svg>
            )}
            {loading ? "Creating..." : "Create User"}
          </motion.button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-6 text-center text-sm font-medium p-3 rounded-lg ${
                message.includes("successfully")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SuperAdmin;
