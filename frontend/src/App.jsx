import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginOrSignup from "./components/LoginOrSignup";

function App() {
  const [islogedin, setIslogedin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIslogedin(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Home</h1>
              <a href="login">login</a>
              {islogedin && <button onClick={handleLogout}>logout</button>}
            </div>
          }
        >
          home
        </Route>
        <Route path="/login" element={<LoginOrSignup />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
