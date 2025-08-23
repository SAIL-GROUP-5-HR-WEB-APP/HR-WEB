// src/pages/OtpPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../Components/Reuseable/Api";
interface LocationState {
  email: string;
}

const OTPmodal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = (location.state || {}) as LocationState;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await Api.post(
        "/verify-otp",
        { email, otp } // backend expects both
      );

      if (res.status === 200) {
        // OTP success → go to dashboard
        navigate("/EmployeeDashboard");
      }
    } catch (err: any) {
      if (err.response) {
        console.log(err);
        setError(err.response.data.message || "OTP verification failed");
      } else {
        setError("Network error, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-2">Enter OTP</h2>
        <p className="text-gray-600 text-sm text-center mb-4">
          We sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border rounded-lg py-2 px-3 tracking-widest text-center text-lg font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="••••••"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          className="mt-4 w-full bg-indigo-600 text-white rounded-lg py-2 px-4 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OTPmodal;
