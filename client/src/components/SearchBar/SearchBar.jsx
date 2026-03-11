import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdSearch } from "react-icons/io"

function SearchBar({ data }) {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ?? '');
  const [focused, setFocused] = useState(false);

  const onSearchHandler = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate('/topic/' + input.trim());
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="searchbar"
      style={{ height: '42px', width: '100%' }}
    >
      <input
        onChange={e => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search topics…"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Search topics"
      />
      <button type="submit" className="search-btn" aria-label="Submit search">
        <IoMdSearch size={20} />
      </button>
    </form>
  );
}

export default SearchBar;
