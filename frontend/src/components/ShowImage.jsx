import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useToast } from "../context/ToastContext";

function ShowImage({ showImage, setShowImage }) {
  const { showError } = useToast();
  const handleDownloadImage = async () => {
    try {
      const response = await fetch(showImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "chat-image.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showError("Failed to download image", err);
    }
  };

  return (
    <div>
      {showImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparen bg-opacity-50 backdrop-blur-sm z-[999]"
          onClick={() => setShowImage(null)}
        >
          <div
            className="relative max-w-full max-h-full p-2 sm:p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={showImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] sm:max-w-[80vw] md:max-w-[60vw] lg:max-w-[50vw] object-contain rounded-lg shadow-xl"
            />

            <button
              onClick={() => setShowImage(null)}
              className="fixed top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md hover:bg-red-600 transition"
            >
              ✕
            </button>
            <button
              onClick={handleDownloadImage}
              className="fixed top-10 right-2 mt-4 sm:top-4 sm:right-4 bg-gray-500  text-white rounded-full h-8 w-8 flex items-center justify-center shadow-md hover:bg-red-600 transition"
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowImage;
