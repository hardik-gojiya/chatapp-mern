import React from "react";

function ShowImage({ showImage, setShowImage }) {
  return (
    <div>
      {showImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-md bg-opacity-75 z-50"
          onClick={() => setShowImage(null)}
        >
          <img
            src={showImage}
            alt="Preview"
            className="max-w-xl max-h-full rounded-lg shadow-lg"
          />
          <button
            onClick={() => setShowImage(null)}
            className="absolute top-2 right-4 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md hover:bg-red-600 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ShowImage;
