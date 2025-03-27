import React, { useState, useEffect, useRef } from "react";

function DropDownDelete({ onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-700 focus:outline-none"
      >
        <svg
          className="w-5 h-5 text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3"
        >
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM8 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 bg-gray-700 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="block px-4 py-2 text-sm text-white hover:bg-red-600 rounded-lg w-full text-left"
          >
            Delete
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="block px-4 py-2 text-sm text-white hover:bg-green-600 rounded-lg w-full text-left"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default DropDownDelete;
