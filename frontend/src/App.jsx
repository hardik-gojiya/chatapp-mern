import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginOrSignup from "./components/LoginOrSignup";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Home</h1>
              <a href="login">login</a>
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
