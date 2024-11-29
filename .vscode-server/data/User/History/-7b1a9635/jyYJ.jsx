import React from 'react';
import ChatWindow from './ChatWindow/ChatWindow.jsx';
import MicButton from './MicButton/MicButton.jsx';
import FileUpload from './FileUpload/FileUpload.jsx';
import UserList from './UserList/UserList.jsx';
import './RightSidebar.css';

const RightSidebar = () => {
  // URL에서 roomId 추출
  const pathParts = window.location.pathname.split('/');
  const roomId = pathParts[1] === 'room' ? pathParts[2] : null;

  const userId = "example_user_id"; // 실제 로그인된 사용자 ID를 여기에 설정

  return (
    <div className="right-sidebar">
      {/* <UserList /> */}
      {/* roomId가 있을 때만 ChatWindow 렌더링 */}
      {roomId && <ChatWindow roomId={roomId} userId={userId} />}
      {/* <div className="button-container">
        <MicButton />
        <FileUpload />
      </div> */}
    </div>
  );
};

export default RightSidebar;
