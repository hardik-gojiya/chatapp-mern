import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLogin } from "./context/LoginContext";

function Home() {
  const { islogedin, mobileno ,handleLogout } = useLogin();

  return (
    <div>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">welcome to our chat app</h1>
        {!islogedin ? (
          <Link
            to="/login"
            className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
