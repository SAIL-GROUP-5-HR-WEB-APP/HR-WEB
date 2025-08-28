import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

type Side = {
  handleToggle: () => void;
};

const Hrmside: React.FC<Side> = ({ handleToggle }) => {
  return (
    <motion.div
      initial={{ x: -250 }} // hidden off-screen
      animate={{ x: 0 }} // slide into view
      exit={{ x: -250 }} // slide out when closed
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white h-screen w-full px-5 py-10 shadow-lg"
    >
      <ul className="space-y-6">
        <li onClick={handleToggle}>
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

        <li onClick={handleToggle}>
          <NavLink
            to="/dashboard/employees"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Employees
          </NavLink>
        </li>

        <li onClick={handleToggle}>
          <NavLink
            to="/dashboard/leave"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Leave
          </NavLink>
        </li>

        <li onClick={handleToggle}>
          <NavLink
            to="/dashboard/department"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-800"
            }
          >
            Departments
          </NavLink>
        </li>

        <li onClick={handleToggle}>
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
    </motion.div>
  );
};

export default Hrmside;
