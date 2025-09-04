import { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api"; // ✅ use your Api wrapper
import DepartmentCard from "./DepartmentCard";
import { LuBuilding2 } from "react-icons/lu";

const Departments = () => {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await Api.get("/api/v1/departments");
        setDepartments(data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      <header className="max-w-6xl mx-auto w-full mb-8 text-center">
        <div className="p-6 rounded-full shadow-lg max-w-lg mx-auto bg-gradient-to-r from-indigo-900 to-indigo-600">
          <div className="flex items-center justify-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-extrabold text-white">
              <LuBuilding2 />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Departments</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept: any) => (
            <DepartmentCard
              key={dept._id}
              id={dept._id}
              name={dept.name}
              employeeCount={dept.employeeCount || 0}
              openPositions={dept.openPositions || 0}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Departments;
