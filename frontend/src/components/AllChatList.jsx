import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import { useToast } from "../context/ToastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../context/SoketContext";
import Loading from "./Loading";

function AllChatList({ darkMode, isOpenAllChat, setIsOpenAllChat }) {
  const { islogedin } = useLogin();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [pinchats, setPinChats] = useState([]);
  const [unpinchats, setUnPinChats] = useState([]);
  const { showError, showSuccess } = useToast();
  const { selectId } = useParams();
  const { onlineUsers } = useSocket();

  // Sidebar width state
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const startResize = () => setIsResizing(true);

  const handleMouseMove = (e) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = Math.min(
      Math.max(220, e.clientX - containerRect.left), // min 220px
      450 // max 450px
    );
    setSidebarWidth(newWidth);
  };

  const stopResize = () => setIsResizing(false);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", stopResize);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isResizing]);

  // Fetch chats
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
        avatar:
          user.profilepic && user.profilepic.trim() !== ""
            ? user.profilepic
            : "/profile-backup.jpg",
        bio: user.bio || "",
        pinned: true,
      }));
      const formattedUnPinChats = refunpinChats.map((user) => ({
        paraid: user._id.toString(),
        id: user.email,
        name: user.name,
        avatar:
          user.profilepic && user.profilepic.trim() !== ""
            ? user.profilepic
            : "/profile-backup.jpg",
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
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const renderChat = (chat) => (
    <div
      key={chat.id}
      className={`relative flex items-center p-1.5 sm:p-2 rounded-lg shadow-md transition-all duration-300 gap-1.5 sm:gap-2
      ${
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
          if (window.innerWidth <= 800) {
            setIsOpenAllChat(false);
          }
        }}
        className="flex items-center flex-1 overflow-hidden gap-1.5 sm:gap-2"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10">
          <img
            src={chat.avatar || "/profile-backup.jpg"}
            className="w-full h-full rounded-full border border-blue-400 shadow-sm object-cover"
            alt="User Avatar"
          />
          {onlineUsers.includes(String(chat.paraid)) && (
            <FontAwesomeIcon
              className="absolute -bottom-0.5 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3"
              icon={faCircle}
              style={{ color: "#63E6BE" }}
            />
          )}
        </div>

        {/* Chat details */}
        <div className="overflow-hidden flex-1">
          <h3 className="text-xs sm:text-sm font-semibold truncate">
            {chat.name || chat.id.split("@")[0]}
          </h3>
          <p
            className={`text-[10px] sm:text-xs truncate ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {chat.bio}
          </p>
        </div>
      </Link>

      {/* Pin Button */}
      <button
        className="p-1"
        onClick={() => handlePinToggle(chat)}
        title={chat.pinned ? "Unpin Chat" : "Pin Chat"}
      >
        <FontAwesomeIcon
          icon={faThumbtack}
          className={`text-[10px] sm:text-xs transition-transform ${
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
          ref={containerRef}
          className={`${
            window.innerWidth >= 800
              ? "relative"
              : "absolute top-0 left-14 z-500"
          } h-screen flex-shrink-0`}
          style={{ width: `${sidebarWidth}px` }}
        >
          <div
            className={`h-full transition-all duration-300 p-4 border-r-2 ${
              darkMode
                ? "bg-gray-900 text-white border-blue-800"
                : "bg-white text-gray-900 border-blue-400"
            } shadow-xl`}
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

          <div
            className="absolute top-0 right-0 h-full w-2 bg-gray-300 hover:bg-gray-400 cursor-col-resize"
            onMouseDown={startResize}
          ></div>
        </div>
      )}

      {loading && <Loading />}
    </>
  );
}

export default AllChatList;
