import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Api from "../Components/Reuseable/Api";
import { LuArrowLeft, LuUsers } from "react-icons/lu";

interface Department {
  _id: string;
  name: string;
  description?: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: {
    position?: string;
    avatarUrl?: string;
  };
}

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>(); // <-- string (ObjectId)
  const [department, setDepartment] = useState<Department | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingDept, setLoadingDept] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

    const loadDepartment = async () => {
      setLoadingDept(true);
      setError(null);
      try {
        // fetch all departments and find this one (since no single-dept endpoint was provided)
        const { data: depts } = await Api.get<Department[]>(
          "/api/v1/departments",
          { headers }
        );
        const found = depts.find((d) => d._id === id) || null;
        setDepartment(found);
        if (!found) {
          setError("Department not found.");
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load department.");
      } finally {
        setLoadingDept(false);
      }
    };

    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data } = await Api.get<User[]>(
          `/api/v1/departments/${id}/users`,
          { headers }
        );
        setUsers(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "Failed to load department users."
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    loadDepartment();
    loadUsers();
  }, [id]);

  return (
    <div className="min-h-screen w-full flex flex-col p-4 md:p-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard/department"
            className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900"
          >
            <LuArrowLeft />
            <span>Back to Departments</span>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-600 p-6 rounded-2xl shadow-[0_0_25px_rgba(124,58,237,0.7)] text-white mb-6">
          {loadingDept ? (
            <h2 className="text-xl font-bold">Loading department…</h2>
          ) : department ? (
            <>
              <h2 className="text-2xl font-extrabold mb-1">
                {department.name}
              </h2>
              {department.description && (
                <p className="text-indigo-200">{department.description}</p>
              )}
            </>
          ) : (
            <h2 className="text-xl font-bold">Department</h2>
          )}
        </div>

        {/* Users */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="bg-white rounded-2xl shadow p-4">
          <div className="flex items-center gap-2 mb-4">
            <LuUsers />
            <h3 className="text-lg font-semibold">
              Users {loadingUsers ? "(loading…)" : `(${users.length})`}
            </h3>
          </div>

          {!loadingUsers && users.length === 0 && (
            <p className="text-gray-500">No users in this department yet.</p>
          )}

          {!loadingUsers && users.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="border rounded-xl p-4 hover:shadow transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        u.profile?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${u.firstName} ${u.lastName}`
                        )}&background=4F46E5&color=fff`
                      }
                      alt={`${u.firstName} ${u.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {u.profile?.position || "—"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mt-3 text-gray-700">{u.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
