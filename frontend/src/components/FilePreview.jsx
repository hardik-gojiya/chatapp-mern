import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function FilePreview({
  selectedFile,
  setSelectedFile,
  setShowImage,
}) {
  return (
    <div>
      {selectedFile && (
        <div className="absolute left-1/2 bottom-20 flex items-center space-x-3 p-2 border rounded-lg bg-gray-100 shadow-sm dark:bg-gray-700 dark:text-white">
          {/\.(jpeg|jpg|png|gif)$/i.test(selectedFile.name) ? (
            <img
              onClick={() => setShowImage(URL.createObjectURL(selectedFile))}
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate max-w-xs">
                {selectedFile.name}
              </span>
              <FontAwesomeIcon icon={faPaperclip} className="text-gray-500" />
            </div>
          )}
          <button
            onClick={() => setSelectedFile(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md hover:bg-red-600 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default FilePreview;
