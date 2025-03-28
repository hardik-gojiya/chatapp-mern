import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faHouse,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({
  toggleDarkMode,
  darkMode,
  islogedin,
  handleLogout,
  isOpenAllChat,
  setIsOpenAllChat,
}) {
  const { profilepic, userId } = useLogin();

  return (
    <div
      className={`h-screen w-16 bg-gray-900 text-white flex flex-col items-center p-4 space-y-6 shadow-lg`}
    >
      <h2
        className="text-2xl font-bold cursor-pointer"
        onClick={() => {
          setIsOpenAllChat(!isOpenAllChat);
        }}
      >
        {isOpenAllChat ? (
          <FontAwesomeIcon icon={faXmark} />
        ) : (
          <FontAwesomeIcon icon={faBars} />
        )}
      </h2>

      <Link
        to="/"
        className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-blue-500 transition"
      >
        <FontAwesomeIcon icon={faHouse} />
      </Link>
      {islogedin ? (
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-10 h-10 flex cursor-pointer items-center justify-center bg-red-500 rounded-lg hover:bg-red-600 transition"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      ) : (
        <Link
          to="/login"
          title="Login"
          className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          <FontAwesomeIcon icon={faArrowRightToBracket} />
        </Link>
      )}

      <button
        onClick={toggleDarkMode}
        className={` p-2 rounded-full  cursor-pointer
             bg-gray-700 hover:bg-gray-600 text-yellow-300
         transition-all duration-300`}
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
      {islogedin && (
        <Link to={`/editprofile/${userId}`}>
          <img
            src={profilepic || "/default-profile.png"}
            alt="Profile"
            className="relative  w-8 h-8 rounded-full border-2 border-blue-500"
          />
        </Link>
      )}
    </div>
  );
}

export default Sidebar;
