import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function FilePreview({ selectedFile, setSelectedFile, setShowImage }) {
  return (
    <div className="relative">
      {selectedFile && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 max-w-[90vw] overflow-hidden">
          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-100 shadow-md dark:bg-gray-800 dark:text-white relative">
            {/* Image Preview */}
            {/\.(jpeg|jpg|png|gif)$/i.test(selectedFile.name) ? (
              <img
                onClick={() => setShowImage(URL.createObjectURL(selectedFile))}
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md cursor-pointer"
              />
            ) : (
              <div className="flex-1 flex items-center space-x-2 truncate max-w-[200px]">
                <FontAwesomeIcon
                  icon={faPaperclip}
                  className="text-gray-500 dark:text-gray-300"
                />
                <span className="text-sm font-medium truncate">
                  {selectedFile.name}
                </span>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilePreview;
