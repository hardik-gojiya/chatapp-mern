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
      <div className="flex mb-1 max-w-full">
        <div
          className={`w-1 rounded-l-md ${
            darkMode ? "bg-blue-400" : "bg-blue-600"
          }`}
        />
        <div
          className={`flex flex-col px-2 py-1 rounded-r-md flex-1 overflow-hidden ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-800"
          }`}
        >
          <span className="text-xs font-semibold text-blue-500 truncate">
            {replyTo.sender?.name === loginusername
              ? "You"
              : replyTo.sender?.name}
          </span>
          <span className="text-xs truncate w-full">
            {replyTo.message}
            {replyTo.file &&
              (isImage(replyTo.file) ? (
                <img
                  src={replyTo.file}
                  onClick={() => setShowImage(replyTo.file)}
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

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const bubbleBaseClasses =
    "px-2 py-1 text-white shadow-md break-words whitespace-pre-wrap max-w-[70vw] sm:max-w-sm md:max-w-md lg:max-w-lg transition-all";

  return (
    <div className="mb-4 w-full">
      {message.recipient === id ? (
        <div className="flex justify-end items-start gap-0.5">
          <div className="flex flex-col items-end max-w-full">
            {message.file &&
              (isImage(message.file) ? (
                <div
                  className={`mb-1 ${
                    darkMode
                      ? "bg-blue-800 text-gray-300"
                      : "bg-gray-100 text-blue-800"
                  } rounded-lg p-1`}
                >
                  {renderReplyBlock(message.replyTo)}
                  <img
                    src={message.file}
                    onClick={() => setShowImage(message.file)}
                    className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg shadow-md cursor-pointer object-cover hover:scale-105 transition"
                    alt="image"
                  />
                </div>
              ) : (
                <a
                  href={message.file}
                  target="_blank"
                  rel="noreferrer"
                  className={`${bubbleBaseClasses} bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-xl rounded-tl-xl rounded-tr-xl`}
                >
                  📄 {message.file.split("/").pop()}
                </a>
              ))}

            {message.message.length > 0 && (
              <>
                {editingMsgId === message._id ? (
                  <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 shadow-md rounded-xl p-3 border border-gray-300 dark:border-gray-600 w-full max-w-[85vw] sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <input
                      type="text"
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      className="flex-grow px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-500"
                      placeholder="Edit your message..."
                    />
                    <button
                      onClick={() => handleEditMsg(editingMsgId)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg shadow-md"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button
                      onClick={() => {
                        setNewMsg("");
                        setEditingMsgId(null);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`${bubbleBaseClasses} border-r-4 border-green-500 bg-gradient-to-br from-blue-500 to-blue-700 rounded-bl-xl rounded-tl-xl rounded-tr-xl cursor-pointer hover:scale-105`}
                  >
                    {renderReplyBlock(message.replyTo)}
                    {message.message}
                  </div>
                )}
              </>
            )}
            <span className="text-xs text-gray-400 mt-1">
              {formatTime(message.createdAt)}
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
        <div className="flex justify-start max-w-[70vw] items-start gap-0.5">
          <img
            src={reciverDetails.profilepic}
            className="h-7 w-7 rounded-full border-2 border-gray-400 object-cover"
            alt="Receiver"
          />
          <DropDownDelete
            isEditdeletemenu={false}
            isreplymenu={true}
            onReply={() => {
              handleReplyMsg(message._id, message.message, message.file);
            }}
          />
          <div className="flex  flex-col items-start max-w-full">
            {message.file &&
              (isImage(message.file) ? (
                <img
                  src={message.file}
                  onClick={() => setShowImage(message.file)}
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-lg shadow-md cursor-pointer object-cover hover:scale-105 transition"
                  alt="image"
                />
              ) : (
                <a
                  href={message.file}
                  target="_blank"
                  rel="noreferrer"
                  className={`${bubbleBaseClasses} bg-gradient-to-br from-green-500 to-green-700 rounded-tr-xl rounded-br-xl rounded-tl-xl`}
                >
                  📄 {message.file.split("/").pop()}
                </a>
              ))}

            {message.message.length > 0 && (
              <div
                className={`${bubbleBaseClasses} border-l-4 border-blue-500 bg-gradient-to-br from-green-500 to-green-700 rounded-tr-xl rounded-br-xl rounded-tl-xl`}
              >
                {renderReplyBlock(message.replyTo)}
                {message.message}
              </div>
            )}
            <span className="text-xs text-gray-400 mt-1">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
