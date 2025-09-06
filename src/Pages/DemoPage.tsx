// src/components/DemoPage.tsx
import React, { useState } from "react";
import { LuCalendar } from "react-icons/lu";
import Api from "../Components/Reuseable/Api";

interface FormData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  rolePreference: string;
}

const DemoPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    rolePreference: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (!formData.rolePreference) newErrors.rolePreference = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await Api.post("/api/v1/demo", formData);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        rolePreference: "",
      });
      setErrors({});
      setErrorMessage("");
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.errors?.[0]?.msg ||
          "Failed to submit demo request. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center justify-center p-4">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ZyraHR
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          The best way to manage your HR globally
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Streamline HR processes easier than ever. Minimize compliance risks
          with ZyraHR Premium and Employee of Record. Plus, automate onboarding
          and leave management in minutes.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-8">
        {/* Form Card */}
        <div className="w-full md:w-96 bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Book product demo
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Experience a personalized product demo and get all your questions
            answered by our HR experts.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>
            <div>
              <select
                name="rolePreference"
                value={formData.rolePreference}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
              {errors.rolePreference && (
                <p className="text-red-500 text-sm">{errors.rolePreference}</p>
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
              Submit
            </button>
          </form>
          {isSubmitted && (
            <p className="text-green-500 text-sm mt-2">
              Demo request submitted successfully!
            </p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {/* Dummy Cards */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Automate Onboarding
            </h4>
            <p className="text-sm text-gray-600">
              Streamline your onboarding process with automated workflows and
              compliance checks.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Global Compliance
            </h4>
            <p className="text-sm text-gray-600">
              Ensure compliance with local labor laws across multiple countries.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Leave Management
            </h4>
            <p className="text-sm text-gray-600">
              Manage employee leave requests effortlessly with our intuitive
              system.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              24/7 Support
            </h4>
            <p className="text-sm text-gray-600">
              Get round-the-clock support from our dedicated HR experts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
