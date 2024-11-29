import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateRoomButton from '../../Elements/Buttons/CreateRoomButton/CreateRoomButton';
import AlarmButton from '../../Elements/Buttons/AlarmButton/AlarmButton';
import LoginButton from '../../Elements/Buttons/LoginoutButton/LoginoutButton';
import LogoButton from '../../Elements/Buttons/LogoButton/LogoButton';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState([]); // 방 목록 상태 관리
  const [error, setError] = useState(null);
  const [currentRoomName, setCurrentRoomName] = useState(null); // 현재 방 이름

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

        // roomId와 일치하는 roomname 찾기
        if (roomId) {
          const matchingRoom = data.find((room) => room.roomNumber === roomId);
          setCurrentRoomName(matchingRoom ? matchingRoom.roomname : null);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRooms();
  }, [roomId]); // roomId가 바뀔 때마다 재실행

  return (
    <header className="header">
      <div className="header-top">
        <LogoButton />
        {roomId ? (
          <div className="room-id-display">
            Room: {currentRoomName || "Room not found"}
          </div>
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
