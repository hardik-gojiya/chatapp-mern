import React, { useState, useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

function DropDownDelete({
  onDelete,
  onEdit,
  onReply,
  isEditdeletemenu,
  isreplymenu,
}) {
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
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-700 focus:outline-none"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>
      {isOpen && (
        <div
          className={`absolute ${
            isEditdeletemenu ? "right-0" : "left-0"
          }  mt-2 w-24 bg-gray-700 rounded-lg shadow-lg z-10`}
        >
          {isEditdeletemenu && (
            <div>
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
                  onEdit();
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-white hover:bg-green-600 rounded-lg w-full text-left"
              >
                Edit
              </button>
            </div>
          )}
          {isreplymenu && (
            <button
              onClick={() => {
                onReply();
                setIsOpen(false);
              }}
              className="block px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-lg w-full text-left"
            >
              reply
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DropDownDelete;
