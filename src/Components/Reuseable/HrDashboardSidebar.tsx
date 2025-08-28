import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const HrDashboardSidebar = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen w-[240px] px-6 py-8 shadow-lg">
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
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
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
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
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
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`
            }
          >
            <CalendarDaysIcon className="h-5 w-5 mr-3" />
            Leave
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/department"
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
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
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
              }`
            }
          >
            <BanknotesIcon className="h-5 w-5 mr-3" />
            Payroll
          </NavLink>
        </li>
      </ul>
      <div className="mt-auto text-center text-sm text-gray-400 p-4">
        &copy; 2025 HR Solutions
      </div>
    </div>
  );
};

export default HrDashboardSidebar;