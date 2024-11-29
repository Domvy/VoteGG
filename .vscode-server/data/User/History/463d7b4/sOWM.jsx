import React from 'react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateRoomButton from '../../Elements/Buttons/CreateRoomButton/CreateRoomButton';
import AlarmButton from '../../Elements/Buttons/AlarmButton/AlarmButton';
import LoginButton from '../../Elements/Buttons/LoginoutButton/LoginoutButton';
import LogoButton from '../../Elements/Buttons/LogoButton/LogoButton';
import './Header.css';

const Header = () => {
  const [rooms, setRooms] = useState([]); // 방 목록 상태 관리
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const roomId = (pathParts[1] === 'room' || pathParts[1] === 'observer')
    ? decodeURIComponent(pathParts[2]) : null;

  // 방 목록 API 호출
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/roomList'); // 백엔드 API 호출
        if (!response.ok) {
          throw new Error('Failed to fetch room list');
        }
        const data = await response.json();
        setRooms(data); // 데이터 저장
      } catch (error) {
        setError(error.message);
      }
    };    
    fetchRooms();
    }, []);

  return (
    <header className="header">
      <div className="header-top">
        <LogoButton />
        {roomId ? (
          <div className="room-id-display">Room: {roomId}</div>
        ) : (
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
            <img src="/magnifier.png" alt="Search Icon" className="search-icon" />
          </div>
        )}
        <div className="right">
          <AlarmButton />
          <CreateRoomButton />
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
