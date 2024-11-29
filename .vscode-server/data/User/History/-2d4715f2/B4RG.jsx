import React from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const roomId = (pathParts[1] === 'room' || pathParts[1] === 'observer')
    ? decodeURIComponent(pathParts[2]) : null;

  return (
    <>
      {
        roomId ? (
          <div className="room-id-display" > Room: {roomId}</div>
        ) : (
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <img src="/magnifier.png" alt="Search Icon" className="search-icon" />
          </div>
        )}
    </>
  );
};

export default Search;

