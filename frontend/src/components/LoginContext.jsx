import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const [islogedin, setIslogedin] = useState(false);
  const [mobileno, setMobileno] = useState("");

  const checkLoggedin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/check-auth",
        { withCredentials: true }
      );
      setMobileno(response.data.mobileno);
      setIslogedin(response.data.isLoggedIn);
    } catch (error) {
      console.log(error);
      setIslogedin(false);
    }
  };

  const handleLogout = async () => {
    if (islogedin && window.confirm.location) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/logout",
          {}, // No need to send the token explicitly
          {
            withCredentials: true, // Ensures cookies are sent
          }
        );

        setIslogedin(false);
        setMobileno("");
        window.location.href = "/";
        alert(response.data.message);
      } catch (error) {
        console.log("Error in logout:", error);
      }
    } else {
      alert("You are not logged in");
    }
  };
  useEffect(() => {
    checkLoggedin();
  }, []);

  return (
    <LoginContext.Provider
      value={{ islogedin, mobileno, setIslogedin, setMobileno, handleLogout }}
    >
      {children}
    </LoginContext.Provider>
  );
};
