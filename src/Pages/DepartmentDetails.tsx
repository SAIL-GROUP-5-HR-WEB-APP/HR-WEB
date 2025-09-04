// src/pages/admin/DepartmentDetails.tsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuBuilding2, LuMail, LuArrowLeft } from "react-icons/lu";
import Api from "../Components/Reuseable/Api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
}

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartmentUsers = async () => {
    setLoading(true);
    try {
      // Fetch department list to get name
      const { data: departments } = await Api.get(`/api/v1/departments`);
      const dept = departments.find((d: any) => d._id === id);
      if (dept) setDepartmentName(dept.name);

      // Fetch users inside department
      const { data: usersData } = await Api.get(
        `/api/v1/departments/${id}/users`
      );
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching department details:", err);
      setError("Failed to load department details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentUsers();
  }, [id]);

  if (loading) return <p className="text-center py-6">Loading department...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      <header className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex justify-center gap-5 items-center mb-6 ">
          <Link
            to="/dashboard/department"
            className="flex items-center space-x-2 text-black hover:text-gray-800 transition-colors duration-300"
          >
            <LuArrowLeft size={20} />
            <span className="text-lg">Back to Departments</span>
          </Link>
          <div className="p-4 rounded-full shadow-lg max-w-lg bg-gradient-to-r from-indigo-900 to-indigo-600">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-extrabold text-white">
                <LuBuilding2 />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                {departmentName} Department
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full mt-8">
        <h2 className="text-2xl font-bold text-black mb-6">Employees</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No employees in this department.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((employee) => (
              <div
                key={employee._id}
                className="bg-indigo-800 p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <h3 className="text-xl font-extrabold text-white mb-2">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-indigo-200 text-sm font-medium mb-1">
                  {employee.position || "Employee"}
                </p>
                <div className="flex items-center space-x-2 text-indigo-300">
                  <LuMail size={16} />
                  <a
                    href={`mailto:${employee.email}`}
                    className="hover:underline"
                  >
                    {employee.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DepartmentDetails;
