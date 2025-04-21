import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../context/LoginContext";

function Home() {
  const { islogedin, handleLogout } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen text-white px-4">
      <div className="p-6 sm:p-8 md:p-12 bg-gray-900 text-white  shadow-2xl rounded-2xl w-full max-w-xs sm:max-w-md md:max-w-lg text-center transition-transform hover:scale-105 duration-300">
        <div className="flex justify-center">
          <img
            className="rounded-full h-24 w-24 sm:h-32 sm:w-32 border-4 border-blue-400 shadow-lg"
            src="chaticon.png"
            alt="Chat Icon"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold mb-6 mt-4">
          Welcome to Chat-In
        </h1>

        <div className="flex flex-col gap-4">
          {!islogedin ? (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg w-full"
            >
              Login
            </Link>
          ) : (
            <div className="flex flex-col justify-between">
              <p>Select any chat and chat whomever you want</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
