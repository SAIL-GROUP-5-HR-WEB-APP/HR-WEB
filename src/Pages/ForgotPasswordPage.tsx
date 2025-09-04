import { useState } from "react";
import { ClipLoader } from "react-spinners";
import Logo from "../Components/Reuseable/Logo";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Components/Reuseable/Api";
import dash from "../assets/dashboard.png";

const navigate = useNavigate();

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      const res = await Api.post("/api/v1/auth/forgot-password", { email });

      if (res.status === 201 || res.status === 200) {
        setSuccess("Reset link has been sent to your email");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred, please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
    navigate("/OTP");
  };

  return (
    <div className="flex min-h-screen lg:h-screen bg-white lg:flex-row flex-col">
      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center p-8 lg:h-full">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Change Password
            </h1>
            <p className="text-sm text-gray-600">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-4" role="alert">
              {error}
            </p>
          )}
          {success && <p className="text-sm text-green-600 mb-4">{success}</p>}

          <form className="flex flex-col gap-6 mb-8" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`p-3 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div className="relative">
              {loading ? (
                <div className="flex items-center justify-center px-4 py-3 bg-indigo-600 rounded-lg">
                  <ClipLoader color="#ffffff" size={24} />
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </form>

          <div className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center p-10 lg:h-full max-[900px]:hidden">
        <div className="text-center text-white max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
            Reset your password easily.
          </h2>
          <p className="text-base opacity-90 mb-10">
            We’ll email you a secure OTP so you can create a new password.
          </p>
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-lg">
            <img
              src={dash}
              alt="Password Reset Illustration"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
