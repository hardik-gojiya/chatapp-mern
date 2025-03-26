import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLogin } from "./context/LoginContext";
import { useToast } from "./context/ToastContext";

function EditProfile({ darkMode }) {
  const {
    mobileno,
    name: initialName,
    profilepic: initialProfilePic,
    createdAt,
  } = useLogin();
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("");
  const fileInputRef = useRef(null);

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
    formData.append("mobileno", String(mobileno));
    if (profilePic) {
      formData.append("profilepic", profilePic);
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/editprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      showSuccess(response.data.message);
    } catch (error) {
      showError("An error occurred while updating the profile.");
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`p-6 sm:p-8 max-w-4xl mx-auto rounded-xl shadow-lg transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div
            className="relative w-32 h-32 cursor-pointer group"
            onClick={handleProfilePicClick}
          >
            <img
              src={previewPic}
              alt="Profile Pic Preview"
              className="w-full h-full rounded-full border-2 border-blue-500 object-cover shadow-md transition-all duration-300 group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-white font-bold text-sm">Edit</span>
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

        <div className="w-full">
          <label className="block mb-2 font-medium text-lg">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 text-lg rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-500"
                : "bg-gray-100 text-black border-gray-300 focus:ring-blue-400"
            }`}
            placeholder="Enter your name"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-lg rounded-lg font-semibold tracking-wider transition-all duration-300 ${
            darkMode
              ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-700/50"
              : "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-blue-400/50"
          }`}
        >
          Update Profile
        </button>

        <p className="p-2">
          account create at :
          {" " +
            new Date(createdAt).toLocaleString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) || ""}{" "}
        </p>
      </form>
    </div>
  );
}

export default EditProfile;
