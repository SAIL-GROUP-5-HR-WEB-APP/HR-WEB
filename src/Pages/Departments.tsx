// src/pages/admin/Departments.tsx
import { useEffect, useState } from "react";
import DepartmentCard from "./DepartmentCard";
import { LuBuilding2 } from "react-icons/lu";
import Api from "../Components/Reuseable/Api";

interface Department {
  _id: string;
  name: string;
  description?: string;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get<Department[]>("/api/v1/departments");
      setDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (loading)
    return <p className="text-center py-6">Loading departments...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
        {departments.length === 0 ? (
          <p className="text-gray-500 text-center">No departments found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                id={dept._id}
                name={dept.name}
                employeeCount={0} // real count will be shown in details page
                openPositions={0} // optional, depends on your schema
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Departments;
