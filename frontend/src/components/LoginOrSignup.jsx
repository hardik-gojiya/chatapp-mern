import React, { useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import { useToast } from "./context/ToastContext";

function LoginOrSignup({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { setIslogedin, setMobileno } = useLogin();
  const [mobileno, setLocalMobileno] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      alert("Please send OTP first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/otp", {
        mobileno,
        otp: String(otp),
        action: "verify",
      });
      setIsOtpSent(false);
      setIslogedin(true);
      setMobileno(mobileno);
      showSuccess("Login successful");
      navigate("/");
    } catch (error) {
      console.log("Error while verifying OTP", error);
      showError("Error while verifying OTP. Please try again.");
    }
  };

  const sendotp = async (e) => {
    e.preventDefault();
    if (!mobileno || mobileno.length < 8) {
      alert("Enter a valid mobile number");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/users/otp", {
        mobileno,
        action: "send",
      });
      setIsOtpSent(true);
      alert(response.data.message);
    } catch (error) {
      console.log("Error while sending OTP", error);
      alert("Error while sending OTP. Please check if the number is valid.");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 `}
    >
      <div
        className={`w-96 p-8 rounded-2xl bg-opacity-90 shadow-2xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } backdrop-blur-lg border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h1
          className={`text-4xl text-center font-extrabold mb-8 ${
            darkMode ? "text-white" : "text-blue-600"
          }`}
        >
          {isOtpSent ? "Verify OTP" : "Login"}
        </h1>

        <div className="mb-6">
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileno}
            onChange={(e) => setLocalMobileno(e.target.value)}
            required
            className={`w-full p-3 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-white border border-gray-500"
                : "bg-white text-black border border-gray-300"
            } focus:ring-blue-400`}
          />
        </div>

        {isOtpSent && (
          <div className="mb-6">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={`w-full p-3 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition-all duration-300 ${
                darkMode
                  ? "bg-gray-700 text-white border border-gray-500 focus:ring-green-400"
                  : "bg-white text-black border border-gray-300 focus:ring-green-400"
              }`}
            />
          </div>
        )}

        <button
          onClick={sendotp}
          type="button"
          className={`w-full py-3 rounded-lg text-white font-bold transition-all duration-300 shadow-md ${
            isOtpSent
              ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-300"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
          } focus:outline-none focus:ring-4 mb-4`}
        >
          {isOtpSent ? "Resend OTP" : "Send OTP"}
        </button>

        <button
          type="submit"
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-all duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Login
        </button>

        <p
          className={`mt-6 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {isOtpSent
            ? "Didn't receive OTP? Resend after 30s"
            : "Enter your mobile number to receive OTP"}
        </p>
      </div>
    </div>
  );
}

export default LoginOrSignup;
