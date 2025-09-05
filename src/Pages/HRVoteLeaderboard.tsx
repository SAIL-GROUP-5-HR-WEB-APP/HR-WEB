import React, { useState, useEffect } from "react";
import Api from "../Components/Reuseable/Api";
import { LuTrophy, LuRefreshCw } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

interface VoteResult {
  name: string;
  count: number;
}

const HRVoteLeaderboard: React.FC = () => {
  const [votes, setVotes] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("authToken");

  // Current month and time for display
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-09"
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
    const fetchLeaderboard = async () => {
      if (!token) {
        setError("Please log in to view the leaderboard");
        setLoading(false);
        return;
      }
      try {
        const res = await Api.get(`/api/v1/voting?month=${currentMonth}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVotes(res.data.sort((a: any, b: any) => b.count - a.count));
      } catch (err) {
        setError("Failed to fetch leaderboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token, currentMonth]);

  const refreshVotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await Api.get(`/api/v1/voting?month=${currentMonth}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVotes(res.data.sort((a: any, b: any) => b.count - a.count));
    } catch (err) {
      setError("Failed to refresh leaderboard data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <LuTrophy size={32} className="text-indigo-600" />
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
          <p className="text-gray-600 mb-4 text-sm">
            Last updated: {currentDateTime} WAT (Month: {currentMonth})
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-indigo-50 text-gray-700">
                <tr>
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Employee</th>
                  <th className="p-4 font-semibold">Votes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : votes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      No votes recorded yet for {currentMonth}.
                    </td>
                  </tr>
                ) : (
                  votes.map((vote, index) => (
                    <tr
                      key={vote.name}
                      className="border-b border-gray-200 hover:bg-indigo-50 transition-all duration-200"
                    >
                      <td className="p-4 text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="p-4 text-gray-900">{vote.name}</td>
                      <td className="p-4 text-gray-900 font-bold">
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
