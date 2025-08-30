import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { LuLogOut } from "react-icons/lu";
import Api from "./Api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const HrDashboardSidebar = () => {
  const navigate = useNavigate();

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
        // Call logout API (optional)
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

  return (
    <div className="bg-gradient-to-b from-black via-gray-800 to-gray-600 text-white h-screen w-[240px] px-6 py-8 shadow-lg flex flex-col justify-between">
      <div className="text-xl font-semibold mb-8 text-center bg-gray-700/50 p-3 rounded-lg">
        HR Dashboard
      </div>
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/employees"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <UserGroupIcon className="h-5 w-5 mr-3" />
            Employees
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/leave"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <CalendarDaysIcon className="h-5 w-5 mr-3" />
            Leave
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/attendance"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <CalendarIcon className="h-5 w-5 mr-3" />
            <li>Attendance</li>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/department"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-3" />
            Departments
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/payroll"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-indigo-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            <BanknotesIcon className="h-5 w-5 mr-3" />
            Payroll
          </NavLink>
        </li>

        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center p-2 rounded-lg transition-colors duration-200 hover:bg-gray-700"
          >
            <LuLogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </li>
      </ul>
      <div className="mt-auto text-center text-sm text-gray-400 p-4">
        &copy; 2025 HR Solutions
      </div>
    </div>
  );
};

export default HrDashboardSidebar;
