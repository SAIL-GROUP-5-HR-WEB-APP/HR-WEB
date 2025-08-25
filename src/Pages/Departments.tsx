// 1. departments.tsx (This file displays all departments)
// File Location: src/Pages/departments.tsx
// Changes: Corrected the import path for departmentsData.

import DepartmentCard from "./DepartmentCard";
import { LuBuilding2 } from "react-icons/lu";
import departmentsData from "./DepartmentsData"; // Corrected import path

const Departments = () => {
  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      <header className="max-w-6xl mx-auto w-full mb-8 text-center">
        <div className="p-6 rounded-full shadow-lg max-w-lg mx-auto bg-gradient-to-r from-indigo-900 to-indigo-600">
          <div className="flex items-center justify-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-extrabold text-white">
              <LuBuilding2 />
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Department Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentsData.map((dept) => (
            <DepartmentCard
              key={dept.id}
              id={dept.id}
              name={dept.name}
              employeeCount={dept.employeeCount}
              openPositions={dept.openPositions}
            />
          ))}
        </div>
      </main>
      
      {/* Same style block as employee dashboard for animations */}
      <style>{`
        @keyframes pulse-once {
          0% { opacity: 0.8; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
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

export default Departments;