// src/components/Home/Home.jsx

import React, { useState } from 'react';
import RoomList from '../../Elements/RoomList/RoomList.jsx';
import Live from '../../Elements/Live/Live.jsx';
import './Home.css';
import InviteSystem from '../../InviteSystem.jsx';

const Home = () => {
  const currentUserId = 'testUser';

  // 서버와 일치하는 방 정보 형식으로 하드코딩된 데이터
  const [rooms, setRooms] = useState([]);

  return (
    <div className="home">
      <div className="home-content">
        <h1>인기 방송</h1>
        <Live />
        <RoomList rooms={rooms} />
        <InviteSystem />
      </div>
    </div>
  );
};

export default Home;
