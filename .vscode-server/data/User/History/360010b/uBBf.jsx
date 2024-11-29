import React from 'react';
import VideoGrid from '../VideoGrid/VideoGrid.jsx';
import './Observer.css';
import TestChat from '../TestChat/TestChat.jsx';

const Observer = ({ roomNumber, role }) => {
  // URL에서 roomId 추출
  const pathParts = window.location.pathname.split('/');
  const roomId = pathParts[1] === 'room' ? pathParts[2] : null;

  const userId = "example_user_id"; // 실제 로그인된 사용자 ID를 여기에 설정

  return (
    <div className="room">
      <div className="left-side">
        <VideoGrid />
        <h1>관전자 페이지입니다</h1>
        {/* <RoomControl /> */}
      </div>
      <div className='right-side'>
      <Route path="/observer/:id" element={<TestChat />} />
      </div>
    </div>
  );
};

export default Observer;
