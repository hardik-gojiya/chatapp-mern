import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
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
    <>
      <h2
        className={`fixed top-5 z-500 left-5 text-xl sm:text-2xl font-bold cursor-pointer ${
          darkMode ? "text-white" : "text-blue-500"
        }`}
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
      {isOpenAllChat && (
        <div
          className={`h-screen  w-14 sm:w-16 bg-gray-900 text-white flex flex-col items-center pt-18 sm:pt-18 sm:p-4 space-y-4 sm:space-y-6 shadow-lg ${
            isOpenAllChat && window.innerWidth < 1000
              ? "absolute left-0 inset-0 z-10 "
              : "block"
          }`}
        >
          {/* Home Button */}
          <Link
            to="/"
            onClick={() => {
              if (window.innerWidth <= 700) {
                setIsOpenAllChat(false);
              }
            }}
            className="text-lg sm:text-2xl w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-blue-500 transition"
          >
            <FontAwesomeIcon icon={faHouse} />
          </Link>

          {/* Login / Logout */}
          {islogedin ? (
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-500 rounded-lg hover:bg-red-600 transition"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => {
                if (window.innerWidth <= 700) {
                  setIsOpenAllChat(false);
                }
              }}
              title="Login"
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            >
              <FontAwesomeIcon icon={faArrowRightToBracket} />
            </Link>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-yellow-300 transition-all duration-300`}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          {/* Profile Picture */}
          {islogedin && (
            <Link
              to={`/editprofile/${userId}`}
              onClick={() => {
                if (window.innerWidth <= 700) {
                  setIsOpenAllChat(false);
                }
              }}
            >
              <img
                src={profilepic || "/default-profile.png"}
                alt="Profile"
                className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-blue-500"
              />
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
