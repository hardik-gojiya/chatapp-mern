import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginOrSignup() {
  const navigate = useNavigate();
  const [mobileno, setMobileno] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      alert("Please send otp first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/otp", {
        mobileno,
        otp: String(otp),
        action: "verify",
      });
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      setIsOtpSent(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("error while verifying otp", error);
    }
  };

  const sendotp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/otp", {
        mobileno,
        action: "send",
      });
      setIsOtpSent(true);
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("error while sending otp", error);
    }
  };

  return (
    <div>
      <a href="/">home</a>
      <h1>Login</h1>
      <form onSubmit={handleLogin} method="post">
        <input
          type="tel"
          placeholder="Mobile No"
          value={mobileno}
          onChange={(e) => setMobileno(e.target.value)}
          required
        />
        <input
          type="number"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={sendotp}>{sendotp ? "send otp" : "resendotp"}</button>
        <button type="submit">login</button>
      </form>
    </div>
  );
}

export default LoginOrSignup;
