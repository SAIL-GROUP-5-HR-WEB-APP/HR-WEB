import { LuUsers, LuBriefcase, LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";

// ✅ relaxed typing
interface DepartmentCardProps {
  id: string;
  name: string;
  employeeCount: number;
  openPositions: number;
}

const DepartmentCard = ({
  id,
  name,
  employeeCount,
  openPositions,
}: DepartmentCardProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 rounded-2xl hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all duration-300 transform hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-extrabold text-white text-shadow">
          {name}
        </h3>
        <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ID: {id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2 text-white/80">
          <LuUsers size={24} className="text-white" />
          <div>
            <p className="text-sm font-medium">Employees</p>
            <p className="text-lg font-bold">{employeeCount}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-white/80">
          <LuBriefcase size={24} className="text-white" />
          <div>
            <p className="text-sm font-medium">Open Roles</p>
            <p className="text-lg font-bold">{openPositions}</p>
          </div>
        </div>
      </div>

      <Link
        to={`/dashboard/department/${id}`}
        className="w-full bg-indigo-500 text-white py-3 px-4 rounded-md flex items-center justify-center space-x-2 hover:bg-indigo-600 transition-all duration-300 hover:rounded-2xl"
      >
        <span>View Details</span>
        <LuArrowRight />
      </Link>
    </div>
  );
};

export default DepartmentCard;
