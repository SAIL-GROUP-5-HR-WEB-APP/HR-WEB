import React, { useState } from "react";
import Api from "../Components/Reuseable/Api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const AnonymousSurveyForm: React.FC = () => {
  const [responses, setResponses] = useState({
    stressLevel: "",
    supportFeeling: "",
    workLifeBalance: "",
    jobSatisfaction: "",
    workloadManageability: "",
    overallHappiness: "",
  });
  const [comments, setComments] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Please log in to submit a survey");
      return;
    }
    if (
      !responses.stressLevel ||
      !responses.supportFeeling ||
      !responses.workLifeBalance ||
      !responses.jobSatisfaction ||
      !responses.workloadManageability ||
      !responses.overallHappiness
    ) {
      setError("All response fields are required");
      return;
    }

    setLoading(true);
    try {
      const surveyData = {
        responses: [
          { question: "Stress Level", answer: parseInt(responses.stressLevel) },
          {
            question: "Feeling Supported",
            answer: parseInt(responses.supportFeeling),
          },
          {
            question: "Work-Life Balance",
            answer: parseInt(responses.workLifeBalance),
          },
          {
            question: "Job Satisfaction",
            answer: parseInt(responses.jobSatisfaction),
          },
          {
            question: "Workload Manageability",
            answer: parseInt(responses.workloadManageability),
          },
          {
            question: "Overall Happiness",
            answer: parseInt(responses.overallHappiness),
          },
        ],
        comments,
      };
      await Api.post(" /api/v1/surveys", surveyData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await MySwal.fire({
        title: "Survey Submitted!",
        text: "Thank you for your anonymous feedback. Redirecting to dashboard...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/EmployeeDashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit survey");
      await MySwal.fire({
        title: "Error",
        text: error || "Failed to submit survey. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Progress calculation based on filled responses
  const progress =
    (Object.values(responses).filter((value) => value !== "").length /
      Object.keys(responses).length) *
    100;

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen p-6 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-indigo-200 max-w-2xl w-full transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-bold text-gray-900 flex items-center space-x-4 animate-fade-in">
            <span role="img" aria-label="mental-health">
              🧠
            </span>
            <span>Anonymous Mental Health Survey</span>
          </h2>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            WAT
          </div>
        </div>
        <p className="text-gray-600 text-lg mb-6 animate-fade-in delay-100">
          Your anonymous feedback shapes our wellness initiatives. Complete the
          survey below!
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-600 text-center animate-shake">{error}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Stress Level (1-5)
              </label>
              <select
                value={responses.stressLevel}
                onChange={(e) =>
                  setResponses({ ...responses, stressLevel: e.target.value })
                }
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 (Very Low)</option>
                <option value="2">2 (Low)</option>
                <option value="3">3 (Moderate)</option>
                <option value="4">4 (High)</option>
                <option value="5">5 (Very High)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Feeling Supported (1-5)
              </label>
              <select
                value={responses.supportFeeling}
                onChange={(e) =>
                  setResponses({ ...responses, supportFeeling: e.target.value })
                }
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 (Not at All)</option>
                <option value="2">2 (Slightly)</option>
                <option value="3">3 (Moderately)</option>
                <option value="4">4 (Quite)</option>
                <option value="5">5 (Very)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Work-Life Balance (1-5)
              </label>
              <select
                value={responses.workLifeBalance}
                onChange={(e) =>
                  setResponses({
                    ...responses,
                    workLifeBalance: e.target.value,
                  })
                }
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 (Very Poor)</option>
                <option value="2">2 (Poor)</option>
                <option value="3">3 (Fair)</option>
                <option value="4">4 (Good)</option>
                <option value="5">5 (Excellent)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Job Satisfaction (1-5)
              </label>
              <select
                value={responses.jobSatisfaction}
                onChange={(e) =>
                  setResponses({
                    ...responses,
                    jobSatisfaction: e.target.value,
                  })
                }
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 (Very Dissatisfied)</option>
                <option value="2">2 (Dissatisfied)</option>
                <option value="3">3 (Neutral)</option>
                <option value="4">4 (Satisfied)</option>
                <option value="5">5 (Very Satisfied)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Workload Manageability (1-5)
              </label>
              <select
                value={responses.workloadManageability}
                onChange={(e) =>
                  setResponses({
                    ...responses,
                    workloadManageability: e.target.value,
                  })
                }
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 (Unmanageable)</option>
                <option value="2">2 (Difficult)</option>
                <option value="3">3 (Moderate)</option>
                <option value="4">4 (Manageable)</option>
                <option value="5">5 (Very Manageable)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Overall Happiness (1-5)
              </label>
              <select
                value={responses.overallHappiness}
                onChange={(e) =>
                  setResponses({
                    ...responses,
                    overallHappiness: e.target.value,
                  })
                }
                className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-300"
                required
              >
                <option value="">Select...</option>
                <option value="1">1 (Very Unhappy)</option>
                <option value="2">2 (Unhappy)</option>
                <option value="3">3 (Neutral)</option>
                <option value="4">4 (Happy)</option>
                <option value="5">5 (Very Happy)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full bg-white border border-indigo-200 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 h-32 resize-none transition-all duration-200 hover:border-indigo-300"
              placeholder="Share any thoughts anonymously..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-lg ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Survey"}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .delay-100 { animation-delay: 0.1s; }
      `}</style>
    </section>
  );
};

export default AnonymousSurveyForm;
