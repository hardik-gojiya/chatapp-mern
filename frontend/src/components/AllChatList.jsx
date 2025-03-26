import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLogin } from "./context/LoginContext";
import { useToast } from "./context/ToastContext";
import OneChat from "./OneChat";

function AllChatList({ darkMode }) {
  const { islogedin } = useLogin();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const { showError } = useToast();

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
    <div
      className={`h-screen w-72 md:w-96 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-lg p-4 space-y-4 border-l-2 border-r-2`}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold">All Chats</h2>
      </div>

      <input
        type="text"
        placeholder="Search chats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full p-2 rounded-lg outline-none ${
          darkMode
            ? "bg-gray-800 text-white placeholder-gray-400"
            : "bg-gray-100 text-black"
        }`}
      />
      <div className="flex flex-col space-y-3 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <Link
              to={`/chat/${chat.paraid}`}
              key={chat.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-300"
              } transition cursor-pointer`}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold">
                  {chat.name || chat.id}
                </h3>
                <p
                  className={`text-xs truncate ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center">No chats found!</p>
        )}
      </div>
    </div>
  );
}

export default AllChatList;
