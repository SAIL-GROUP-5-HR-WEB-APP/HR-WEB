import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Api from "../Components/Reuseable/Api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { LuLogOut } from "react-icons/lu";

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
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // SweetAlert built-in loading spinner
      MySwal.fire({
        title: "Logging out...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await Api.post("/api/v1/auth/logout");

        // Clear localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        Swal.close();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);

        // Clear localStorage anyway
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        Swal.close();
        navigate("/login");
      }
    }
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

      // Add new user to list
      setUsers((prev) => [...prev, res.data.user]);

      // Reset form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "employee",
      });

      // Close modal
      setShowForm(false);

      // 🎉 Success Alert
      Swal.fire({
        title: "User Created!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Back to Dashboard",
      }).then(() => {
        window.location.href = "/admin";
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || "Error creating user");

      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Error creating user",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  bg-gradient-to-br from-indigo-100 via-gray-100 to-purple-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Zyrahr
            </span>{" "}
            Admin
          </h1>
          <p className="mt-2 text-gray-600 text-sm sm:text-base">
            Manage your team with ease
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center place-items-center justify-center mx-auto space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LuLogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {[
            { label: "Total Users", value: users.length },
            {
              label: "HR Members",
              value: users.filter((u) => u.role === "hr").length,
            },
            {
              label: "Employees",
              value: users.filter((u) => u.role === "employee").length,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        {/* User Management Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Users
          </h2>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="mt-3 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
          >
            + Add User
          </button>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700">
                <tr>
                  <th className="py-3 px-4 sm:px-6 font-semibold">Name</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">Email</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">Role</th>
                  <th className="py-3 px-4 sm:px-6 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-t hover:bg-indigo-50/50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    }`}
                  >
                    <td className="py-3 px-4 sm:px-6">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3 px-4 sm:px-6">{u.email}</td>
                    <td className="py-3 px-4 sm:px-6 capitalize">{u.role}</td>
                    <td className="py-3 px-4 sm:px-6">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg transform transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                Create New User
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  {
                    name: "firstName",
                    placeholder: "First Name",
                    type: "text",
                  },
                  { name: "lastName", placeholder: "Last Name", type: "text" },
                  { name: "email", placeholder: "Email", type: "email" },
                  {
                    name: "password",
                    placeholder: "Temporary Password",
                    type: "password",
                  },
                ].map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={form[field.name as keyof CreateUserForm]}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                ))}
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                >
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                </select>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm sm:text-base ${
                      loading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    } transition-all duration-200`}
                  >
                    {loading ? "Creating..." : "Create User"}
                  </button>
                </div>
              </form>
              {message && (
                <p
                  className={`mt-4 text-center text-sm sm:text-base font-medium ${
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
    </div>
  );
};

export default SuperAdmin;
