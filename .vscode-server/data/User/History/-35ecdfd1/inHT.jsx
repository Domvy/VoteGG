import React from 'react';
import VideoGrid from '../VideoGrid/VideoGrid.jsx';
import Avatar from '../Avatar/Avatar.jsx';
import '<div className="" />
<Observer></Observer>.css';
import TestChat from '../TestChat/TestChat.jsx';
import RoomControl from '../RoomControl/RoomControl.jsx'


const Observer = ({ roomNumber, role }) => {
  // URL에서 roomId 추출
  const pathParts = window.location.pathname.split('/');
  const roomId = pathParts[1] === 'room' ? pathParts[2] : null;

  const userId = "example_user_id"; // 실제 로그인된 사용자 ID를 여기에 설정

  return (
    <div className="room">
      <div className="left-side">
        <VideoGrid />
        <RoomControl />
      </div>
      <div className='right-side'>
        <TestChat roomId={roomId} />
      </div>
    </div>
  );
};

export default Observer;
