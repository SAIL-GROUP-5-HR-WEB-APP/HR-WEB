import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMail, FiPhone, FiMoreHorizontal } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import Api from "../Components/Reuseable/Api";
import { AxiosError } from "axios";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile?: {
    phone?: string;
    address?: string;
    department?: string;
    position?: string;
    emergencyContact?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
  };
}

interface CreateUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const EmployeesDetails = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.get("/api/v1/users/all");
      setEmployees(res.data || []);
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      let isDropdownClick = false;
      dropdowns.forEach((dropdown) => {
        if (dropdown && dropdown.contains(event.target as Node)) {
          isDropdownClick = true;
        }
      });
      if (!isDropdownClick) {
        setShowDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("authToken");
      const res = await Api.post<{ message: string; user: Employee }>(
        "/api/v1/admin/create-user",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmployees((prev) => [...prev, res.data.user]);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "employee",
      });
      setShowForm(false);

      Swal.fire({
        title: "Employee Created!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#4F46E5",
      }).then(() => {
        window.location.href = "/dashboard/employees";
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || "Error creating Employee");

      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Error creating Employee",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDepartment = async (
    employeeId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setShowDropdown(null);
    const { value: department } = await Swal.fire({
      title: "Assign Department",
      input: "text",
      inputLabel: "Enter department name",
      inputPlaceholder: "e.g., Engineering",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#DC2626",
      inputValidator: (value) => {
        if (!value) {
          return "Department name is required!";
        }
      },
    });

    if (department) {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        await Api.post(
          "/api/v1/departments/assign-department",
          { userId: employeeId, department },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({
          title: "Success!",
          text: "Department assigned successfully",
          icon: "success",
          confirmButtonColor: "#4F46E5",
        });
        fetchEmployees();
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Failed to assign department",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (
    employeeId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setShowDropdown(null);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#4F46E5",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        await Api.delete(`/api/v1/users/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
        Swal.fire({
          title: "Deleted!",
          text: "Employee has been deleted.",
          icon: "success",
          confirmButtonColor: "#4F46E5",
        });
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        Swal.fire({
          title: "Error",
          text: err.response?.data?.message || "Failed to delete employee",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleDropdown = (employeeId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowDropdown(showDropdown === employeeId ? null : employeeId);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          <span className="text-indigo-900">{employees.length}</span> Employee
        </h2>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="mt-3 sm:mt-0 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
        >
          + Add Employees
        </button>
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
          {filteredEmployees.map((emp) => {
            const avatar =
              emp.profile?.avatarUrl ||
              `https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=0D8ABC&color=fff`;

            return (
              <div
                key={emp._id}
                className="bg-white p-4 rounded-2xl shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={`${emp.firstName} ${emp.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {emp.profile?.position || "No position"}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <FiMoreHorizontal
                      className="text-gray-400 cursor-pointer"
                      onClick={(e) => toggleDropdown(emp._id, e)}
                    />
                    {showDropdown === emp._id && (
                      <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <Link
                          to={`/SingleEmployeedetails/${emp._id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(null);
                          }}
                        >
                          View Details
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          onClick={(e) => handleAssignDepartment(emp._id, e)}
                        >
                          Assign Department
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={(e) => handleDeleteUser(emp._id, e)}
                        >
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {emp.profile?.address || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {emp.profile?.department || "N/A"}
                  </p>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiMail className="text-indigo-900" /> {emp.email || "N/A"}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-indigo-900" />{" "}
                    {emp.profile?.phone || "N/A"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Employee Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg transform transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Create New User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "firstName", placeholder: "First Name", type: "text" },
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
  );
};

export default EmployeesDetails;
