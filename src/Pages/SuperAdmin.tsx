// src/components/SuperAdmin.tsx
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import Api from "../Components/Reuseable/Api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { LuLogOut } from "react-icons/lu";

type Role = "employee" | "hr" | "admin";
type DemoStatus = "new" | "contacted" | "converted";

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

interface CreateDepartmentForm {
  name: string;
  description: string;
}

interface Department {
  id: string;
  name: string;
  createdAt: string;
}

interface DemoRequest {
  _id: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  rolePreference: Role;
  status: DemoStatus;
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showUserForm, setShowUserForm] = useState<boolean>(false);
  const [showDeptForm, setShowDeptForm] = useState<boolean>(false);
  const [deptForm, setDeptForm] = useState<CreateDepartmentForm>({
    name: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await Api.get<User[]>("/api/v1/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users");
      }
    };

    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await Api.get<Department[]>("/api/v1/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to fetch departments");
      }
    };

    const fetchDemoRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await Api.get<DemoRequest[]>("/api/v1/demo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemoRequests(res.data);
      } catch (error) {
        console.error("Failed to fetch demo requests");
      }
    };

    fetchUsers();
    fetchDepartments();
    fetchDemoRequests();
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

  const handleDeptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeptForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDemoRequests = demoRequests.filter(
    (d) =>
      d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      MySwal.fire({
        title: "Logging out...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await Api.post("/api/v1/auth/logout");
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        Swal.close();
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
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

      setUsers((prev) => [...prev, res.data.user]);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "employee",
      });
      setShowUserForm(false);

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

  const handleDeptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const res = await Api.post<{ message: string; department: Department }>(
        "/api/v1/departments",
        deptForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDepartments((prev) => [...prev, res.data.department]);
      setDeptForm({ name: "", description: "" });
      setShowDeptForm(false);

      Swal.fire({
        title: "Department Created!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Back to Dashboard",
      }).then(() => {
        window.location.href = "/admin";
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || "Error creating department");
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Error creating department",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvertDemo = async (demoId: string) => {
    const result = await MySwal.fire({
      title: "Convert Demo Request",
      text: "Are you sure you want to convert this demo request to a user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, convert",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const res = await Api.post<{ message: string }>(
          `/api/v1/demo/${demoId}/convert`, // use the param
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDemoRequests((prev) =>
          prev.map((demo) =>
            demo._id === demoId ? { ...demo, status: "converted" } : demo
          )
        );

        Swal.fire({
          title: "Success",
          text: res.data.message,
          icon: "success",
          confirmButtonColor: "#4F46E5",
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Failed to convert demo request",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-gray-100 to-purple-100 p-4 sm:p-6 lg:p-8">
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
            className="flex items-center justify-center mx-auto mt-4 space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LuLogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            { label: "Total Users", value: users.length },
            { label: "Departments", value: departments.length },
            {
              label: "Employees",
              value: users.filter((u) => u.role === "employee").length,
            },
            { label: "Demo Requests", value: demoRequests.length },
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

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4 border-b border-gray-200">
            {["users", "departments", "demoRequests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 font-semibold capitalize ${
                  activeTab === tab
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.replace("demoRequests", "Demo Requests")}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {activeTab === "users" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Users
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-3 sm:mt-0">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full sm:w-64 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                    <button
                      onClick={() => setShowUserForm((prev) => !prev)}
                      className="mt-3 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      + Add User
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 sticky top-0">
                        <tr>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Name
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Email
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Role
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, index) => (
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
                            <td className="py-3 px-4 sm:px-6 capitalize">
                              {u.role}
                            </td>
                            <td className="py-3 px-4 sm:px-6">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "departments" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Departments
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-3 sm:mt-0">
                    <input
                      type="text"
                      placeholder="Search departments..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full sm:w-64 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                    <button
                      onClick={() => setShowDeptForm((prev) => !prev)}
                      className="mt-3 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
                    >
                      + Add Department
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 sticky top-0">
                        <tr>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Name
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDepartments.map((d, index) => (
                          <tr
                            key={d.id}
                            className={`border-t hover:bg-indigo-50/50 transition-colors duration-200 ${
                              index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                            }`}
                          >
                            <td className="py-3 px-4 sm:px-6">{d.name}</td>
                            <td className="py-3 px-4 sm:px-6">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "demoRequests" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Demo Requests
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 mt-3 sm:mt-0">
                    <input
                      type="text"
                      placeholder="Search demo requests..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full sm:w-64 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 sticky top-0">
                        <tr>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Name
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Email
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Company
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Role
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Status
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Created
                          </th>
                          <th className="py-3 px-4 sm:px-6 font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDemoRequests.map((d, index) => (
                          <tr
                            key={d.id}
                            className={`border-t hover:bg-indigo-50/50 transition-colors duration-200 ${
                              index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                            }`}
                          >
                            <td className="py-3 px-4 sm:px-6">{d.fullName}</td>
                            <td className="py-3 px-4 sm:px-6">{d.email}</td>
                            <td className="py-3 px-4 sm:px-6">{d.company}</td>
                            <td className="py-3 px-4 sm:px-6 capitalize">
                              {d.rolePreference}
                            </td>
                            <td className="py-3 px-4 sm:px-6 capitalize">
                              {d.status}
                            </td>
                            <td className="py-3 px-4 sm:px-6">
                              {new Date(d.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 sm:px-6">
                              <button
                                onClick={() => handleConvertDemo(d.id)}
                                disabled={d.status === "converted" || loading}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                  d.status === "converted"
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                } transition-all duration-200`}
                              >
                                {loading ? "Converting..." : "Convert"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create User Modal */}
        {showUserForm && (
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
                  <option value="admin">Admin</option>
                </select>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
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

        {/* Create Department Modal */}
        {showDeptForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg transform transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                Create New Department
              </h2>
              <form onSubmit={handleDeptSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Department Name"
                  value={deptForm.name}
                  onChange={handleDeptChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Department description"
                  value={deptForm.description}
                  onChange={handleDeptChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setShowDeptForm(false)}
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
                    {loading ? "Creating..." : "Create Department"}
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
