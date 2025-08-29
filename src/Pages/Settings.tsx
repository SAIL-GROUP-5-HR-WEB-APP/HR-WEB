import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Api from "../Components/Reuseable/Api";

interface ProfileData {
  phone: string;
  address: string;
  department: string;
  position: string;
  emergencyContact: string;
  dateOfBirth: string;
  avatar: File | null;
  documents: File[] | null;
}

const Setting = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    phone: "",
    address: "",
    department: "",
    position: "",
    emergencyContact: "",
    dateOfBirth: "",
    avatar: null,
    documents: null,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const response = await Api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { profile } = response.data;
        setProfileData({
          phone: profile.phone || "",
          address: profile.address || "",
          department: profile.department || "",
          position: profile.position || "",
          emergencyContact: profile.emergencyContact || "",
          dateOfBirth: profile.dateOfBirth
            ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          avatar: null,
          documents: null,
        });
      } catch (err: any) {
        console.error("Fetch profile error:", err);
        setError(err.response?.data?.message || "Failed to load profile data.");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProfileData
  ) => {
    const value =
      field === "avatar"
        ? e.target.files?.[0] || null
        : field === "documents"
        ? Array.from(e.target.files || [])
        : e.target.value;
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      // Append text fields
      Object.entries(profileData).forEach(([key, value]) => {
        if (
          key !== "avatar" &&
          key !== "documents" &&
          value !== null &&
          value !== ""
        ) {
          formData.append(key, value as string);
        }
      });

      // Append avatar
      if (profileData.avatar) {
        formData.append("avatar", profileData.avatar);
      }

      // Append documents
      if (profileData.documents && profileData.documents.length > 0) {
        profileData.documents.forEach((doc) => {
          formData.append("documents", doc);
        });
      }

      await Api.put("/api/profile/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage for consistency
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.profile = {
        ...user.profile,
        ...profileData,
        dateOfBirth: profileData.dateOfBirth,
      };
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/EmployeeDashboard");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Update failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fieldVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-gray-100 flex items-center justify-center py-12 px-4">
      <AnimatePresence>
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Edit Profile
          </motion.h2>

          {fetching && (
            <p className="text-gray-600 text-center mb-4">Loading profile...</p>
          )}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              {
                id: "department",
                label: "Department",
                placeholder: "Sales",
                field: "department",
              },
              {
                id: "position",
                label: "Position",
                placeholder: "Auditor",
                field: "position",
              },
              {
                id: "phone",
                label: "Phone Number",
                placeholder: "+234 00000000",
                field: "phone",
              },
              {
                id: "emergencyContact",
                label: "Emergency Phone Number",
                placeholder: "+234 00000000",
                field: "emergencyContact",
              },
              {
                id: "address",
                label: "Address",
                placeholder: "83/84 Osapa London, Lekki",
                field: "address",
              },
              {
                id: "dateOfBirth",
                label: "Date of Birth",
                placeholder: "",
                field: "dateOfBirth",
                type: "date",
              },
            ].map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="relative group"
              >
                <label
                  htmlFor={item.id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {item.label}
                </label>
                <input
                  id={item.id}
                  type={item.type || "text"}
                  className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300 hover:border-indigo-700"
                  placeholder={item.placeholder}
                  value={profileData[item.field as keyof ProfileData] as string}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, item.field as keyof ProfileData)
                  }
                  disabled={fetching}
                />
              </motion.div>
            ))}

            <motion.div
              custom={6}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="relative group"
            >
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Image
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="w-full p-3 border border-indigo-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-700 file:text-white hover:file:bg-indigo-800 transition-colors duration-300"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "avatar")
                }
                disabled={fetching}
              />
            </motion.div>

            <motion.div
              custom={7}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="relative group"
            >
              <label
                htmlFor="documents"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Documents
              </label>
              <input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                className="w-full p-3 border border-indigo-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-700 file:text-white hover:file:bg-indigo-800 transition-colors duration-300"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "documents")
                }
                disabled={fetching}
              />
            </motion.div>

            <motion.div
              custom={8}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center"
            >
              <button
                type="submit"
                className={`bg-indigo-700 text-white px-8 py-3 rounded-lg hover:bg-indigo-800 ${
                  loading || fetching ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading || fetching}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Setting;
