import React from "react";
import DropDownDelete from "./DropDownDelete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

function MessageBubble({
  message,
  id,
  setShowImage,
  setNewMsg,
  handleEditMsg,
  setEditingMsgId,
  handleDeleteMsg,
  handleReplyMsg,
  editingMsgId,
  reciverDetails,
  darkMode,
  loginusername,
  newMsg,
}) {
  const isImage = (file) => /\.(jpeg|jpg|png|gif|webp)$/i.test(file);

  const renderReplyBlock = (replyTo) => {
    if (!replyTo) return null;

    return (
      <div className="flex mb-1">
        <div
          className={`w-1 rounded-l-md ${
            darkMode ? "bg-blue-400" : "bg-blue-600"
          }`}
        />
        <div
          className={`flex flex-col flex-wrap px-2 overflow-hidden py-1 rounded-r-md flex-1 ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800"
          }`}
        >
          <span className="text-xs font-semibold overflow-hidden text-blue-500">
            {replyTo.sender?.name === loginusername
              ? "You"
              : replyTo.sender?.name}
          </span>
          <span className="text-xs truncate w-full overflow-hidden">
            {replyTo.message}
            {replyTo.file &&
              (isImage(replyTo.file) ? (
                <img
                  src={replyTo.file}
                  onClick={() => {
                    setShowImage(replyTo.file);
                  }}
                  alt="reply"
                  className="w-10 h-10 rounded mt-1 object-cover"
                />
              ) : (
                <a
                  href={replyTo.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline mt-1 inline-block"
                >
                  📄 {replyTo.file.split("/").pop()}
                </a>
              ))}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-4">
      {message.recipient === id ? (
        <div className="flex justify-end items-start space-x-2">
          <div className={`flex flex-col items-end`}>
            {message.file &&
              (isImage(message.file) ? (
                <div
                  className={`${
                    darkMode
                      ? "bg-blue-800 text-gray-300"
                      : "bg-gray-100 text-blue-800"
                  }`}
                >
                  {renderReplyBlock(message.replyTo)}
                  <img
                    src={message.file}
                    onClick={() => setShowImage(message.file)}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-lg shadow-md cursor-pointer transition transform hover:scale-105"
                    alt="image"
                  />
                </div>
              ) : (
                <a
                  href={message.file}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-xl rounded-tl-xl rounded-tr-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
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
                  <div className="py-1 px-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-xl rounded-tl-xl rounded-tr-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md break-words whitespace-pre-wrap transition-all transform hover:scale-105 cursor-pointer">
                    {renderReplyBlock(message.replyTo)}
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
            isEditdeletemenu={true}
            isreplymenu={true}
            onDelete={() => handleDeleteMsg(message._id)}
            onEdit={() => {
              setEditingMsgId(message._id);
              setNewMsg(message.message);
            }}
            onReply={() => {
              handleReplyMsg(message._id, message.message, message.file);
            }}
          />
        </div>
      ) : (
        <div className="flex justify-start items-start space-x-2">
          <div className="flex justify-end items-start space-x-2">
            <img
              src={reciverDetails.profilepic}
              className="object-cover h-10 w-10 rounded-full border-2 border-gray-400"
              alt="Receiver"
            />
            <DropDownDelete
              onReply={() => {
                handleReplyMsg(message._id, message.message, message.file);
              }}
              isEditdeletemenu={false}
              isreplymenu={true}
            />
            <div className="flex flex-col items-start">
              {message.file &&
                (isImage(message.file) ? (
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
                    className="py-3 px-4 bg-gradient-to-br from-green-500 to-green-700 rounded-br-xl rounded-tr-xl rounded-tl-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
                  >
                    📄 {message.file.split("/").pop()}
                  </a>
                ))}

              {message.message.length > 0 && (
                <div className="py-1 px-4 bg-gradient-to-br break-words whitespace-pre-wrap from-green-500 to-green-700 rounded-br-xl rounded-tr-xl rounded-tl-xl text-white max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-md">
                  {renderReplyBlock(message.replyTo)}
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
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
