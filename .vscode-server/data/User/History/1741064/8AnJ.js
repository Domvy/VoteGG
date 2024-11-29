import React from 'react';
import ChatWindow from '../../RightSidebar/ChatWindow/ChatWindow.jsx';
import VideoGrid from '../../VideoGrid/VideoGrid.jsx';
import Avatar from '../../Avatar/Avatar.jsx';
import './Room.css';
import TestChat from '../../TestChat/TestChat.jsx';


const Room = ({ roomNumber, role }) => {
  // URL에서 roomId 추출
  const pathParts = window.location.pathname.split('/');
  const roomId = pathParts[1] === 'room' ? pathParts[2] : null;

  const userId = "example_user_id"; // 실제 로그인된 사용자 ID를 여기에 설정

  return (
    <div className="room">
      <div className="left">
        <VideoGrid />
        <Avatar />
      </div>
      <TestChat />
    </div>
  );
};

export default Room;
