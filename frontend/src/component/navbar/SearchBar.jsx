import React from "react";
import { X } from "lucide-react";

const SearchBar = ({ onClose }) => {
  return (
    <div className="relative">
      
      <div
        className="ml-2 text-gray-100 hover:text-black
             transition-transform duration-200
             active:-translate-x-1"
      >
        <input
          type="text"
          placeholder="Search..."
          autoFocus
          className="flex-1 outline-none text-sm"
        />

        <button
          onClick={onClose}
          className="ml-2 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
