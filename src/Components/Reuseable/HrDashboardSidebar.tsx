import { NavLink } from "react-router-dom";

const HrDashboardSidebar = () => {
  return (
    <div className="bg-gray-100 h-screen w-[220px] px-5 py-10 ">
      <ul className="space-y-6">
        <li>
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/employees"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Employees
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/leave"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Leave
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/department"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Departments
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/payroll"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Payroll
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default HrDashboardSidebar;
