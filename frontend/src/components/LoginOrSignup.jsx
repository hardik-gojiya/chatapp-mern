import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import { useLogin } from "./LoginContext";

function LoginOrSignup({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const {setIslogedin, setMobileno} = useLogin()
  const [mobileno, setLocalMobileno] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      alert("Please send otp first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/otp", {
        mobileno,
        otp: String(otp),
        action: "verify",
      });
      console.log(response.data);
      setIsOtpSent(false);
      setIslogedin(true)
      setMobileno(mobileno)
      alert("login successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error while verifying OTP", error);
    }
  };

  const sendotp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/users/otp", {
        mobileno,
        action: "send",
      });
      setIsOtpSent(true);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Error while sending OTP", error);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={handleLogin}
        className={`${
          darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
        } p-8 rounded-lg shadow-lg w-80`}
      >
        <input
          type="tel"
          placeholder="Mobile No"
          value={mobileno}
          onChange={(e) => setLocalMobileno(e.target.value)}
          required
          className={`w-full p-2 mb-4 border ${
            darkMode
              ? "border-gray-500 bg-gray-600 text-white"
              : "border-gray-300 bg-white text-black"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        <input
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="OTP"
          className={`w-full p-2 mb-4 border ${
            darkMode
              ? "border-gray-500 bg-gray-600 text-white"
              : "border-gray-300 bg-white text-black"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
        />
        <button
          onClick={sendotp}
          type="button"
          className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600 transition"
        >
          {isOtpSent ? "Resend OTP" : "Send OTP"}
        </button>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginOrSignup;
