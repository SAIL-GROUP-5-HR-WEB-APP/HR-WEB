import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Api from "../Components/Reuseable/Api";

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email;

  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Redirect to signup if no email (e.g., page refresh)
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = async (): Promise<void> => {
    if (otp.length < 6) return; // Prevent submission if OTP is incomplete
    setLoading(true);
    setError("");

    try {
      const res = await Api.post("/api/v1/auth/verify-otp", {
        email,
        otp,
      });
      if (res.status === 200) {
        const { token, user } = res.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, isOnboarded: false })
        );
        localStorage.setItem("role", "employee"); // only employees signup

        navigate("/reset-password");
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

  if (!email) return null;

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

        <div className="relative mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-2 px-4 bg-blue-600 rounded-lg">
              <ClipLoader color="#ffffff" size={24} />
            </div>
          ) : (
            <button
              onClick={handleVerify}
              className={`w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 ${
                otp.length < 6 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
