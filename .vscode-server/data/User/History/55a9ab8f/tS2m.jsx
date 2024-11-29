import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomLinksModal from '../RoomLinksModal/RoomLinksModal';\
import JoinRoom from './ChatRoom/JoinRoom.js';

import './RoomList.css';

const RoomList = ({ userIds }) => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: '토론방 1',
      creator: 'user1',
      memberCount: 5,
      image: '/1.png',
    },
    {
      id: '2',
      name: '토론방 2',
      creator: 'user2',
      memberCount: 8,
      image: '/2.jpg',
    },
    {
      id: '3',
      name: '토론방 3',
      creator: 'user3',
      memberCount: 3,
      image: '/3.jpeg',
    },
    {
      id: '4',
      name: '토론방 4',
      creator: 'user1',
      memberCount: 6,
      image: '/4.png',
    },
    {
      id: '5',
      name: '토론방 5',
      creator: 'user2',
      memberCount: 7,
      image: '/5.png',
    },
    {
      id: '6',
      name: '토론방 6',
      creator: 'user3',
      memberCount: 2,
      image: '/6.jpeg',
    },
    {
      id: '7',
      name: '토론방 7',
      creator: 'user1',
      memberCount: 9,
      image: '/7.jpeg',
    },
    {
      id: '8',
      name: '토론방 8',
      creator: 'user2',
      memberCount: 4,
      image: '/8.jpeg',
    },
    {
      id: '9',
      name: '토론방 9',
      creator: 'user3',
      memberCount: 5,
      image: '/9.jpeg',
    },
  ]);

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h1 className="room-list-title">LIVE 토론</h1>
      </div>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div className="room-image">
              <img src={room.image} alt={`${room.name} 이미지`} />
            </div>
            <div className="room-details">
              <h2 className="room-name">{room.name}</h2>
              <div className="room-info">
                <p className="room-creator">생성자: {room.creator}</p>
                <p className="room-member-count">
                  현재 인원: {room.memberCount}명
                </p>
              </div>
              <div className="room-buttons">
                <button
                  className="room-spectate-button"
                  onClick={() => navigate(`/observer/${room.id}`)}
                >
                  참관하기
                </button>
                <button
                  className="room-discuss-button"
                  onClick={() => navigate(`/room/${room.id}`)}
                >
                  토론하기
                </button>
                <JoinRoom />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
