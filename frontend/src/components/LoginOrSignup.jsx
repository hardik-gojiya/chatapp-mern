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
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      alert("Please send OTP first");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://chat-in-uanp.onrender.com/api/users/verifyOtp",
        {
          email,
          mobileno,
          otp: String(otp),
        }
      );
      setIsOtpSent(false);
      setIslogedin(true);
      setMobileno(mobileno);
      showSuccess("Login successful");
      navigate("/");
      setLoading(false);
    } catch (error) {
      console.log("Error while verifying OTP", error);
      showError(
        response.data.error || "Error while verifying OTP. Please try again."
      );
      setLoading(false);
    }
  };

  const sendotp = async (e) => {
    e.preventDefault();
    if (!mobileno || mobileno.length < 8) {
      alert("Enter a valid mobile number");
      return;
    }
    if (!email) {
      alert("Enter a valid Email");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "https://chat-in-uanp.onrender.com/api/users/sendotp",
        {
          email,
          mobileno,
        }
      );
      setIsOtpSent(true);
      alert(response.data.message);
      setLoading(false);
    } catch (error) {
      console.log("Error while sending OTP", error);
      showError(
        response.data.error ||
          "Error while sending OTP. Please check if the email is valid."
      );
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } border ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition-all duration-300`}
      >
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl text-center font-extrabold mb-6 ${
            darkMode ? "text-white" : "text-blue-600"
          }`}
        >
          {isOtpSent ? "Verify OTP" : "Login"}
        </h1>

        <div className="mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
            className={`w-full p-3 sm:p-4 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition-all duration-300 ${
              darkMode
                ? "bg-gray-700 text-white border border-gray-500"
                : "bg-white text-black border border-gray-300"
            } focus:ring-blue-400 mb-2`}
          />
          <input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileno}
            onChange={(e) => setLocalMobileno(e.target.value)}
            required
            className={`w-full p-3 sm:p-4 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition-all duration-300 ${
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
              className={`w-full p-3 sm:p-4 rounded-lg shadow-inner focus:ring-4 focus:outline-none transition-all duration-300 ${
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
          className={`w-full py-3 sm:py-4 rounded-lg text-white font-bold transition-all duration-300 shadow-md ${
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
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 sm:py-4 rounded-lg font-bold transition-all duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          Login
        </button>

        <p
          className={`mt-6 text-sm text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {isOtpSent
            ? "Didn't receive OTP? Resend after 30s"
            : "Enter your Email to receive OTP"}
        </p>
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

export default LoginOrSignup;
