import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../Components/Reuseable/Api";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const DepartmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    Api.get(`/api/v1/${id}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Users in Department</h2>
      {users.length === 0 ? (
        <p>No users in this department yet.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DepartmentDetails;
