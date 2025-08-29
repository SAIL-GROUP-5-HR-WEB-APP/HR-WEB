import { useState, useEffect } from "react";
interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  emergencyContact: string;
  position: string;
  department: string;
  profileImage: File | null;
}

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<UserSettings>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    emergencyContact: "",
    position: "",
    department: "",
    profileImage: null as File | null,
  });

  // Simulate fetching user data (replace with actual API call)
  useEffect(() => {
    const userData: UserSettings = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1-555-123-4567",
      emergencyContact: "+1-555-987-6543",
      position: "Software Engineer",
      department: "Engineering",
      profileImage: null,
    };
    setFormData(userData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call or further logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-gray-100  p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-indigo-100">
        <h1 className="text-4xl font-extrabold  mb-8 text-center tracking-tight">
          Update your information
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm text-gray-900"
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
                placeholder="Enter your first name"
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
            </div>
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
                placeholder="Enter your last name"
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
            </div>
          </div>
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
              placeholder="Enter your email"
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
          </div>
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
              placeholder="Enter your phone number"
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
          </div>
          <div className="relative group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Emergency Contact
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
              placeholder="Enter emergency contact"
            />
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
                placeholder="Enter your position"
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
            </div>
            <div className="relative group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white shadow-sm placeholder-gray-400 text-gray-900"
                placeholder="Enter your department"
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 transform hover:scale-105 shadow-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
