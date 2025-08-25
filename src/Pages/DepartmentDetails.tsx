// 3. DepartmentDetails.tsx (This is the new file you need to create)
// File Location: src/Pages/DepartmentDetails.tsx
// Changes: A brand new file.

import { useParams, Link } from "react-router-dom";
import { LuBuilding2, LuUsers, LuBriefcase, LuMail, LuArrowLeft } from "react-icons/lu";
import departmentsData from "./DepartmentsData"; // Import the data from the same directory

const DepartmentDetails = () => {
  // Get the department ID from the URL parameters
  const { id } = useParams<{ id: string }>();
  const departmentId = parseInt(id as string, 10);

  // Find the department data based on the ID
  const department = departmentsData.find(dept => dept.id === departmentId);

  // Handle case where department is not found
  if (!department) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-extrabold text-white mb-4">Department Not Found</h1>
        <p className="text-gray-400 mb-6">The department you are looking for does not exist.</p>
        <Link
          to="/dashboard/department"
          className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Go Back to Departments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      <header className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/dashboard/department" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300">
            <LuArrowLeft size={20} />
            <span className="text-lg">Back to Departments</span>
          </Link>
          <div className="p-4 rounded-full shadow-lg max-w-lg bg-gradient-to-r from-indigo-900 to-indigo-600">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-extrabold text-white">
                <LuBuilding2 />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                {department.name} Department
              </h1>
            </div>
          </div>
        </div>

        {/* Department Stats Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 rounded-2xl shadow-[0_0_25px_rgba(124,58,237,0.7)] text-white">
          <h2 className="text-xl font-extrabold mb-4">Department Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <LuUsers size={24} className="text-white" />
              <div>
                <p className="text-sm font-medium">Total Employees</p>
                <p className="text-lg font-bold">{department.employeeCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LuBriefcase size={24} className="text-white" />
              <div>
                <p className="text-sm font-medium">Open Roles</p>
                <p className="text-lg font-bold">{department.openPositions}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Employee List Section */}
      <main className="flex-1 max-w-6xl mx-auto w-full mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Employees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {department.employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-indigo-800 p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <h3 className="text-xl font-extrabold text-white mb-2">{employee.name}</h3>
              <p className="text-indigo-200 text-sm font-medium mb-1">{employee.title}</p>
              <div className="flex items-center space-x-2 text-indigo-300">
                <LuMail size={16} />
                <a href={`mailto:${employee.email}`} className="hover:underline">{employee.email}</a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Tailwind and animations styles */}
      <style>{`
        @keyframes pulse-once {
          0% { opacity: 0.8; transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes check {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .animate-pulse-once {
          animation: pulse-once 0.5s ease-in-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-in-out;
        }
        .animate-check {
          animation: check 0.3s ease-in-out;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default DepartmentDetails;
