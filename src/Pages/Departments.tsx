import { useEffect, useState } from "react";
import Api from "../Components/Reuseable/Api";
import DepartmentCard from "../Pages/DepartmentCard";

interface Department {
  _id: string;
  name: string;
  userCount: number;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    Api.get("/api/v1/departments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const departmentsData = await Promise.all(
          res.data.map(async (dept: any) => {
            const usersRes = await Api.get(`/api/v1/${dept._id}/users`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return {
              _id: dept._id,
              name: dept.name,
              userCount: usersRes.data.length,
            };
          })
        );
        setDepartments(departmentsData);
      })
      .catch((err) => {
        console.error("Failed to fetch departments", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept._id}
          id={dept._id}
          name={dept.name}
          employeeCount={dept.userCount}
        />
      ))}
    </div>
  );
};

export default Departments;
