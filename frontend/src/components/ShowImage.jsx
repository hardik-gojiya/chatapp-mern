import React from "react";

function ShowImage({ showImage, setShowImage }) {
  return (
    <div>
      {showImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-transparen bg-opacity-50 backdrop-blur-sm z-[999]"
          onClick={() => setShowImage(null)}
        >
          <div
            className="relative max-w-full max-h-full p-2 sm:p-4 md:p-6"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
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
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowImage;
