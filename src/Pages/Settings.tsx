import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Components/Reuseable/Api";
import { ArrowLeftCircle } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface ProfileData {
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  position: string;
  emergencyContact: string;
  dateOfBirth: string;
  avatar: File | null; // File input for Cloudinary upload
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
    position: "",
    emergencyContact: "",
    dateOfBirth: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Store fetched avatarUrl

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // Replace with your Cloudinary upload preset
  const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/db4ra5gcl/image/upload";

  // Fetch profile
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

    // Fetch profile
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
          position: u.profile?.position || "",
          emergencyContact: u.profile?.emergencyContact || "",
          dateOfBirth: u.profile?.dateOfBirth
            ? new Date(u.profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          avatar: null,
        });
        setAvatarUrl(u.profile?.avatarUrl || null);
        setPreview(u.profile?.avatarUrl || null);
      })
      .catch((err) => {
        console.error("Failed to load profile data:", {
          message: err.message,
          response: err.response?.data,
        });
        MySwal.fire({
          title: "Error",
          text: "Failed to load profile data.",
          icon: "error",
          confirmButtonColor: "#DC2626",
        });
      });
  }, [navigate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof ProfileData
  ) => {
    const value =
      field === "avatar" && "files" in e.target
        ? e.target.files?.[0] || null
        : e.target.value;

    setProfile((prev) => ({ ...prev, [field]: value }));

    if (field === "avatar" && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(value);
    }
  };

  // Upload avatar to Cloudinary
  const handleAvatarUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const cloudRes = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!cloudRes.ok) {
        throw new Error(`Cloudinary upload failed: ${cloudRes.statusText}`);
      }

      const cloudData = await cloudRes.json();
      return cloudData.secure_url;
    } catch (err: any) {
      console.error("Avatar upload failed:", {
        message: err.message,
        response: err.response?.data,
      });
      throw new Error("Failed to upload avatar to Cloudinary");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!profile.position || !profile.phone) {
      MySwal.fire({
        title: "Validation Error",
        text: "Position and Phone are required.",
        icon: "warning",
        confirmButtonColor: "#DC2626",
      });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token missing");

      let newAvatarUrl = avatarUrl;
      if (profile.avatar) {
        // Upload avatar to Cloudinary
        newAvatarUrl = await handleAvatarUpload(profile.avatar);
      }

      // Prepare profile data
      const profileData = {
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        position: profile.position,
        emergencyContact: profile.emergencyContact,
        dateOfBirth: profile.dateOfBirth,
        avatarUrl: newAvatarUrl || undefined, // Send undefined if no new URL
      };

      await Api.put(`/api/v1/users/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      MySwal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      }).then(() => navigate("/EmployeeDashboard"));
    } catch (err: any) {
      console.error("Profile update error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      MySwal.fire({
        title: "Error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to update profile",
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

        {/* Profile fields */}
        {[
          "position",
          "phone",
          "emergencyContact",
          "address",
          "city",
          "state",
          "country",
          "dateOfBirth",
        ].map((field, i) => (
          <div key={i} className="flex flex-col">
            <label className="mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "dateOfBirth" ? "date" : "text"}
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
              onError={() => setPreview(null)} // Hide preview if URL is invalid
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(e, "avatar")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800 disabled:bg-indigo-400"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Setting;
