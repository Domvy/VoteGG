// src/components/JoinRoom.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
  const navigate = useNavigate();

  // 방 목록 또는 방 번호를 지정합니다.
  const rooms = [
    { name: '방 1', id: 'room1' },
    { name: '방 2', id: 'room2' },
    { name: '방 3', id: 'room3' },
  ];

  const handleJoin = (roomID) => {
    navigate(`/${roomID}`);
  };

  return (
    <div>
      <h3>채팅 방 선택</h3>
      {rooms.map((room) => (
        <button key={room.id} onClick={() => handleJoin(room.id)}>
          {room.name}
        </button>
      ))}
    </div>
  );
}

export default JoinRoom;
