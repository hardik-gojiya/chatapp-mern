import React from "react";
import { Link } from "react-router-dom";
import { useLogin } from "./context/LoginContext";

function Home() {
  const { islogedin, handleLogout } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <div className="p-8 sm:p-12 bg-gray-900 text-white shadow-2xl rounded-2xl max-w-lg w-full text-center transition-transform hover:scale-105 duration-300">
        <img
          className="rounded-full h-32 w-32 mx-auto mb-6 border-4 border-blue-400 shadow-lg"
          src="chaticon.png"
          alt="Chat Icon"
        />
        
        <h1 className="text-4xl font-extrabold  mb-8">
          Welcome to Chat-In
        </h1>

        {!islogedin ? (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
