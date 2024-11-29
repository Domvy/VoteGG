// src/components/RoomLinksModal/RoomLinksModal.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './RoomModal.css';

const RoomLinksModal = ({ room, onClose }) => {
  if (!room || !room.id) {
    console.error('Room or room.id is invalid:', room);
    return null;
  }

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
