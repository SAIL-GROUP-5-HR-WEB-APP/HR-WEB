import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api"; // ✅ use Api wrapper
import {
  LuBuilding2,
  LuUsers,
  LuBriefcase,
  LuMail,
  LuArrowLeft,
} from "react-icons/lu";

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const { data } = await Api.get("/api/v1/departments");
        const dept = (data || []).find((d: any) => d._id === id);
        setDepartment(dept || null);
      } catch (err) {
        console.error("Error fetching department:", err);
      }
    };

    const fetchEmployees = async () => {
      try {
        const { data } = await Api.get(`/api/v1/departments/${id}/users`);
        setEmployees(data || []);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };

    fetchDepartment();
    fetchEmployees();
  }, [id]);

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Department Not Found</h2>
      </div>
    );
  }

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
                {department.name} Department
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 rounded-2xl shadow text-white">
          <h2 className="text-xl font-extrabold mb-4">Department Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <LuUsers size={24} />
              <div>
                <p className="text-sm font-medium">Total Employees</p>
                <p className="text-lg font-bold">{employees.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LuBriefcase size={24} />
              <div>
                <p className="text-sm font-medium">Open Roles</p>
                <p className="text-lg font-bold">0</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Employees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee: any) => (
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
      </main>
    </div>
  );
};

export default DepartmentDetails;
