import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Logo from "../Components/Reuseable/Logo";
import PasswordInput from "../Components/Reuseable/PasswordInput";
import Button from "../Components/Reuseable/Button";
import Api from "../Components/Reuseable/Api";
import dash from "../assets/dashboard.png";

interface ResetPasswordData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordData>({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<ResetPasswordData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("resetEmail"); // Email saved from forgot password step

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetPasswordData> = {};
    if (!formData.otp) newErrors.otp = "OTP is required";
    if (!formData.newPassword) newErrors.newPassword = "Password is required";
    else if (formData.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccess(false);

    if (!validateForm()) return;
    if (!email) {
      setSubmitError("Email not found. Start the process again.");
      return;
    }

    try {
      setLoading(true);

      const res = await Api.post("/api/v1/auth/reset-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      if (res.status === 200) {
        setSuccess(true);
        localStorage.removeItem("resetEmail");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || "Invalid OTP or expired. Try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen lg:h-screen bg-white lg:flex-row flex-col">
      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center p-8 lg:h-full">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-10">
            <Logo />
          </div>

          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-gray-600">
              Enter the OTP sent to your email and choose a new password.
            </p>
          </div>

          {submitError && (
            <p className="text-sm text-red-500 mb-4">{submitError}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 mb-4">
              Password reset successful! Redirecting to{" "}
              <span className="font-medium">Login</span>...
            </p>
          )}

          <form className="flex flex-col gap-6 mb-8" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label>OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md"
                required
              />
            </div>

            <PasswordInput
              label="New Password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              error={errors.newPassword}
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

            <div className="relative">
              {loading ? (
                <div className="flex items-center justify-center px-4 py-3 bg-indigo-600 rounded-lg">
                  <ClipLoader color="#ffffff" size={24} />
                </div>
              ) : (
                <Button
                  title="Reset Password"
                  bg="#5B5CE6"
                  textColor="white"
                  borderColor="transparent"
                  hoverr="hover:bg-indigo-700"
                />
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center p-10 lg:h-full max-[900px]:hidden">
        <div className="text-center text-white max-w-lg w-full">
          <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
            Secure your account.
          </h2>
          <p className="text-base opacity-90 mb-10">
            Choose a strong password to keep your account safe.
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

export default ResetPasswordPage;
