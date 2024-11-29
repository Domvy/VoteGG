// src/components/JoinRoom.jsx
import React, { useState } from 'react'; // useState 추가
import { useNavigate } from 'react-router-dom';

function JoinRoom() {
  const navigate = useNavigate();

  // 방 정보 초기화
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: '토론방 1',
      creator: 'user1',
      memberCount: 5,
      image: '/1.png',
    },
    {
      id: 2,
      name: '토론방 2',
      creator: 'user2',
      memberCount: 8,
      image: '/2.jpg',
    },
    {
      id: 3,
      name: '토론방 3',
      creator: 'user3',
      memberCount: 3,
      image: '/3.jpeg',
    },
    {
      id: 4,
      name: '토론방 4',
      creator: 'user1',
      memberCount: 6,
      image: '/4.png',
    },
    {
      id: 5,
      name: '토론방 5',
      creator: 'user2',
      memberCount: 7,
      image: '/5.png',
    },
    {
      id: 6,
      name: '토론방 6',
      creator: 'user3',
      memberCount: 2,
      image: '/6.jpeg',
    },
    {
      id: 7,
      name: '토론방 7',
      creator: 'user1',
      memberCount: 9,
      image: '/7.jpeg',
    },
    {
      id: 8,
      name: '토론방 8',
      creator: 'user2',
      memberCount: 4,
      image: '/8.jpeg',
    },
    {
      id: 9,
      name: '토론방 9',
      creator: 'user3',
      memberCount: 5,
      image: '/9.jpeg',
    },
  ]);

  const handleJoin = (roomID) => {
    navigate(`/room/${roomID}`); // Room 경로로 이동
  };

  return (
    <div>
      <h3>채팅 방 선택</h3>
      {/* 방 리스트 렌더링 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => handleJoin(room.id)}
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {room.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default JoinRoom;
