import React, { useState, useEffect } from "react";
// import Api from "../Components/Reuseable/Api";
import { LuTrophy, LuRefreshCw } from "react-icons/lu";
// import { useNavigate } from "react-router-dom";

// interface Employee {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

interface VoteResult {
  name: string;
  count: number;
}

const HRVoteLeaderboard: React.FC = () => {
  const [votes, setVotes] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //   const token = localStorage.getItem("authToken");
  //   const navigate = useNavigate();

  // Current date and time for display
  const currentDateTime = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  useEffect(() => {
    // Simulate dummy data
    const dummyVotes: VoteResult[] = [
      { name: "Aisha Johnson", count: 15 },
      { name: "Liam Smith", count: 12 },
      { name: "Kofi Mensah", count: 10 },
      { name: "Priya Sharma", count: 8 },
    ];
    setVotes(dummyVotes);
    setLoading(false);
  }, []);

  const refreshVotes = async () => {
    setLoading(true);
    setError(null);
    // Simulate refresh with same dummy data
    const dummyVotes: VoteResult[] = [
      { name: "Aisha Johnson", count: 15 },
      { name: "Liam Smith", count: 12 },
      { name: "Kofi Mensah", count: 10 },
      { name: "Priya Sharma", count: 8 },
    ];
    setVotes(dummyVotes);
    setLoading(false);
  };

  if (loading)
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-indigo-200 dark:border-indigo-900">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
              <LuTrophy size={32} className="text-yellow-500" />
              <span>Employee of the Month Leaderboard</span>
            </h1>
            <button
              onClick={refreshVotes}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <LuRefreshCw size={18} className="animate-spin-slow" />
              <span>Refresh</span>
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Last updated: {currentDateTime} WAT
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-indigo-100 dark:bg-indigo-900 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Employee</th>
                  <th className="p-4 font-semibold">Votes</th>
                </tr>
              </thead>
              <tbody>
                {votes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="p-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No votes recorded yet.
                    </td>
                  </tr>
                ) : (
                  votes
                    .sort((a, b) => b.count - a.count)
                    .map((vote, index) => (
                      <tr
                        key={vote.name}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                      >
                        <td className="p-4 text-gray-900 dark:text-gray-100 font-medium">
                          {index + 1}
                        </td>
                        <td className="p-4 text-gray-900 dark:text-gray-100">
                          {vote.name}
                        </td>
                        <td className="p-4 text-gray-900 dark:text-gray-100 font-bold">
                          {vote.count}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// Custom CSS for animation
const style = document.createElement("style");
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 2s linear infinite;
  }
`;
document.head.appendChild(style);

export default HRVoteLeaderboard;
