import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getProfile } from "../services/api";

const BACKEND_URL = "http://127.0.0.1:8000";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // =========================
  // LOAD USER PROFILE
  // =========================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    const token = localStorage.getItem("accessToken");

    if (token) {
      loadProfile();
    }
  }, [location.pathname]);

  // =========================
  // PROFILE IMAGE
  // =========================

  const profileImage = profile?.profile_image
    ? profile.profile_image.startsWith("http")
      ? profile.profile_image
      : `${BACKEND_URL}${profile.profile_image}`
    : null;

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsMenuOpen(false);

    navigate("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* ========================= */}
        {/* MAIN HEADER */}
        {/* ========================= */}

        <div className="flex items-center justify-between">
          {/* ========================= */}
          {/* LOGO */}
          {/* ========================= */}

          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="text-2xl font-bold text-blue-600"
          >
            TaskFlow Pro
          </Link>

          {/* ========================= */}
          {/* DESKTOP NAVIGATION */}
          {/* ========================= */}

          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-2">
              {/* Dashboard */}

              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive("/dashboard")
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>

              {/* Projects */}

              <Link
                to="/projects"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive("/projects")
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Projects
              </Link>
            </nav>

            {/* ========================= */}
            {/* DESKTOP PROFILE PHOTO */}
            {/* ========================= */}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="ml-2 rounded-full focus:outline-none
                         focus:ring-2 focus:ring-blue-500
                         focus:ring-offset-2"
              title="View Profile"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full
                             object-cover
                             border-2 border-gray-200
                             hover:border-blue-500
                             transition"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full
                             bg-blue-600 text-white
                             flex items-center justify-center
                             font-bold
                             hover:bg-blue-700
                             transition"
                >
                  {profile?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </button>
          </div>

          {/* ========================= */}
          {/* MOBILE HAMBURGER ONLY */}
          {/* ========================= */}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg
                       text-gray-600
                       hover:bg-gray-100"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

        {/* ========================= */}
        {/* MOBILE NAVIGATION */}
        {/* ========================= */}

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t">
            <div className="flex flex-col gap-2">
              {/* Dashboard */}

              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={`px-4 py-3 rounded-lg
                           text-sm font-medium ${
                             isActive("/dashboard")
                               ? "bg-blue-600 text-white"
                               : "text-gray-600 hover:bg-gray-100"
                           }`}
              >
                Dashboard
              </Link>

              {/* Projects */}

              <Link
                to="/projects"
                onClick={closeMenu}
                className={`px-4 py-3 rounded-lg
                           text-sm font-medium ${
                             isActive("/projects")
                               ? "bg-blue-600 text-white"
                               : "text-gray-600 hover:bg-gray-100"
                           }`}
              >
                Projects
              </Link>

              {/* Profile */}

              <Link
                to="/profile"
                onClick={closeMenu}
                className={`px-4 py-3 rounded-lg
                           text-sm font-medium ${
                             isActive("/profile")
                               ? "bg-blue-600 text-white"
                               : "text-gray-600 hover:bg-gray-100"
                           }`}
              >
                Profile
              </Link>

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left
                           px-4 py-3 rounded-lg
                           text-sm font-medium
                           text-red-600
                           hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
