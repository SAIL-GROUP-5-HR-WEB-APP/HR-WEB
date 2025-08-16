import React, { useState } from 'react';
import Logo from '../Components/Reuseable/Logo';
import PasswordInput from '../Components/Reuseable/PasswordInput';
import SocialButton from '../Components/Reuseable/SocialButton';
import Button from '../Components/Reuseable/Button';

// Define the shape of the form data for type safety
interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Main Login component for user authentication
const Login: React.FC = () => {
  // State for form inputs
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // State for form errors
  const [errors, setErrors] = useState<Partial<FormData>>({});
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  // State for submission status
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for the field being edited
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    try {
      console.log('Form submitted:', formData);
      // TODO: Replace with API call to backend
      // Example:
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Login failed');
      // Redirect to dashboard, e.g.:
      // window.location.href = '/dashboard';
    } catch (error) {
      setSubmitError('An error occurred during login. Please try again.');
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    console.log('Login with Google');
    // TODO: Add Google OAuth integration
  };

  // Handle Apple login
  const handleAppleLogin = () => {
    console.log('Login with Apple');
    // TODO: Add Apple OAuth integration
  };

  return (
    // Main container with padding for Header and Footer
    <div className="flex min-h-screen bg-white pt-16 pb-16">
      {/* Form Section */}
      <div className="w-full max-w-md mx-auto p-8 flex flex-col justify-center">
        {/* Logo */}
        <div className="mb-12">
          <Logo />
        </div>

        {/* Form Content */}
        <div className="max-w-sm mx-auto w-full">
          {/* Form Header */}
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-600">
              Enter your email and password to access your account
            </p>
          </div>

          {/* Submission Error */}
          {submitError && (
            <p className="text-sm text-red-500 mb-4" role="alert">
              {submitError}
            </p>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-6 mb-8" onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tommy@sailsdgroup5.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500 mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <PasswordInput
              label="Password"
              id="password"
              name="password"
              placeholder="group5HRsystems"
              value={formData.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-indigo-600 font-medium hover:underline">
                Forgot Your Password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              title="Login"
              bg="#5B5CE6"
              textColor="white"
              borderColor="transparent"
              hoverr="hover:bg-indigo-700"
            />
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">Or login with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex gap-3 mb-6 lg:flex-row flex-col">
            <SocialButton
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1