import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { LoginProvider } from "./components/context/LoginContext.jsx";
import { ToastProvider } from "./components/context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <LoginProvider>
          <App />
        </LoginProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
