import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import { useToast } from "./context/ToastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "./context/SoketContext";

function AllChatList({ darkMode, isOpenAllChat, setIsOpenAllChat }) {
  const navigate = useNavigate();
  const { islogedin } = useLogin();
  const [search, setSearch] = useState("");
  const [pinchats, setPinChats] = useState([]);
  const [unpinchats, setUnPinChats] = useState([]);
  const { showError, showSuccess } = useToast();
  const { selectId } = useParams();
  const { onlineUsers } = useSocket();

  const fetchAllChats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/message/allusers`,
        { withCredentials: true }
      );

      const refpinChats = response.data?.pinChats || [];
      const refunpinChats = response.data?.unpinchat || [];

      const formattedPinChats = refpinChats.map((user) => ({
        paraid: user._id.toString(),
        id: user.email,
        name: user.name,
        avatar: user.profilepic,
        lastMessage: "",
        pinned: true,
      }));
      const formattedUnPinChats = refunpinChats.map((user) => ({
        paraid: user._id.toString(),
        id: user.email,
        name: user.name,
        avatar: user.profilepic,
        lastMessage: "",
        pinned: false,
      }));

      setPinChats(formattedPinChats);
      setUnPinChats(formattedUnPinChats);
    } catch (error) {
      console.error("Error while fetching all chats", error);
      showError("Error while fetching all chats");
    }
  };

  useEffect(() => {
    if (islogedin) fetchAllChats();
  }, [islogedin]);

  const filterChats = (chats) =>
    chats
      .filter((chat) => {
        const searchValue = search.toLowerCase();
        return (
          (chat.name && chat.name.toLowerCase().includes(searchValue)) ||
          (chat.id && chat.id.toLowerCase().includes(searchValue))
        );
      })
      .sort((a, b) => {
        const aOnline = onlineUsers.includes(String(a.paraid));
        const bOnline = onlineUsers.includes(String(b.paraid));
        return bOnline - aOnline;
      });

  const handlePinToggle = async (chat) => {
    const updatingId = chat.paraid;

    if (chat.pinned) {
      setPinChats((prev) => prev.filter((c) => c.paraid !== updatingId));
      setUnPinChats((prev) => [{ ...chat, pinned: false }, ...prev]);
    } else {
      setUnPinChats((prev) => prev.filter((c) => c.paraid !== updatingId));
      setPinChats((prev) => [{ ...chat, pinned: true }, ...prev]);
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/adduserTopin`,
        { userTopinid: chat.paraid },
        { withCredentials: true }
      );

      showSuccess(chat.pinned ? "Chat unpinned" : "Chat pinned");
      fetchAllChats();
    } catch (err) {
      console.error("Error toggling pin:", err);
      showError("Failed to toggle pin/unpin");
    }
  };

  const renderChat = (chat) => (
    <div
      key={chat.id}
      className={`relative flex items-center space-x-4 p-2 rounded-xl shadow-lg transition-all duration-300 ${
        darkMode
          ? chat.paraid === selectId
            ? "bg-gradient-to-r from-blue-600 to-blue-800"
            : "bg-gray-800 hover:bg-gray-700"
          : chat.paraid === selectId
          ? "bg-gradient-to-r from-blue-300 to-blue-500"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      <Link
        to={`/chat/${chat.paraid}`}
        onClick={() => {
          setIsOpenAllChat(false);
        }}
        className="flex items-center space-x-4 flex-1"
      >
        <div className="relative w-12 h-12">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-md"
          />
          {onlineUsers.includes(String(chat.paraid)) && (
            <FontAwesomeIcon
              className="absolute -bottom-0 right-0 w-3 h-3"
              icon={faCircle}
              style={{ color: "#63E6BE" }}
            />
          )}
        </div>

        <div className="overflow-hidden">
          <h3 className="text-base font-semibold truncate">
            {chat.name || chat.id}
          </h3>
          <p
            className={`text-xs truncate ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {chat.lastMessage}
          </p>
        </div>
      </Link>

      <button
        className="p-2"
        onClick={() => handlePinToggle(chat)}
        title={chat.pinned ? "Unpin Chat" : "Pin Chat"}
      >
        <FontAwesomeIcon
          icon={faThumbtack}
          className={`text-sm ${
            darkMode ? "text-yellow-400" : "text-yellow-600"
          } ${chat.pinned ? "rotate-45" : ""}`}
        />
      </button>
    </div>
  );

  return (
    <>
      {isOpenAllChat && (
        <div
          className={`h-screen w-72 md:w-96 transition-all duration-300 p-4 border-l-2 border-r-2 ${
            darkMode
              ? "bg-gray-900 text-white border-blue-800"
              : "bg-white text-gray-900 border-blue-400"
          } shadow-xl ${
            isOpenAllChat && window.innerWidth < 700
              ? "absolute left-18 inset-0 z-10"
              : "block"
          }`}
        >
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="⌕ Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 ${
                darkMode
                  ? "bg-gray-800 text-white border border-gray-700 focus:ring-blue-500"
                  : "bg-gray-100 text-black border border-gray-300 focus:ring-blue-400"
              }`}
            />
          </div>

          <div
            className={`flex flex-col space-y-2 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar ${
              darkMode ? "scrollbar-dark" : "scrollbar-light"
            }`}
          >
            {filterChats(pinchats).length > 0 && (
              <>
                <p className="text-xs uppercase font-semibold text-gray-400 px-1">
                  Pinned
                </p>
                {filterChats(pinchats).map(renderChat)}
              </>
            )}

            {filterChats(unpinchats).length > 0 && (
              <>
                <p className="text-xs uppercase font-semibold text-gray-400 mt-4 px-1">
                  All Chats
                </p>
                {filterChats(unpinchats).map(renderChat)}
              </>
            )}

            {filterChats(pinchats).length + filterChats(unpinchats).length ===
              0 && (
              <p className="text-gray-400 text-sm text-center">
                No chats found!
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AllChatList;
