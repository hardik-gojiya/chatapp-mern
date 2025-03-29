import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [userId, setUserId] = useState("");
  const [islogedin, setIslogedin] = useState(false);
  const [mobileno, setMobileno] = useState("");
  const [name, setName] = useState("");
  const [profilepic, setProfilepic] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const checkLoggedin = async () => {
    try {
      const response = await axios.get(
        "https://chat-in-uanp.onrender.com/api/users/check-auth",
        { withCredentials: true }
      );
      setUserId(response.data.userId);
      setMobileno(response.data.mobile);
      setIslogedin(response.data.isLoggedIn);
      setName(response.data.name);
      setProfilepic(response.data.profilepic);
      setCreatedAt(response.data.createdAt);
    } catch (error) {
      console.log(error);
      setIslogedin(false);
    }
  };

  const handleLogout = async () => {
    if (islogedin && window.confirm("Are you sure you want to logout?")) {
      try {
        const response = await axios.post(
          "https://chat-in-uanp.onrender.com/api/users/logout",
          {},
          {
            withCredentials: true,
          }
        );

        setIslogedin(false);
        setMobileno("");
        showSuccess(response.data.message);
        navigate("/");
      } catch (error) {
        console.log("Error in logout:", error);
        showError(response.data.error || "Error in logout");
      }
    } else {
      showError("some error occured in logout");
    }
  };
  useEffect(() => {
    checkLoggedin();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        islogedin,
        userId,
        mobileno,
        name,
        profilepic,
        createdAt,
        setIslogedin,
        setMobileno,
        handleLogout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
