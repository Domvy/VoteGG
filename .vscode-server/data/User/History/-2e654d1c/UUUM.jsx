// src/components/Home/Home.jsx

import React, { useState } from 'react';
import RoomList from '../../RoomList/RoomList.jsx';
import VideoChat from '../../VideoChat/VideoChat.jsx'; // VideoChat 컴포넌트 import
import Live from '../../Live/Live.jsx';
import './Home.css';

const Home = () => {
  const currentUserId = 'testUser';

  // 서버와 일치하는 방 정보 형식으로 하드코딩된 데이터
  const [rooms, setRooms] = useState([
    {
      roomNumber: 1,
      name: '토론방 1',
      createdBy: 'user1',
      participants: [
        { userId: 'user1', username: 'User1' },
        { userId: 'user2', username: 'User2' },
      ],
    },
    {
      roomNumber: 2,
      name: '토론방 2',
      createdBy: 'user2',
      participants: [
        { userId: 'user3', username: 'User3' },
        { userId: 'user4', username: 'User4' },
      ],
    },
    {
      roomNumber: 3,
      name: '토론방 3',
      createdBy: 'user3',
      participants: [
        { userId: 'user5', username: 'User5' },
        { userId: 'user6', username: 'User6' },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 방 생성 함수
  const createRoom = (title) => {
    const newRoom = {
      roomNumber: rooms.length + 1,
      name: title,
      createdBy: currentUserId,
      participants: [{ userId: currentUserId, username: currentUserId }],
    };
    setRooms([...rooms, newRoom]);
  };

  return (
    <div className="home">
      <div className="home-content">
        <h1>인기 방송</h1>
        <Live />
        <RoomList rooms={rooms} />
        {/* 비디오 컴포넌트 추가 */}
        <div className="video-chat-container">
          <h2>참여자 비디오</h2>
          <VideoChat roomNumber={1} role="participant" />

          <h2>관전자 비디오</h2>
          <VideoChat roomNumber={1} role="observer" />
        </div>
      </div>
    </div>
  );
};

export default Home;
