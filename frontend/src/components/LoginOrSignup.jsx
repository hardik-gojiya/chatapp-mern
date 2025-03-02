import React, { useState } from "react";
import axios from "axios";

function LoginOrSignup() {
  const [mobileno, setMobileno] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isOtpSent) {
      alert("Please send otp first");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/otp", {
        mobileno,
        otp: Number(otp),
        action: "verify",
      });
      alert(response.data.message);
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
