import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../Components/Reuseable/Api"; // your axios instance

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email; // ✅ get email from signup

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ if no email (e.g. refresh), redirect back to signup
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await Api.post("/api/v1/auth/verify-otp", {
        email,
        otp,
      });

      if (res.status === 200) {
        navigate("/EmployeeDashboard"); // ✅ success → go dashboard
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "OTP verification failed");
      } else {
        setError("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null; // ✅ safeguard to avoid rendering without email

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Verify OTP</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-lg py-2 px-3 tracking-widest text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••"
        />

        {error && (
          <p className="text-sm text-red-600 text-center mt-2">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="mt-6 w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
