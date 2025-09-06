import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdSearch } from "react-icons/io" // npm install react-icons

function SearchBar({ data }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : '');

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate('/topic/' + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="relative max-w-2xl w-full md:h-12 h-10 flex items-center bg-gray-900 border border-gray-700 rounded-4xl overflow-hidden shadow-sm"
    >
      {/* Input */}
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search Topic"
        className="w-2xl h-full pl-4 pr-10 bg-transparent text-gray-200 placeholder-gray-400 outline-none text-sm md:text-base"
      />

      {/* Search Icon */}
      <button type="submit" className="absolute right-3 text-gray-400 hover:text-red-500 transition">
        <IoMdSearch size={22} />
      </button>
    </form>
  );
}

export default SearchBar;
