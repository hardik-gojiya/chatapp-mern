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
          className={`relative ml-5 mr-35 max-h-30 p-3 rounded-lg flex flex-col overflow-hidden items-start border-l-4 ${
            darkMode
              ? "bg-gray-700 border-blue-400 text-gray-100"
              : "bg-gray-200 border-blue-600 text-gray-700"
          }`}
        >
          <div className="flex flex-col w-full">
            <span className="text-sm font-semibold text-blue-500 mb-1">
              Replying to
            </span>

            <div className="text-sm break-words w-full max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg">
              {replyfile ? (
                /\.(jpeg|jpg|png|gif|webp)$/i.test(replyfile) ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <FontAwesomeIcon icon={faPaperclip} />
                    <img
                      className="h-16 w-24 object-cover rounded cursor-pointer hover:scale-105 transition"
                      src={replyfile}
                      alt="reply"
                      onClick={() => setShowImage(replyfile)}
                    />
                    {replymsg && (
                      <span className="truncate max-w-full">{replymsg}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <FontAwesomeIcon icon={faPaperclip} />
                    <a
                      href={replyfile}
                      className="text-blue-500 underline break-all max-w-full"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {replyfile.split("/").pop()}
                    </a>
                    {replymsg && (
                      <span className="truncate max-w-full">{replymsg}</span>
                    )}
                  </div>
                )
              ) : (
                <span className="break-words">{replymsg}</span>
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
