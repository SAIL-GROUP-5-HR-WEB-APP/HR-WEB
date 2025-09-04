import { Link } from "react-router-dom";
import { LuUsers, LuArrowRight } from "react-icons/lu";

interface DepartmentCardProps {
  id: string;
  name: string;
  employeeCount: number;
}

const DepartmentCard = ({ id, name, employeeCount }: DepartmentCardProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 rounded-2xl hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all duration-300 transform hover:scale-105">
      {/* Department name */}
      <h3 className="text-xl font-extrabold text-white mb-4">{name}</h3>

      {/* Number of users */}
      <div className="flex items-center space-x-2 text-white/90 mb-6">
        <LuUsers size={24} className="text-white" />
        <p className="text-lg font-bold">{employeeCount} Users</p>
      </div>

      {/* Link to department details */}
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
