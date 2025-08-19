import React, { useState, useEffect, useRef } from "react";
import "../index.css";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useSocket } from "../context/SoketContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPaperPlane,
  faPaperclip,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import ScrollToBottom from "react-scroll-to-bottom";
import { useLogin } from "../context/LoginContext";
import ReplyBox from "../components/ReplyBox";
import FilePreview from "../components/FilePreview";
import ShowImage from "../components/ShowImage";
import Loading from "../components/Loading";
import MessageBubble from "../components/MessageBubble";

function OneChat({ darkMode }) {
  const { socket } = useSocket();
  const { name: loginusername } = useLogin();
  const chatinputref = useRef(null);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sentMsg, setSentMsg] = useState("");
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { showError, showSuccess } = useToast();
  const [showImage, setShowImage] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [replymsgid, setReplymsgid] = useState(null);
  const [replymsg, setReplymsg] = useState("");
  const [replyfile, setReplyfile] = useState(null);

  const [isOpenTopMenu, setIOpenTopMenu] = useState(false);

  const handleClearChat = async () => {
    if (window.confirm("Are you sure you want to clear this chat?")) {
      alert("this feature is coming soon");
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/message/clear/${id}`
        );
        if (response.status === 200) {
          setMessages([]);
          showSuccess(response.data.message || "Chat cleared successfully.");
        }
        setIOpenTopMenu(false);
      } catch (error) {
        showError(error.responnse.data.error || "error while clearing chat");
      }
    }
  };

  const [reciverDetails, setReciverDetails] = useState({
    name: "user",
    mobileno: 0,
    profilepic: "",
  });
  // console.log(reciverDetails);

  const { id } = useParams();

  const fetchOneChat = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/message/chat/${id}`
      );
      const reciverres = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/fetchuser/${id}`
      );
      setMessages(response.data);
      setReciverDetails({
        name: reciverres.data.name,
        email: reciverres.data.email,
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

  const handleReplyMsg = (id, msg, file) => {
    setReplymsgid(id);
    if (msg) {
      setReplymsg(msg);
    }
    if (file) {
      setReplyfile(file);
    }
    chatinputref.current?.focus();
  };

  const sendMessage = async () => {
    try {
      setLoading(true);
      if (sentMsg.length > 0 || selectedFile) {
        const formData = new FormData();

        formData.append("sentMsg", sentMsg);
        if (replymsgid) {
          formData.append("replyTo", replymsgid);
        }

        if (selectedFile) {
          formData.append("selectedFile", selectedFile);
        }
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/message/send/${id}`,
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
          setLoading(false);
        }
        setSentMsg("");
        setSelectedFile(null);
        setReplymsgid(null);
        setReplyfile(null);
        setReplymsg("");
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
        `${import.meta.env.VITE_API_URL}/api/message/delete/${id}`
      );
      if (response) {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        showSuccess("Message deleted successfully.");
      }
      setLoading(false);
      setReplyfile(null);
      setReplymsg("");
      setReplymsgid(null);
    } catch (error) {
      console.log("error while deleting message", error);
      showError(error.response?.data?.error || "Error while deleting message");
    }
  };
  const handleEditMsg = async (id) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/message/edit/${id}`,
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

  useEffect(() => {
    if (isOpenTopMenu) {
      document.addEventListener("click", () => setIOpenTopMenu(false));
    }
    return () => {
      document.removeEventListener("click", () => setIOpenTopMenu(false));
    };
  }, [isOpenTopMenu]);

  return (
    <div
      className={`w-full h-screen flex flex-col justify-between ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } custom-scrollbar`}
    >
      {/* chat top bar */}
      <div
        className={`sticky top-0 z-400 w-full pl-20 pr-5 py-3 flex items-center gap-2 justify-between shadow-md custom-scrollbar ${
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
          {reciverDetails.name || reciverDetails.email.split("@")[0]}
        </span>
        <div className="ml-auto relative">
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              setIOpenTopMenu((prev) => !prev);
            }}
            className={`p-2 rounded-full ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-400"
            } transition`}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>

          {isOpenTopMenu && (
            <div
              className={`absolute right-0 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-50`}
            >
              <button
                onClick={handleClearChat}
                className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-500 dark:text-white text-red-600 rounded-b"
              >
                Clear Chat
              </button>
            </div>
          )} */}
        </div>
      </div>

      <div
        className={`flex flex-col pt-3 px-3 pb-1 sm:px-5  overflow-y-auto flex-grow space-y-3 custom-scrollbar ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <ScrollToBottom className="flex-grow overflow-y-auto custom-scrollbar">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                id={id}
                setShowImage={setShowImage}
                newMsg={newMsg}
                setNewMsg={setNewMsg}
                handleEditMsg={handleEditMsg}
                setEditingMsgId={setEditingMsgId}
                handleDeleteMsg={handleDeleteMsg}
                handleReplyMsg={handleReplyMsg}
                editingMsgId={editingMsgId}
                reciverDetails={reciverDetails}
                darkMode={darkMode}
                loginusername={loginusername}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-5">No messages yet</p>
          )}
        </ScrollToBottom>
      </div>
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-blue-400 text-gray-100"
            : "bg-gray-200 border-blue-600 text-gray-700"
        }`}
      >
        <ReplyBox
          replymsgid={replymsgid}
          replymsg={replymsg}
          replyfile={replyfile}
          setReplymsg={setReplymsg}
          setReplyfile={setReplyfile}
          setReplymsgid={setReplymsgid}
          setShowImage={setShowImage}
          darkMode={darkMode}
        />
      </div>

      <div
        className={`w-full px-3 sm:px-5 py-3 flex items-center gap-3 ${
          darkMode ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <div className="w-full flex flex-col space-y-2">
          <input
            className={`flex-grow py-3 px-4 rounded-xl shadow-md outline-none ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                : "bg-white text-black focus:ring-2 focus:ring-blue-500"
            }`}
            type="text"
            value={sentMsg}
            ref={chatinputref}
            onChange={(e) => setSentMsg(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
          />
        </div>

        <div className="flex items-center gap-3 ml-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
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
            } `}
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
            } `}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>

        <FilePreview
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          setShowImage={setShowImage}
        />
      </div>

      <ShowImage setShowImage={setShowImage} showImage={showImage} />
      {loading && <Loading />}
    </div>
  );
}

export default OneChat;
