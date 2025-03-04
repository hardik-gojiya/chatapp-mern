import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginOrSignup from "./components/LoginOrSignup";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function App() {
  const [islogedin, setIslogedin] = useState(false);
  const [mobileno, setMobileno] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setMobileno(jwtDecode(token).mobileno);
      setIslogedin(true);
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const response = await axios.post("http://localhost:5000/api/logout", {
        mobileno,
      });
      localStorage.removeItem("token");
      alert(response.data.message);
      setIslogedin(false);
      window.location.href = "/";
    } else {
      alert("You are not logged in");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-6">Home</h1>
                {!islogedin ? (
                  <Link
                    to="/login"
                    className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                )}
              </div>
            }
          />
          <Route path="/login" element={<LoginOrSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
