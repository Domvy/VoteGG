// src/components/JoinRoom.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
  const navigate = useNavigate();

  const handleJoin = (roomID) => {
    navigate(`/${roomID}`);
  };

  return (
    <div>
      {rooms.map((room) => (
        <button key={room.id} onClick={() => handleJoin(room.id)}>
          {room.name}
        </button>
      ))}
    </div>
  );
}

export default JoinRoom;
