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
  role?: string; // Added role to determine admin status
}

interface VoteResult {
  name: string;
  count: number;
}

const MySwal = withReactContent(Swal);

const EmployeeVotingSection: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [votes, setVotes] = useState<VoteResult[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin"; // Check if user is admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await Api.get("/api/v1/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(
          res.data.filter((user: Employee) => user.role !== "admin")
        ); // Exclude admins from voting list
      } catch (err) {
        setError("Failed to fetch employees");
      }
    };

    const fetchVotes = async () => {
      try {
        const res = await Api.get("/api/v1/votes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVotes(res.data);
      } catch (err) {
        setError("Failed to fetch votes");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
    if (isAdmin) fetchVotes(); // Only fetch votes if admin
  }, [token, isAdmin]);

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
          "/api/v1/votes",
          { nomineeId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSelectedEmployee(nomineeId);
        if (isAdmin) {
          const res = await Api.get("/api/v1/votes", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setVotes(res.data);
        }
        setError(null);

        await MySwal.fire({
          title: "Vote Recorded!",
          text: "Thank you for voting. Redirecting to dashboard...",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard");
      } catch (err: any) {
        setError(err.response?.data?.message || "Voting failed");
        await MySwal.fire({
          title: "Error",
          text: error || "Voting failed. Please try again.",
          icon: "error",
        });
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="font-bold text-2xl text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
        <LuThumbsUp size={28} className="text-blue-500" />
        <span>Vote for Employee of the Month</span>
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Cast your vote to boost morale and recognize outstanding performance!
      </p>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {employees.map((employee) => {
          const isVoted = selectedEmployee === employee._id;
          return (
            <div
              key={employee._id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                {employee.firstName} {employee.lastName} ({employee.email})
              </span>
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Votes:{" "}
                    {votes.find(
                      (v) =>
                        v.name === `${employee.firstName} ${employee.lastName}`
                    )?.count || 0}
                  </span>
                )}
                <button
                  onClick={() => handleVote(employee._id)}
                  disabled={isVoted}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isVoted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  } transition-colors duration-300`}
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
