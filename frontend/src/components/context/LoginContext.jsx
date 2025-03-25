import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useToast } from "./ToastContext";

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
};

export const LoginProvider = ({ children }) => {
  const { showSuccess, showError } = useToast();
  const [islogedin, setIslogedin] = useState(false);
  const [mobileno, setMobileno] = useState("");
  const [name, setName] = useState("");
  const [profilepic, setProfilepic] = useState("");

  const checkLoggedin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/check-auth",
        { withCredentials: true }
      );
      setMobileno(response.data.mobile);
      setIslogedin(response.data.isLoggedIn);
      setName(response.data.name);
      setProfilepic(response.data.profilepic);
    } catch (error) {
      console.log(error);
      setIslogedin(false);
    }
  };

  const handleLogout = async () => {
    if (islogedin && window.confirm("Are you sure you want to logout?")) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/logout",
          {},
          {
            withCredentials: true,
          }
        );

        setIslogedin(false);
        setMobileno("");
        showSuccess(response.data.message);
      } catch (error) {
        console.log("Error in logout:", error);
        showError("Error in logout");
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
        mobileno,
        name,
        profilepic,
        setIslogedin,
        setMobileno,
        handleLogout,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
