import React from 'react'
import { X } from "lucide-react";

const SearchBar = ({onClose}) => {
  return (
    <div>
      <div>
        <input type="text" placeholder='Search...' autoFocus />
        <button onClick={onClose}><X size={20} /></button>
      </div>
    </div>
  )
}

export default SearchBar