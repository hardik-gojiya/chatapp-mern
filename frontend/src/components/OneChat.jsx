import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import { Link, useParams } from "react-router-dom";
import { useToast } from "./context/ToastContext";
import { useLogin } from "./context/LoginContext";
import { useSocket } from "./context/SoketContext";
import axios from "axios";
import DropDownDelete from "./DropDownDelete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPaperPlane,
  faPaperclip,
  faXmark,
  faCheck,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import ScrollToBottom from "react-scroll-to-bottom";

function OneChat({ darkMode }) {
  const { socket } = useSocket();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sentMsg, setSentMsg] = useState("");
  const fileInputRef = useRef(null);
  const goAtEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { showError, showSuccess } = useToast();
  const [showImage, setShowImage] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [editingMsgId, setEditingMsgId] = useState(null);

  const [reciverDetails, setReciverDetails] = useState({
    name: "user",
    mobileno: 0,
    profilepic: "",
  });

  const { id } = useParams();

  const handleGoAtEnd = () => {
    goAtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    handleGoAtEnd();
  }, [setMessages]);

  const fetchOneChat = async () => {
    try {
      const response = await axios.get(
        `https://chat-in-uanp.onrender.com/api/message/chat/${id}`
      );
      const reciverres = await axios.get(
        `https://chat-in-uanp.onrender.com/api/users/fetchuser/${id}`
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
      setLoading(true);
      if (sentMsg.length > 0 || selectedFile) {
        const formData = new FormData();

        formData.append("sentMsg", sentMsg);

        if (selectedFile) {
          formData.append("selectedFile", selectedFile);
        }
        const response = await axios.post(
          `https://chat-in-uanp.onrender.com/api/message/send/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          socket.emit("sendMessage", {
            message: response.data.message,
            selectedFile: response.data.file,
            recipient: id,
            createdAt: new Date(),
          });
          showSuccess("message sent successfully");
          setLoading(false);
        }
        setSentMsg("");
        setSelectedFile(null);
      } else {
        showError("Enter some message.");
        setLoading(false);
      }
    } catch (error) {
      console.log("error while sending chat", error);
      showError("error while sending chat");
      setLoading(false);
    }
  };

  const handlesend = () => {
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && sentMsg.length > 0) {
      sendMessage();
    }
  };

  const handleButtonClickForImg = () => {
    fileInputRef.current.click();
  };

  const handleDeleteMsg = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `https://chat-in-uanp.onrender.com/api/message/delete/${id}`
      );
      if (response) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        showSuccess("Message deleted successfully.");
      }
      setLoading(false);
    } catch (error) {
      console.log("error while deleting message", error);
      showError(error.response?.data?.error || "Error while deleting message");
    }
  };
  const handleEditMsg = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `https://chat-in-uanp.onrender.com/api/message/edit/${id}`,
        { newMsg: newMsg }
      );
      if (response.status === 200) {
        setNewMsg("");
        setEditingMsgId(null);
        setLoading(false);
      } else {
        showError("something went wrong");
      }
    } catch (error) {
      console.log("error while editing msg", error);
      showError(response.data.error || "error while editing message");
    }
  };

  return (
    <div
  className={`w-full h-screen flex flex-col justify-between ${
    darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
  } custom-scrollbar`}
>
  {/* Header */}
  <div
    className={`w-full px-3 sm:px-5 py-3 flex items-center gap-2 sm:gap-3 shadow-md ${
      darkMode ? "bg-gray-900" : "bg-gray-300"
    }`}
  >
    <Link
      to="/"
      className={`py-2 px-3 sm:px-4 rounded-lg font-semibold transition duration-300 ${
        darkMode
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "bg-gray-200 text-black hover:bg-gray-400"
      }`}
    >
      <FontAwesomeIcon icon={faArrowLeft} />
    </Link>
    <img
      src={reciverDetails.profilepic}
      alt="Contact DP"
      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover cursor-pointer border-2 border-gray-400 hover:scale-110 transition duration-300"
      onClick={() => setShowImage(reciverDetails.profilepic)}
    />
    <span className="text-sm sm:text-lg font-semibold truncate max-w-[50%] sm:max-w-xs md:max-w-md lg:max-w-lg">
      {reciverDetails.name || reciverDetails.mobileno}
    </span>
  </div>

  {/* Messages Container */}
  <div
    className={`flex flex-col pt-2 sm:pt-3 px-2 sm:px-5 pb-1 overflow-y-auto flex-grow space-y-2 sm:space-y-3 ${
      darkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <ScrollToBottom className="flex-grow overflow-y-auto custom-scrollbar">
      {messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id} className="mb-3 sm:mb-4">
            {message.recipient === id ? (
              <div className="flex justify-end items-start space-x-2">
                <div className="flex flex-col items-end">
                  {message.file &&
                    (/\.(jpeg|jpg|png|gif)$/i.test(message.file) ? (
                      <img
                        src={message.file}
                        onClick={() => setShowImage(message.file)}
                        className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105"
                        alt="image"
                      />
                    ) : (
                      <a
                        href={message.file}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 sm:py-3 sm:px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-[80%] sm:max-w-xs md:max-w-md lg:max-w-lg overflow-hidden"
                      >
                        📄 {message.file.split("/").pop()}
                      </a>
                    ))}
                  {message.message.length > 0 && (
                    <div className="py-2 px-3 sm:py-3 sm:px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-[80%] sm:max-w-xs md:max-w-md lg:max-w-lg shadow-md break-words whitespace-pre-wrap transition-all transform hover:scale-105 cursor-pointer">
                      {message.message}
                    </div>
                  )}
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
            ) : (
              <div className="flex justify-start items-start space-x-2">
                <img
                  src={reciverDetails.profilepic}
                  className="object-cover h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-gray-400"
                  alt="Receiver"
                />
                <div className="flex flex-col items-start">
                  {message.file &&
                    (/\.(jpeg|jpg|png|gif)$/i.test(message.file) ? (
                      <img
                        src={message.file}
                        onClick={() => setShowImage(message.file)}
                        className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105"
                        alt="image"
                      />
                    ) : (
                      <a
                        href={message.file}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 sm:py-3 sm:px-4 bg-gradient-to-br from-green-500 to-green-700 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-[80%] sm:max-w-xs md:max-w-md lg:max-w-lg overflow-hidden"
                      >
                        📄 {message.file.split("/").pop()}
                      </a>
                    ))}
                  {message.message.length > 0 && (
                    <div className="py-2 px-3 sm:py-3 sm:px-4 bg-gradient-to-br from-green-500 to-green-700 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-[80%] sm:max-w-xs md:max-w-md lg:max-w-lg shadow-md">
                      {message.message}
                    </div>
                  )}
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
    </ScrollToBottom>
  </div>

  {/* Input Field */}
  <div
    className={`w-full px-2 sm:px-5 py-3 flex items-center gap-2 sm:gap-3 ${
      darkMode ? "bg-gray-800" : "bg-gray-300"
    }`}
  >
    <input
      className={`flex-grow py-2 px-3 sm:py-3 sm:px-4 rounded-xl shadow-md outline-none ${
        darkMode
          ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          : "bg-white text-black focus:ring-2 focus:ring-blue-500"
      }`}
      type="text"
      value={sentMsg}
      onChange={(e) => setSentMsg(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your message..."
    />
    <button
      onClick={handlesend}
      disabled={!sentMsg && !selectedFile}
      className="p-2 sm:p-3 rounded-full transition-all duration-300 shadow-md bg-blue-500 text-white hover:bg-blue-600"
    >
      <FontAwesomeIcon icon={faPaperPlane} />
    </button>
  </div>
</div>

  );
}

export default OneChat;
