import React, { useState } from "react";
import Logo from "../Components/Reuseable/Logo";
import Button from "../Components/Reuseable/Button";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    // TODO: API call to send password reset link
    console.log("Password reset requested for:", email);

    setSuccess(true);
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
              Forgot Password
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
          {success && (
            <p className="text-sm text-green-600 mb-4">
              If this email is registered, you’ll receive a reset link shortly.
            </p>
          )}

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
            <Link to="/reset">
              <Button
                title="Send Reset Link"
                bg="#5B5CE6"
                textColor="white"
                borderColor="transparent"
                hoverr="hover:bg-indigo-700"
              />
            </Link>
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
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center p-10 lg:h-full  max-[900px]:hidden">
        <div className="text-center text-white max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
            Reset your password easily.
          </h2>
          <p className="text-base opacity-90 mb-10">
            We’ll email you a secure link so you can create a new password.
          </p>
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-lg">
            <img
              src="src/assets/dashboard.png"
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
