import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginOrSignup from "./components/LoginOrSignup";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import { useLogin } from "./components/context/LoginContext";
import AllChatList from "./components/AllChatList";
import OneChat from "./components/OneChat";
import EditProfile from "./components/EditProfile";

function App() {
  const { islogedin, mobileno, handleLogout } = useLogin();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <Sidebar
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        islogedin={islogedin}
        handleLogout={handleLogout}
      />
      {islogedin && (
        <AllChatList darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}

      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <LoginOrSignup
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            }
          />
          <Route path="/chat/:id" element={<OneChat darkMode={darkMode} />} />
          <Route
            path="/editprofile/:id"
            element={<EditProfile darkMode={darkMode} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
