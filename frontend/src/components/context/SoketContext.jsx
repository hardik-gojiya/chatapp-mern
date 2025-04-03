import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const socketContext = createContext();
import { useLogin } from "./LoginContext";

export const useSocket = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userId } = useLogin();

  useEffect(() => {
    const newSocket = io(
      ["https://chat-in-uanp.onrender.com", "http://localhost:5000"],
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
        query: { userId: userId },
      }
    );
    setSocket(newSocket);

    newSocket.on("onlineUsers", (users) => {
      console.log("Online users: ", users);
      setOnlineUsers(users);
    });
    newSocket.on("connect", () => {
      newSocket.emit("requestOnlineUsers");
    });

    return () => newSocket.disconnect();
  }, [userId, onlineUsers, window.location.reload]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
