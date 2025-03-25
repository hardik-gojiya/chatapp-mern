import React from "react";
import { Link } from "react-router-dom";


function OneChat({ darkMode, contactName = "John Doe", contactDP = "https://source.unsplash.com/random/600x600" }) {
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
          src={contactDP}
          alt="Contact DP"
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">{contactName}</span>
      </div>

      <div className="flex flex-col mt-5 px-5 overflow-y-auto flex-grow">
        <div className="flex justify-end mb-4">
          <div
            className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
          >
            Welcome to group everyone!
          </div>
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
        </div>
        <div className="flex justify-start mb-4">
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
          <div
            className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat at
            praesentium, aut ullam delectus odio error sit rem. Architecto
            nulla doloribus laborum illo rem enim dolor odio saepe, consequatur
            quas?
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <div>
            <div
              className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magnam,
              repudiandae.
            </div>

            <div
              className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
              reiciendis!
            </div>
          </div>
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
        </div>
        <div className="flex justify-start mb-4">
          <img
            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
            className="object-cover h-8 w-8 rounded-full"
            alt=""
          />
          <div
            className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
          >
            Happy holiday guys!
          </div>
        </div>
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
          placeholder="Type your message here..."
        />
        <button
          className={`py-3 px-6 rounded-xl font-semibold ${
            darkMode
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-blue-400 text-white hover:bg-blue-500"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default OneChat;