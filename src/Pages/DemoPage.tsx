import React, { useState } from "react";
import { LuCalendar } from "react-icons/lu";

interface FormData {
  firstName: string;
  lastName: string;
  Email: string;
  role: string;
}

const DemoPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    Email: "",
    role: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.Email.trim()) {
      newErrors.Email = " email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = "Please enter a valid email address";
    }
    if (!formData.role) newErrors.role = "role size is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      console.log("Form submitted:", formData);
      // Here you would typically send the data to an API
      alert("Demo booked successfully! We will contact you soon.");
      setFormData({
        firstName: "",
        lastName: "",
        Email: "",
        role: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-8">
        {/* Main Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ZyraHR
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            is the best way to manage your HR globally
          </h2>
          <p className="text-gray-600 mb-6">
            Streamline HR processes easier than ever. Minimize compliance risks
            with ZyraHR Premium and Employee of Record. Plus, automate
            onboarding, and leave management in minutes.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full md:w-96 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">⭐</span>
              <span className="text-sm text-gray-600">
                4.8/5 | 9,839 Reviews
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Book a free 30-minute product demo
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Experience a personalized product demo and get all your questions
            answered by our HR experts.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder=" email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.Email && (
                <p className="text-red-500 text-sm">{errors.Email}</p>
              )}
            </div>
            <div>
              <select
                name="companySize"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">What role would you like?</option>
                <option value="1-10">HR</option>
                <option value="11-50">Admin</option>
                <option value="51-200">Employee</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>

            <p className="text-xs text-gray-500">
              We respect your data. By submitting this form, you agree that we
              will contact you in relation to our products and services, in
              accordance with our privacy policy.
            </p>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <LuCalendar size={20} />
              submit
            </button>
          </form>
          {isSubmitted && (
            <p className="text-green-500 text-sm mt-2">
              Form submitted successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
