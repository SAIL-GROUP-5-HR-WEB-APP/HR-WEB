import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Components/Reuseable/Api";
import { ArrowLeftCircle } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface Department {
  _id: string;
  name: string;
}

interface ProfileData {
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  department: string; // ✅ backend expects "department" (not departmentId)
  position: string;
  emergencyContact: string;
  dob: string;
  avatar: File | null;
}

const Setting = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [profile, setProfile] = useState<ProfileData>({
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    department: "",
    position: "",
    emergencyContact: "",
    dob: "",
    avatar: null,
  });

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 Fetch profile + departments
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("authToken");

    if (!user?.id) {
      MySwal.fire({
        title: "Error",
        text: "User data not found. Please log in again.",
        icon: "error",
        confirmButtonColor: "#DC2626",
      }).then(() => navigate("/login"));
      return;
    }

    // Fetch user profile
    Api.get(`/api/v1/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const u = res.data;
        setProfile({
          phone: u.profile?.phone || "",
          address: u.profile?.address || "",
          city: u.profile?.city || "",
          state: u.profile?.state || "",
          country: u.profile?.country || "",
          department: u.profile?.department || "", // ✅ match backend
          position: u.profile?.position || "",
          emergencyContact: u.profile?.emergencyContact || "",
          dob: u.profile?.dateOfBirth
            ? u.profile.dateOfBirth.split("T")[0]
            : "",
          avatar: null,
        });
        if (u.profile?.avatarUrl) setPreview(u.profile.avatarUrl);
      })
      .catch(() => {
        MySwal.fire({
          title: "Error",
          text: "Failed to load profile data.",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      });

    // Fetch departments
    Api.get(`/api/v1/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch departments", err));
  }, [navigate]);

  // 🔹 Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof ProfileData
  ) => {
    const value =
      field === "avatar" && "files" in e.target
        ? e.target.files?.[0] || null
        : e.target.value;

    setProfile((prev) => ({ ...prev, [field]: value as any }));

    if (field === "avatar" && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    }
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!profile.department || !profile.position || !profile.phone) {
      MySwal.fire({
        title: "Validation Error",
        text: "Department, Position, and Phone are required.",
        icon: "warning",
        confirmButtonColor: "#DC2626",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      Object.entries(profile).forEach(([key, value]) => {
        if (!value) return;

        if (key === "dob") {
          formData.append("dateOfBirth", value); // ✅ backend expects flat
        } else if (key === "avatar" && value instanceof File) {
          formData.append("avatar", value);
        } else {
          formData.append(key, value as string); // ✅ department, phone, etc.
        }
      });

      await Api.put(`/api/v1/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      MySwal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      }).then(() => navigate("/EmployeeDashboard"));
    } catch (err: any) {
      console.error("Update failed", err);
      MySwal.fire({
        title: "Error",
        text: err.response?.data?.message || "Update failed",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
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

        {/* 🔹 Department dropdown */}
        <div className="flex flex-col">
          <label className="mb-1">Department</label>
          <select
            value={profile.department}
            onChange={(e) => handleChange(e, "department")}
            className="border px-3 py-2 rounded-md"
            required
          >
            <option value="">Select a department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Other inputs */}
        {[
          "position",
          "phone",
          "emergencyContact",
          "address",
          "city",
          "state",
          "country",
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
              required={["position", "phone"].includes(field)}
            />
          </div>
        ))}

        {/* Avatar */}
        <div className="flex flex-col">
          <label className="mb-1">Profile Avatar</label>
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-32 h-32 mb-2 rounded-full object-cover"
            />
          )}
          <input type="file" onChange={(e) => handleChange(e, "avatar")} />
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
