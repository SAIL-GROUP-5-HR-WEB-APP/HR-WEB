import React, { useState } from "react";
import Logo from "../Components/Reuseable/Logo";
import PasswordInput from "../Components/Reuseable/PasswordInput";
import Button from "../Components/Reuseable/Button";
import { Link } from "react-router-dom";

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState<ResetPasswordData>({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<ResetPasswordData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordData> = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    if (!validateForm()) return;

    try {
      // TODO: Call your API with the reset token + new password
      console.log("Password reset submitted:", formData.password);

      setSuccess(true);
    } catch (error) {
      setSubmitError("An error occurred. Please try again.");
    }
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
              Reset Password
            </h1>
            <p className="text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          {submitError && (
            <p className="text-sm text-red-500 mb-4">{submitError}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 mb-4">
              Your password has been reset. You can now{" "}
              <a href="/login" className="underline font-medium">
                log in
              </a>
              .
            </p>
          )}

          <form className="flex flex-col gap-6 mb-8" onSubmit={handleSubmit}>
            <PasswordInput
              label="New Password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <PasswordInput
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              showPassword={showConfirmPassword}
              toggleShowPassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              error={errors.confirmPassword}
            />

            <Button
              title="Reset Password"
              bg="#5B5CE6"
              textColor="white"
              borderColor="transparent"
              hoverr="hover:bg-indigo-700"
            />
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
            Secure your account.
          </h2>
          <p className="text-base opacity-90 mb-10">
            Choose a strong password to keep your account safe.
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

export default ResetPasswordPage;
