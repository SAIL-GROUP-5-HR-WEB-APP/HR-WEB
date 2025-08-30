import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Components/Reuseable/Api";

interface ProfileData {
  phone: string;
  address: string;
  department: string;
  position: string;
  emergencyContact: string;
  dob: string;
  image: File | null;
}

const Setting = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    phone: "",
    address: "",
    department: "",
    position: "",
    emergencyContact: "",
    dob: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch user profile from backend when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?._id) {
          console.error("No user ID found in localStorage");
          return;
        }

        const res = await Api.get(`/api/v1/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;

        setProfile({
          phone: userData.profile?.phone || "",
          address: userData.profile?.address || "",
          department: userData.profile?.department || "",
          position: userData.profile?.position || "",
          emergencyContact: userData.profile?.emergencyContact || "",
          dob: userData.profile?.dateOfBirth
            ? userData.profile.dateOfBirth.split("T")[0]
            : "",
          image: null,
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof ProfileData
  ) => {
    const value =
      field === "image" ? e.target.files?.[0] || null : e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });

      await Api.put("/api/v1/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage after successful save
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.profile = { ...user.profile, ...profile, dateOfBirth: profile.dob };
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/EmployeeDashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Edit Profile</h2>

        {[
          "department",
          "position",
          "phone",
          "emergencyContact",
          "address",
          "dob",
        ].map((field, i) => (
          <div key={i} className="flex flex-col">
            <label className="mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "dob" ? "date" : "text"}
              value={profile[field as keyof ProfileData] as string}
              onChange={(e) => handleChange(e, field as keyof ProfileData)}
              className="border px-3 py-2 rounded-md"
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="mb-1">Profile Image</label>
          <input type="file" onChange={(e) => handleChange(e, "image")} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Setting;
