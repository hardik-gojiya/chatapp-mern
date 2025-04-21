import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLogin } from "../context/LoginContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function EditProfile({ darkMode }) {
  const navigate = useNavigate();
  const {
    userId,
    email,
    name: initialName,
    profilepic: initialProfilePic,
    createdAt,
    handleLogout,
  } = useLogin();

  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("");
  const fileInputRef = useRef(null);
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const deleteMenuRef = useRef(null);

  useEffect(() => {
    setName(initialName || "");
    setPreviewPic(initialProfilePic || "/default-profile.png");
  }, [initialName, initialProfilePic]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", String(email));
    if (profilePic) {
      formData.append("profilepic", profilePic);
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/editprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      showSuccess(response.data.message);
      setLoading(false);
    } catch (error) {
      showError("An error occurred while updating the profile.");
      setLoading(false);
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteProfile = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete your profile?")) {
        return;
      }
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/deleteProfile/${userId}`
      );
      if (response.status === 200) {
        showSuccess(response.data.message);
        navigate("/");
        setLoading(false);
      } else {
        showError(response.data.error);
        setLoading(false);
      }
    } catch (error) {
      showError("An error occurred while deleting the profile.");
      console.log("error in deleting profile ", error);
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (
      deleteMenuRef.current &&
      !deleteMenuRef.current.contains(event.target)
    ) {
      setShowDeleteMenu(false);
    }
  };

  useEffect(() => {
    if (showDeleteMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteMenu]);

  return (
    <div className={`min-h-screen flex items-center justify-center `}>
      <div
        className={`w-full max-w-2xl p-8 rounded-2xl shadow-2xl bg-opacity-80 backdrop-blur-lg ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white/70 border border-blue-300"
        }`}
      >
        <h2 className="text-4xl font-bold text-center mb-6">Edit Profile</h2>

        <div className="relative flex flex-col items-center mb-6">
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg hover:shadow-blue-500 transition-all cursor-pointer"
            onClick={handleProfilePicClick}
          >
            <img
              src={previewPic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-all">
              <span className="text-white font-bold text-sm">Change Pic</span>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl text-lg focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-400"
                  : "bg-gray-50 text-black border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter your name"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-green-400 to-blue-500 text-white hover:scale-105 hover:shadow-lg transition-all"
          >
            Update Profile
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          Account created on:{" "}
          <span className="font-semibold">
            {new Date(createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </p>
        <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 mt-2 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg w-full"
              >
                Logout
              </button>
        <div className="mt-6">
          <button
            onClick={() => setShowDeleteMenu(!showDeleteMenu)}
            className="w-full py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:scale-105 hover:shadow-lg transition-all"
          >
            Delete Profile <FontAwesomeIcon icon={faTrash} />
          </button>

          {showDeleteMenu && (
            <div className="mt-4 bg-white/90 dark:bg-gray-800 p-4 rounded-lg shadow-xl">
              <p className="text-center text-gray-700 dark:text-white mb-4">
                Are you sure you want to delete your profile?
              </p>
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteProfile}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteMenu(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading && (
        <div
          className="absolute top-5 left-1/2 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
