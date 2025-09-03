// src/pages/SuperAdmin.tsx
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Api from "../Components/Reuseable/Api";

// Define allowed roles
type Role = "employee" | "hr";

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: string;
}

const SuperAdmin = () => {
  const [form, setForm] = useState<CreateUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await Api.get<User[]>("/api/v1/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
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

      const res = await Api.post<{ message: string; user: User }>(
        "/api/v1/admin/create-user",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message);
      setUsers((prev) => [...prev, res.data.user]); // add new user to list
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "employee",
      });
      setShowForm(false); // close form after success
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Dashboard Header */}
      <h1 className="text-4xl font-bold mb-6 text-center">
        <span className="text-indigo-600">Zyrahr</span> Super Admin Dashboard
      </h1>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Total HR</p>
          <h2 className="text-2xl font-bold">
            {users.filter((u) => u.role === "hr").length}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-gray-500 text-sm">Total Employees</p>
          <h2 className="text-2xl font-bold">
            {users.filter((u) => u.role === "employee").length}
          </h2>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          + Add Employee
        </button>
      </div>

      {/* User List */}
      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2 px-4">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-2 px-4">{u.email}</td>
                <td className="py-2 px-4 capitalize">{u.role}</td>
                <td className="py-2 px-4">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Form (only shows when Add Employee is clicked) */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              👨‍💼 Create New User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Temporary Password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
              </select>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>

            {message && (
              <p
                className={`mt-4 text-center font-medium ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
