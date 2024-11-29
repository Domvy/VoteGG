// src/components/RoomLinksModal/RoomLinksModal.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './RoomModal.css';

const RoomLinksModal = ({ room, onClose }) => {
  if (!room || !room.id) {
    console.error('Room or room.id is invalid:', room);
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{room.name}</h2>
        <ul>
          <li key={`${room.id}-participant`}>
            <Link to={`/room/${room.id}`} onClick={onClose}>
              참여하기
            </Link>
          </li>
          <li key={`${room.id}-observer`}>
            <Link to={`/observer/${room.id}`} onClick={onClose}>
              관전하기
            </Link>
          </li>
        </ul>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default RoomLinksModal;
