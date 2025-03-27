import React, { useState, useEffect, useRef, use } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "./context/ToastContext";
import { useLogin } from "./context/LoginContext";
import { useSocket } from "./context/SoketContext";
import axios from "axios";
import DropDownDelete from "./DropDownDelete";

function OneChat({ darkMode }) {
  const { socket } = useSocket();

  const [messages, setMessages] = useState([]);
  const [sentMsg, setSentMsg] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { showError, showSuccess, showImageNotification } = useToast();
  const [showImage, setShowImage] = useState(null);

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
      if (sentMsg.length > 0 || selectedFile) {
        const formData = new FormData();

        formData.append("sentMsg", sentMsg);

        if (selectedFile) {
          formData.append("selectedFile", selectedFile);
        }
        const response = await axios.post(
          `http://localhost:5000/api/message/send/${id}`,
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
          showSuccess("message sent succesfully");
        }
        setSentMsg("");
        setSelectedFile(null);
      } else {
        showError("enter some message");
      }
    } catch (error) {
      console.log("error while sending chat", error);
      showError(response.data.error || "error while sending chat");
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
      const response = await axios.delete(
        `http://localhost:5000/api/message/delete/${id}`
      );
      if (response) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        showSuccess("message deleted successfully");
      }
    } catch (error) {
      console.log("error while deleting message", error);
      showError(error.response?.data?.error || "error while deleting message");
    }
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
          className="h-10 w-10 rounded-full object-cover cursor-pointer"
          onClick={() => setShowImage(reciverDetails.profilepic)}
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
                    {message.file &&
                      (/\.(jpeg|jpg|png|gif)$/i.test(message.file) ? (
                        <img
                          src={message.file}
                          onClick={() => setShowImage(message.file)}
                          className="w-40 h-40 rounded-lg shadow-md"
                          alt="image"
                        />
                      ) : (
                        <a
                          href={message.file}
                          target="_blank"
                          rel="noreferrer"
                          className={`mr-2 py-3 px-4 bg-blue-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white break-words max-w-xs md:max-w-sm lg:max-w-md overflow-hidden`}
                        >
                          📄 {message.file.split("/").pop()}
                        </a>
                      ))}
                    {message.message.length > 0 && (
                      <div
                        className={`mr-2 py-3 px-4 bg-blue-500 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white break-words max-w-xs md:max-w-sm lg:max-w-md overflow-hidden`}
                      >
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
                  <div>
                    <img
                      src={thisuserpic}
                      className="object-cover h-8 w-8 rounded-full border-2 border-blue-400"
                      alt="User"
                    />
                    <DropDownDelete
                      onDelete={() => {
                        handleDeleteMsg(message._id);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-start items-start space-x-2">
                  <img
                    src={reciverDetails.profilepic}
                    className="object-cover h-8 w-8 rounded-full border-2 border-gray-400"
                    alt="Receiver"
                  />
                  <div className="flex flex-col items-start rounded-br-3xl rounded-tr-3xl rounded-tl-xl">
                    {message.file &&
                      (/\.(jpeg|jpg|png|gif)$/i.test(message.file) ? (
                        <img
                          src={message.file}
                          onClick={() => setShowImage(message.file)}
                          className="w-40 h-40 rounded-lg  "
                          alt="image"
                        />
                      ) : (
                        <a
                          href={message.file}
                          target="_blank"
                          rel="noreferrer"
                          className={`mr-2 py-3 px-4 bg-blue-500 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white break-words max-w-xs md:max-w-sm lg:max-w-md overflow-hidden`}
                        >
                          📄 {message.file.split("/").pop()}
                        </a>
                      ))}
                    {message.message.length > 0 && (
                      <div
                        className={`mr-2 py-3 px-4 bg-blue-500 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white break-words max-w-xs md:max-w-sm lg:max-w-md overflow-hidden`}
                      >
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
          onClick={() => handleButtonClickForImg()}
          className={`py-2 px-4 rounded-lg font-semibold ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-200 text-black hover:bg-gray-400"
          }`}
        >
          📎
        </button>
        <button
          onClick={handlesend}
          disabled={!sentMsg && !selectedFile}
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
        {selectedFile && (
          <div
            className={`absolute bottom-20 right-30 flex items-center justify-between p-2 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-20 h-20 rounded-lg shadow-md"
              />
            ) : (
              <p className="text-sm text-gray-500">📄 {selectedFile.name}</p>
            )}
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-2 right-2 text-xs text-red-500 ml-3"
            >
              🇽
            </button>
          </div>
        )}
        {showImage && (
          <div
            className={`absolute bottom-1/3 right-1/3 flex items-center justify-between p-2 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <img
              src={showImage}
              alt="Preview"
              className="w-96 h-96 rounded-lg shadow-md"
            />

            <button
              onClick={() => setShowImage(null)}
              className="absolute top-4 right-4 text-xs text-red-500 ml-3 cursor-pointer"
            >
              🇽
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OneChat;
