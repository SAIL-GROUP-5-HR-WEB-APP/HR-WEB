import { useEffect, useState } from "react";
import { LuBuilding2 } from "react-icons/lu";
import Api from "../Components/Reuseable/Api";
import DepartmentCard from "./DepartmentCard";

interface Department {
  _id: string;
  name: string;
  description?: string;
}

interface DepartmentWithCount extends Department {
  employeeCount: number;
}

const Departments = () => {
  const [departments, setDepartments] = useState<DepartmentWithCount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1) Fetch all departments
        const { data: depts } = await Api.get<Department[]>(
          "/api/v1/departments",
          { headers }
        );

        // 2) For each department, fetch its users to compute a count
        //    If your backend is large, consider adding an aggregation endpoint instead.
        const counts = await Promise.all(
          depts.map(async (d) => {
            try {
              const { data: users } = await Api.get<any[]>(
                `/api/v1/departments/${d._id}/users`,
                { headers }
              );
              return users?.length ?? 0;
            } catch {
              return 0; // fail-safe if a single dept users call fails
            }
          })
        );

        const withCounts: DepartmentWithCount[] = depts.map((d, idx) => ({
          ...d,
          employeeCount: counts[idx],
        }));

        setDepartments(withCounts);
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            "Failed to load departments. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      <header className="max-w-6xl mx-auto w-full mb-8 text-center">
        <div className="p-6 rounded-full shadow-lg max-w-lg mx-auto bg-gradient-to-r from-indigo-900 to-indigo-600">
          <div className="flex items-center justify-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-extrabold text-white">
              <LuBuilding2 />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Department</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        {loading && (
          <p className="text-center text-gray-600">Loading departments…</p>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                id={dept._id}
                name={dept.name}
                employeeCount={dept.employeeCount}
              />
            ))}
            {departments.length === 0 && (
              <p className="text-gray-500">No departments yet.</p>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse-once {
          0% { opacity: 0.8; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse-once { animation: pulse-once 0.5s ease-in-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Departments;
