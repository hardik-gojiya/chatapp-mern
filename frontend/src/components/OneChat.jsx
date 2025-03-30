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
      <div
        className={`w-full px-20 py-3 flex items-center gap-3 shadow-md custom-scrollbar ${
          darkMode ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <Link
          to="/"
          className={`py-2 px-4 rounded-lg font-semibold transition duration-300 ${
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
          className="h-12 w-12 rounded-full object-cover cursor-pointer border-2 border-gray-400 hover:scale-110 transition duration-300"
          onClick={() => setShowImage(reciverDetails.profilepic)}
        />
        <span className="text-lg font-semibold truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          {reciverDetails.name || reciverDetails.mobileno}
        </span>
      </div>

      <div
        className={`flex flex-col pt-3 px-3 pb-1 sm:px-5  overflow-y-auto flex-grow space-y-3 custom-scrollbar ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <ScrollToBottom className="flex-grow overflow-y-auto custom-scrollbar">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message._id} className="mb-4">
                {message.recipient === id ? (
                  <div className="flex justify-end items-start space-x-2">
                    <div className="flex flex-col  items-end">
                      {message.file &&
                        (/\.(jpeg|jpg|png|gif)$/i.test(message.file) ? (
                          <img
                            src={message.file}
                            onClick={() => setShowImage(message.file)}
                            className="w-40 h-40 md:w-48 md:h-48 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105"
                            alt="image"
                          />
                        ) : (
                          <a
                            href={message.file}
                            target="_blank"
                            rel="noreferrer"
                            className="py-3 px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
                          >
                            📄 {message.file.split("/").pop()}
                          </a>
                        ))}
                      {message.message.length > 0 && (
                        <>
                          {editingMsgId === message._id ? (
                            <div className="flex items-center space-x-3 bg-white shadow-md rounded-xl p-3 border border-gray-300 dark:bg-gray-800 dark:border-gray-600">
                              <input
                                type="text"
                                value={newMsg}
                                onChange={(e) => setNewMsg(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                                placeholder="Edit your message..."
                              />
                              <button
                                onClick={() => handleEditMsg(editingMsgId)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button
                                onClick={() => {
                                  setNewMsg("");
                                  setEditingMsgId(null);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                              >
                                <FontAwesomeIcon icon={faXmark} />
                              </button>
                            </div>
                          ) : (
                            <div className="py-3 px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md break-words whitespace-pre-wrap transition-all transform hover:scale-105 cursor-pointer">
                              {message.message}
                            </div>
                          )}
                        </>
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
                    <DropDownDelete
                      onDelete={() => {
                        handleDeleteMsg(message._id);
                      }}
                      onEdit={() => {
                        setEditingMsgId(message._id);
                        setNewMsg(message.message);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex justify-start items-start space-x-2">
                    <img
                      src={reciverDetails.profilepic}
                      className="object-cover h-10 w-10 rounded-full border-2 border-gray-400"
                      alt="Receiver"
                    />
                    <div className="flex flex-col items-start">
                      {message.file &&
                        (/\.(jpeg|jpg|png|gif)$/i.test(message.file) ? (
                          <img
                            src={message.file}
                            onClick={() => setShowImage(message.file)}
                            className="w-40 h-40 md:w-48 md:h-48 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105"
                            alt="image"
                          />
                        ) : (
                          <a
                            href={message.file}
                            target="_blank"
                            rel="noreferrer"
                            className="py-3 px-4 bg-gradient-to-br from-green-500 to-green-700 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
                          >
                            📄 {message.file.split("/").pop()}
                          </a>
                        ))}
                      {message.message.length > 0 && (
                        <div className="py-3 px-4 bg-gradient-to-br break-words whitespace-pre-wrap from-green-500 to-green-700 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md">
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
                <div ref={goAtEndRef}></div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-5">No messages yet</p>
          )}
        </ScrollToBottom>
      </div>

      <div
        className={`w-full px-3 sm:px-5 py-3 flex items-center gap-3 ${
          darkMode ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <input
          className={`flex-grow py-3 px-4 rounded-xl shadow-md outline-none ${
            darkMode
              ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              : "bg-white text-black focus:ring-2 focus:ring-blue-500"
          }`}
          type="text"
          value={sentMsg}
          onChange={(e) => setSentMsg(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
          }}
        />
        <button
          onClick={handleButtonClickForImg}
          className={`p-3 rounded-full transition-all duration-300 shadow-md ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black hover:bg-gray-400"
          }`}
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </button>
        <button
          onClick={handlesend}
          disabled={!sentMsg && !selectedFile}
          className={`p-3 rounded-full transition-all duration-300 shadow-md ${
            darkMode
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-400 text-white hover:bg-blue-500"
          }`}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
        {selectedFile && (
          <div className="absolute left-96 bottom-20 flex items-center space-x-3 p-2 border rounded-lg bg-gray-100 shadow-sm">
            {/\.(jpeg|jpg|png|gif)$/i.test(selectedFile.name) ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium truncate max-w-xs">
                  {selectedFile.name}
                </span>
                <FontAwesomeIcon icon={faPaperclip} className="text-gray-500" />
              </div>
            )}
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {showImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setShowImage(null)}
        >
          <img
            src={showImage}
            alt="Preview"
            className="max-w-xl max-h-full rounded-lg shadow-lg"
          />
          <button
            onClick={() => setSelectedFile(null)}
            className="absolute top-2 right-4 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md hover:bg-red-600 transition"
          >
            ✕
          </button>
        </div>
      )}
      {loading && (
        <div
          className="absolute top-5 left-1/2 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      )}
      <button
        onClick={handleGoAtEnd}
        className="fixed bottom-20 right-5 bg-gray-500 text-white rounded-full p-2 shadow-md hover:bg-blue-500 btn-glow transition"
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </button>
    </div>
  );
}

export default OneChat;
