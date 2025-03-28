import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import { useToast } from "./context/ToastContext";

function AllChatList({ darkMode, isOpenAllChat, setIsOpenAllChat }) {
  const { islogedin } = useLogin();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const { showError } = useToast();
  const { selectId } = useParams();

  const fetchAllChats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/message/allusers",
        {
          withCredentials: true,
        }
      );
      const users = response.data || [];
      const formattedChats = users.map((user) => ({
        paraid: user._id,
        id: user.mobileno,
        name: user.name,
        avatar: user.profilepic,
        lastMessage: "",
      }));
      setChats(formattedChats);
    } catch (error) {
      console.log("Error while fetching all chats", error);
      showError("Error while fetching all chats");
    }
  };

  useEffect(() => {
    if (islogedin) {
      fetchAllChats();
    }

  }, [islogedin, chats.length]);

  const filteredChats = chats.filter((chat) =>
    (chat.name || String(chat.id)).toLowerCase().includes(search.toLowerCase())
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
              ? "absolute left-18 inset-0 z-10 "
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
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <Link
                  to={`/chat/${chat.paraid}`}
                  key={chat.id}
                  className={`flex items-center space-x-4 p-2 rounded-xl shadow-lg transition-all duration-300 ${
                    darkMode
                      ? chat.paraid == selectId
                        ? "bg-gradient-to-r from-blue-600 to-blue-800"
                        : "bg-gray-800 hover:bg-gray-700"
                      : chat.paraid == selectId
                      ? "bg-gradient-to-r from-blue-300 to-blue-500"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full border-2 border-blue-400 shadow-md"
                  />
                  <div className="flex-1">
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
              ))
            ) : (
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
