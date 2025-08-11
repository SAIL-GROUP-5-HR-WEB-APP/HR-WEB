import React, { useState } from 'react';
import Logo from '../Components/Reuseable/Logo';
import PasswordInput from '../Components/Reuseable/PasswordInput';
import SocialButton from '../Components/Reuseable/SocialButton';
import Button from '../Components/Reuseable/Button';

// Define the shape of the form data for type safety
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Main SignupPage component for user registration
const SignupPage: React.FC = () => {
  // State for form inputs
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // State for form errors
  const [errors, setErrors] = useState<Partial<FormData>>({});
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // State for submission status
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      // TODO: Replace with actual API call
      // Example:
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error('Signup failed');
    } catch (error) {
      setSubmitError('An error occurred during signup. Please try again.');
    }
  };

  // Handle Google signup
  const handleGoogleSignup = () => {
    console.log('Signup with Google');
    // TODO: Add Google OAuth integration
  };

  // Handle Apple signup
  const handleAppleSignup = () => {
    console.log('Signup with Apple');
    // TODO: Add Apple OAuth integration
  };

  return (
    // Main container with padding for Header and Footer
    <div className="flex min-h-screen bg-white lg:flex-row flex-col pt-16 pb-16">
      {/* Form Section */}
      <div className="lg:w-1/2 w-full max-w-md mx-auto p-8 flex flex-col justify-center">
        {/* Logo */}
        <div className="mb-12">
          <Logo />
        </div>

        {/* Form Content */}
        <div className="max-w-sm mx-auto w-full">
          {/* Form Header */}
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
            <p className="text-sm text-gray-600">
              Join now to streamline your HR management experience
            </p>
          </div>

          {/* Submission Error */}
          {submitError && (
            <p className="text-sm text-red-500 mb-4" role="alert">
              {submitError}
            </p>
          )}

          {/* Signup Form */}
          <form className="flex flex-col gap-6 mb-8" onSubmit={handleSubmit} noValidate>
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tommy Hill"
                value={formData.name}
                onChange={handleInputChange}
                required
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
                className={`p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-red-500 mt-1">
                  {errors.name}
                </p>
              )}
            </div>

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

            {/* Confirm Password Input */}
            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="group5HRsystems"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <Button
              title="Sign Up"
              bg="#5B5CE6"
              textColor="white"
              borderColor="transparent"
              hoverr="hover:bg-indigo-700"
            />
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-sm text-gray-500 bg-white">Or sign up with</span>
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
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
              text="Google"
              onClick={handleGoogleSignup}
            />
            <SocialButton
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                </svg>
              }
              text="Apple"
              onClick={handleAppleSignup}
            />
          </div>

          {/* Sign In Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 font-medium hover:underline">
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="lg:w-1/2 w-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center p-10">
        <div className="text-center text-white max-w-lg">
          <h2 className="text-3xl font-bold mb-4 lg:text-4xl">
            Effortlessly manage your team and operations.
          </h2>
          <p className="text-base opacity-90 mb-10">
            Sign up to access your HR dashboard and manage your team.
          </p>
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-lg">
            <img
              src="src/assets/dashbod.png"
              alt="Dashboard Preview"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;