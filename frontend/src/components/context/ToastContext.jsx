import React, { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { maxWidth: "90%", wordBreak: "break-word" },
    });
  };

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { maxWidth: "90%", wordBreak: "break-word" },
    });
  };

  const showInfo = (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      style: { maxWidth: "90%", wordBreak: "break-word" },
    });
  };

  const showImageNotification = (imgSrc) => {
    toast(
      () => (
        <div className="flex flex-col items-center gap-2">
          <img
            src={imgSrc}
            alt="Notification Image"
            className="w-full max-w-[250px] h-auto rounded-lg shadow-lg"
          />
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: true,
        draggable: false,
        style: { maxWidth: "90%" },
      }
    );
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showImageNotification }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
