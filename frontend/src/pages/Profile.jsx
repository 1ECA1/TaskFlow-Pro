import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

import { getProfile, updateProfile } from "../services/api";

const BACKEND_URL = "http://127.0.0.1:8000";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // =========================
  // LOAD PROFILE
  // =========================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        setProfile(data);

        setFormData({
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        });

        if (data.profile_image) {
          setImagePreview(
            data.profile_image.startsWith("http")
              ? data.profile_image
              : `${BACKEND_URL}${data.profile_image}`,
          );
        } else {
          setImagePreview("");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // =========================
  // HANDLE TEXT INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // =========================
  // HANDLE IMAGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Check file size - 5MB maximum
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setSuccess("");

    setSelectedImage(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("first_name", formData.first_name);
      data.append("last_name", formData.last_name);

      if (selectedImage) {
        data.append("profile_image", selectedImage);
      }

      const updatedProfile = await updateProfile(data);

      setProfile(updatedProfile);

      setFormData({
        username: updatedProfile.username || "",
        email: updatedProfile.email || "",
        first_name: updatedProfile.first_name || "",
        last_name: updatedProfile.last_name || "",
      });

      if (updatedProfile.profile_image) {
        setImagePreview(
          updatedProfile.profile_image.startsWith("http")
            ? updatedProfile.profile_image
            : `${BACKEND_URL}${updatedProfile.profile_image}`,
        );
      }

      setSelectedImage(null);
      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CANCEL EDITING
  // =========================

  const handleCancel = () => {
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
    });

    if (profile.profile_image) {
      setImagePreview(
        profile.profile_image.startsWith("http")
          ? profile.profile_image
          : `${BACKEND_URL}${profile.profile_image}`,
      );
    } else {
      setImagePreview("");
    }

    setSelectedImage(null);
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>

          <p className="text-gray-500 mt-1">Manage your account information.</p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}

        {profile && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* ========================= */}
            {/* PROFILE HEADER */}
            {/* ========================= */}

            <div className="bg-blue-600 px-6 py-10">
              <div className="flex flex-col items-center">
                {/* Profile Image */}

                <div className="relative">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <span className="text-4xl font-bold text-blue-600">
                        {profile.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Camera button */}

                  {isEditing && (
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0
                                 w-10 h-10 rounded-full
                                 bg-white text-blue-600
                                 flex items-center justify-center
                                 cursor-pointer shadow-md
                                 hover:bg-gray-100 transition"
                      title="Change profile picture"
                    >
                      📷
                    </label>
                  )}

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-2xl font-bold text-white mt-4">
                  {profile.username}
                </h2>

                <p className="text-blue-100 mt-1">{profile.email}</p>

                {isEditing && (
                  <p className="text-blue-100 text-sm mt-3">
                    Click the camera icon to change your profile picture.
                  </p>
                )}
              </div>
            </div>

            {/* ========================= */}
            {/* PROFILE CONTENT */}
            {/* ========================= */}

            <div className="p-6">
              {!isEditing ? (
                <>
                  {/* View Mode */}

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Profile Information
                    </h2>

                    <Button
                      type="button"
                      onClick={() => {
                        setError("");
                        setSuccess("");
                        setIsEditing(true);
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Username</p>

                      <p className="text-gray-800 font-medium mt-1">
                        {profile.username}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Email</p>

                      <p className="text-gray-800 font-medium mt-1">
                        {profile.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">First Name</p>

                      <p className="text-gray-800 font-medium mt-1">
                        {profile.first_name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Last Name</p>

                      <p className="text-gray-800 font-medium mt-1">
                        {profile.last_name || "Not provided"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* ========================= */}
                  {/* EDIT MODE */}
                  {/* ========================= */}

                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Edit Profile
                  </h2>

                  <form onSubmit={handleSave} className="space-y-5">
                    <Input
                      label="Username"
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />

                    <Input
                      label="First Name"
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />

                    <Input
                      label="Last Name"
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />

                    {/* Image Upload */}

                    <div className="pt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture
                      </label>

                      <label
                        htmlFor="profile-image"
                        className="inline-flex items-center gap-2
                                   px-4 py-2 rounded-lg
                                   border border-gray-300
                                   bg-white text-gray-700
                                   cursor-pointer
                                   hover:bg-gray-50 transition"
                      >
                        📷 Choose Image
                      </label>

                      {selectedImage && (
                        <p className="text-sm text-gray-500 mt-2">
                          Selected: {selectedImage.name}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WEBP up to 5MB.
                      </p>
                    </div>

                    {/* Buttons */}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button type="submit">
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {/* Logout */}

              <div className="mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg
                             bg-red-600 text-white font-medium
                             hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;
