import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginOrSignup from "./pages/LoginOrSignup";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import { useLogin } from "./context/LoginContext";
import AllChatList from "./components/AllChatList";
import OneChat from "./pages/OneChat";
import EditProfile from "./pages/EditProfile";

function App() {
  const { islogedin, mobileno, handleLogout } = useLogin();
  const [darkMode, setDarkMode] = useState(true);
  const [isOpenAllChat, setIsOpenAllChat] = useState(window.innerWidth >= 700);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const handleWindResize = () => {
      if (window.innerWidth < 700) {
        setIsOpenAllChat(false);
      } else {
        setIsOpenAllChat(true);
      }
    };

    window.addEventListener("resize", handleWindResize);
    return () => window.removeEventListener("resize", handleWindResize);
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
      className={`flex h-full w-full ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900"
      } `}
    >
      <Sidebar
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        islogedin={islogedin}
        handleLogout={handleLogout}
        isOpenAllChat={isOpenAllChat}
        setIsOpenAllChat={setIsOpenAllChat}
      />
      {islogedin && (
        <AllChatList
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          isOpenAllChat={isOpenAllChat}
          setIsOpenAllChat={setIsOpenAllChat}
        />
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
          {islogedin ? (
            <Route
              path="/editprofile/:id"
              element={<EditProfile darkMode={darkMode} />}
            />
          ) : (
            <Route path="/" element={<Home />} />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <div className="text-[10px] absolute top-1 right-1 text-gray-400 text-center px-1 sm:px-2">
        Made by{" "}
        <a
          className="underline hover:text-blue-400 transition-colors duration-200"
          href="https://hardik-gojiya-portfolio.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hardik Gojiya
        </a>
      </div>
    </div>
  );
}

export default App;
