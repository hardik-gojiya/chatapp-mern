import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Socket } from "dgram";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("sendMessage", (messageData) => {
    io.emit("recieveMessage ", messageData);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});

export { io, app, server };
