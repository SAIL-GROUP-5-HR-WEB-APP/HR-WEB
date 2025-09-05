import React, { useState, useEffect } from "react";
import Api from "../Components/Reuseable/Api";
import { useNavigate } from "react-router-dom";

interface Survey {
  _id: string;
  responses: { question: string; answer: number }[];
  comments: string;
  createdAt: string;
}

const Feedback: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!token) {
        setError("Please log in to view surveys");
        setLoading(false);
        return;
      }
      try {
        const res = await Api.get("/api/v1/surveys", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSurveys(res.data);
      } catch (err) {
        setError("Failed to fetch surveys");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [token]);

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-bold text-gray-900 flex items-center space-x-4">
              <span>Mental Health Survey Overview</span>
            </h2>
            <p className="text-sm text-gray-500">
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
            </p>
          </div>
          <div className="overflow-y-auto max-h-[600px] pr-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-600 text-lg">{error}</p>
            ) : surveys.length === 0 ? (
              <p className="text-center text-gray-500 text-lg">
                No surveys submitted yet.
              </p>
            ) : (
              surveys.map((survey) => (
                <div
                  key={survey._id}
                  className="mb-6 bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-md border border-indigo-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <p className="text-sm text-gray-600 mb-4">
                    Submitted:{" "}
                    {new Date(survey.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {survey.responses.map((response, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {response.question}
                        </span>
                        <span className="text-indigo-600 text-2xl font-bold">
                          {response.answer} / 5
                        </span>
                      </div>
                    ))}
                  </div>
                  {survey.comments && (
                    <div>
                      <span className="font-semibold text-gray-800">
                        Comments:
                      </span>
                      <p className="text-gray-600 mt-2 p-4 bg-white rounded-lg border border-indigo-100">
                        {survey.comments}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
