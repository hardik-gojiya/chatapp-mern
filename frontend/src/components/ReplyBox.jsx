import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ReplyBox({
  darkMode,
  replymsgid,
  replymsg,
  replyfile,
  setReplymsgid,
  setReplymsg,
  setReplyfile,
  setShowImage,
}) {
  return (
    <div>
      {replymsgid && (replymsg || replyfile) && (
        <div
          className={`relative w-full mb-2 p-2 rounded-lg flex items-start border-l-4 ${
            darkMode
              ? "bg-gray-700 border-blue-400 text-gray-100"
              : "bg-gray-200 border-blue-600 text-gray-800"
          }`}
        >
          <div className="flex flex-col flex-grow">
            <span className="text-sm font-semibold text-blue-500 mb-1">
              Replying to
            </span>
            <div className="text-sm break-words max-w-xs">
              {/* Conditionally render if it's a file or text */}
              {replyfile ? (
                /\.(jpeg|jpg|png|gif)$/i.test(replyfile) ? (
                  <div className="flex justify-between items-center gap-2">
                    <FontAwesomeIcon icon={faPaperclip} />{" "}
                    <img
                      className="h-15 w-30"
                      src={replyfile}
                      alt=""
                      onClick={() => setShowImage(replyfile)}
                    />
                    <span className="truncate">{replymsg}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2">
                    <FontAwesomeIcon icon={faPaperclip} />{" "}
                    <a href={replyfile}>{replyfile.split("/").pop()}</a>
                    <span className="truncate">{replymsg}</span>
                  </div>
                )
              ) : (
                <span>{replymsg}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setReplymsgid(null);
              setReplymsg("");
              setReplyfile(null);
            }}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ReplyBox;
