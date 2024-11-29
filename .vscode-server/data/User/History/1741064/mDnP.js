import React from 'react';
import MainContent from '../../MainContent/MainContent.jsx';
import ChatWindow from '../../RightSidebar/ChatWindow/ChatWindow.jsx';
import VideoGrid from '../../VideoGrid/VideoGrid.jsx';
import Avatar from '../../Avatar/Avatar.jsx';
import './Room.css';


const Room = ({ roomNumber, role }) => {
  // URL에서 roomId 추출
  const pathParts = window.location.pathname.split('/');
  const roomId = pathParts[1] === 'room' ? pathParts[2] : null;

  const userId = "example_user_id"; // 실제 로그인된 사용자 ID를 여기에 설정

  return (
    <div className="room">
      <div className="top">
        <VideoGrid />
        {roomId && <ChatWindow roomId={roomId} userId={userId} />}
      </div>
      <div className='bottom'>
        <Avatar />
      </div>
    </div>
  );
};

export default Room;
