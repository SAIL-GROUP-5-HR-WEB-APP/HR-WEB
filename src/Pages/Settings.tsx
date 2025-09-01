import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Components/Reuseable/Api";
import { ArrowLeftCircle } from "lucide-react";

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) {
      console.error("No user ID found in localStorage");
      return;
    }

    const token = localStorage.getItem("authToken");
    Api.get(`/api/v1/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const u = res.data;
        setProfile({
          phone: u.profile?.phone || "",
          address: u.profile?.address || "",
          department: u.profile?.department || "",
          position: u.profile?.position || "",
          emergencyContact: u.profile?.emergencyContact || "",
          dob: u.profile?.dateOfBirth
            ? u.profile.dateOfBirth.split("T")[0]
            : "",
          image: null,
        });
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
      });
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
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const formData = new FormData();
      Object.entries(profile).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });

      await Api.put(`/api/v1/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // update localStorage
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
        <div className="flex items-center justify-between px-4 py-2">
          <span
            onClick={() => navigate(-1)}
            className="cursor-pointer text-gray-700 hover:text-black"
          >
            <ArrowLeftCircle size={28} />
          </span>

          <h2 className="flex-1 text-2xl font-bold text-center">
            Edit Profile
          </h2>

          <span className="w-7" />
        </div>

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
