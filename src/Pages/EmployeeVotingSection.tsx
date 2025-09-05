import React, { useState, useEffect } from "react";
import Api from "../Components/Reuseable/Api";
import { LuThumbsUp } from "react-icons/lu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

const MySwal = withReactContent(Swal);

const EmployeeVotingSection: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Current date for welcome message
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await Api.get("/api/v1/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(
          res.data.filter((user: Employee) => user.role !== "admin")
        );
      } catch (err) {
        setError("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [token]);

  const handleVote = async (nomineeId: string) => {
    if (!token) {
      setError("Please log in to vote");
      return;
    }
    if (selectedEmployee) {
      setError("You can only vote once per month");
      return;
    }

    const result = await MySwal.fire({
      title: "Confirm Vote",
      text: `Are you sure you want to vote for ${
        employees.find((e) => e._id === nomineeId)?.firstName
      } ${employees.find((e) => e._id === nomineeId)?.lastName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, vote!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await Api.post(
          "/api/v1/voting",
          { nomineeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedEmployee(nomineeId);
        setError(null);

        await MySwal.fire({
          title: "Vote Recorded!",
          text: "Thank you for voting. Redirecting to dashboard...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/EmployeeDashboard");
      } catch (err: any) {
        setError(err.response?.data?.message || "Voting failed");
        await MySwal.fire({
          title: "Error",
          text: error || "Voting failed. Please try again.",
          icon: "error",
        });
      }
      navigate("/EmployeeDashboard");
    }
  };

  if (loading)
    return <div className="text-center py-6 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-6 text-red-600">{error}</div>;

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6  rounded-2xl shadow-lg max-w-3xl mx-auto my-auto">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 mb-6">
        <LuThumbsUp size={32} className="text-indigo-600" />
        <span>Vote for Employee of the Month</span>
      </h2>
      <p className="text-gray-600 text-lg mb-6">
        Welcome! Today is {currentDate} WAT. Cast your vote to boost morale and
        recognize outstanding performance!
      </p>
      <div className="space-y-4 max-h-[450px] overflow-y-auto">
        {employees.map((employee) => {
          const isVoted = selectedEmployee === employee._id;
          return (
            <div
              key={employee._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-indigo-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-semibold text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </span>
                  <p className="text-sm text-gray-600">{employee.email}</p>
                </div>
                <button
                  onClick={() => handleVote(employee._id)}
                  disabled={isVoted}
                  className={`px-6 py-3 rounded-lg text-white font-medium ${
                    isVoted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } transition-colors duration-300 shadow-md`}
                >
                  {isVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EmployeeVotingSection;
