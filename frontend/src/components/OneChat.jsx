import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "./context/ToastContext";
import { useLogin } from "./context/LoginContext";
import { useSocket } from "./context/SoketContext";
import axios from "axios";

function OneChat({ darkMode }) {
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [sentMsg, setSentMsg] = useState("");
  const { showError, showSuccess } = useToast();

  const [reciverDetails, setReciverDetails] = useState({
    name: "user",
    mobileno: 0,
    profilepic: "",
  });

  const { profilepic: thisuserpic, islogedin } = useLogin();
  const { id } = useParams();

  const fetchOneChat = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/message/chat/${id}`
      );
      const reciverres = await axios.get(
        `http://localhost:5000/api/users/fetchuser/${id}`
      );
      setMessages(response.data);
      setReciverDetails({
        name: reciverres.data.name,
        mobileno: reciverres.data.mobileno,
        profilepic: reciverres.data.profilepic,
      });
    } catch (error) {
      console.log("error while fetching your chat", error);
      showError("error while fetching your chat");
    }
  };
  useEffect(() => {
    fetchOneChat();

    if (socket) {
      socket.on("recieveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    }
    return () => {
      if (socket) socket.off("recieveMessage");
    };
  }, [socket, messages]);

  const sendMessage = async () => {
    try {
      if (sentMsg.length > 0) {
        const response = await axios.post(
          `http://localhost:5000/api/message/send/${id}`,
          { sentMsg }
        );
        if (response) {
          socket.emit("sendMessage", {
            message: sentMsg,
            recipient: id,
            createdAt: new Date(),
          });
          showSuccess("message sent succesfully");
        }
        setSentMsg("");
      } else {
        showError("enter some message");
      }
    } catch (error) {
      console.log("error while sending chat", error);
      showError("error while sending chat");
    }
  };

  const handlesend = () => {
    sendMessage();
  };

  return (
    <div
      className={`w-full h-screen flex flex-col justify-between ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`w-full px-5 py-3 flex items-center gap-3 shadow-md ${
          darkMode ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <Link
          to="/"
          className={`py-2 px-4 rounded-lg font-semibold ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black hover:bg-gray-400"
          }`}
        >
          🡸
        </Link>
        <img
          src={reciverDetails.profilepic}
          alt="Contact DP"
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">
          {reciverDetails.name || reciverDetails.mobileno}
        </span>
      </div>
      <div
        className={`flex flex-col mt-5 px-5 overflow-y-auto flex-grow ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} className="mb-4">
              {message.recipient === id ? (
                <div className="flex justify-end items-start space-x-2">
                  <div className="flex flex-col items-end">
                    <div
                      className={`mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white break-words max-w-xs md:max-w-sm lg:max-w-md overflow-hidden`}
                    >
                      {message.message}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <img
                    src={thisuserpic}
                    className="object-cover h-8 w-8 rounded-full border-2 border-blue-400"
                    alt="User"
                  />
                </div>
              ) : (
                <div className="flex justify-start items-start space-x-2">
                  <img
                    src={reciverDetails.profilepic}
                    className="object-cover h-8 w-8 rounded-full border-2 border-gray-400"
                    alt="Receiver"
                  />
                  <div className="flex flex-col items-start">
                    <div
                      className={`mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white break-words max-w-xs md:max-w-sm lg:max-w-md overflow-hidden`}
                    >
                      {message.message}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">
                      {new Date(message.createdAt).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-5">No messages yet</p>
        )}
      </div>

      <div
        className={`w-full px-5 py-3 flex items-center gap-3 ${
          darkMode ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <input
          className={`flex-grow py-3 px-4 rounded-xl outline-none ${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-white text-black"
          }`}
          type="text"
          value={sentMsg}
          onChange={(e) => setSentMsg(e.target.value)}
          placeholder="Type your message here..."
        />
        <button
          onClick={handlesend}
          disabled={!sentMsg}
          className={`disabled:bg-gray-700 py-2 px-6 rounded-xl font-semibold ${
            darkMode
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-400 text-white hover:bg-blue-500"
          }  `}
        >
          <img
            width="30"
            height="30"
            src="https://img.icons8.com/ios-filled/50/FFFFFF/sent.png"
            alt="sent"
          />
        </button>
      </div>
    </div>
  );
}

export default OneChat;
