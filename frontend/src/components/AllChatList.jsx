import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLogin } from "./LoginContext";

function AllChatList({ darkMode }) {
  const { islogedin } = useLogin();
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?img=1",
      lastMessage: "Hey! How's it going?",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/100?img=2",
      lastMessage: "Let's meet at 5 PM.",
    },
    {
      id: 3,
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/100?img=3",
      lastMessage: "Sure, I’ll be there!",
    },
    {
      id: 4,
      name: "Michael Lee",
      avatar: "https://i.pravatar.cc/100?img=4",
      lastMessage: "I need some help with the project.",
    },
  ]);

//   const fetchAllChats = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:5000/api/message/allusers",
//         {
//           withCredentials: true,
//         }
//       );
//       console.log(response.filterduser);
//       setChats(response.filterduser);
//     } catch (error) {
//       console.log("error while feetching all chats", error);
//     }
//   };

//   useEffect(() => {
//     if (islogedin) {
//       fetchAllChats();
//     }
//   }, []);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`h-screen w-72 md:w-96 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-lg p-4 space-y-4 border-l-2`}
    >
      <div className="flex items-center justify-between mb-4">
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
      <div className="flex flex-col space-y-3 overflow-y-auto h-[calc(100vh-140px)] scrollbar-hide">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat, index) => (
            <a
              href={`/chat`}
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              {/* Chat Avatar */}
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full"
              />
              {/* Chat Details */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{chat.name}</h3>
                <p className="text-xs text-gray-400 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </a>
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center">No chats found!</p>
        )}
      </div>
    </div>
  );
}

export default AllChatList;
