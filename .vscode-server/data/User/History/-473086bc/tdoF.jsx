import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './DebateRoom.css';
// import TestChat from '../../Elements/TestChat/TestChat.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';
// import Timer from '../../Elements/openvidu/Timer/Timer.jsx';
import UserVideoComponent from '../../Elements/openvidu/UserVideoComponent.js';

const DebateRoom = () => {
  const { roomNumber } = useParams();
  const [leftUsers, setLeftUsers] = useState([]);
  const [rightUsers, setRightUsers] = useState([]);

  const handleUpdateUsers = ({ leftUsers, rightUsers }) => {
    setLeftUsers(leftUsers);
    setRightUsers(rightUsers);
  };

  // 토큰에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  const userId = token ? getUsernameFromToken(token) : "Unknown User";

  return (
    <div className="DebateRoom-room">
      <div className="DebateRoom-left-side">
        {leftUsers.map((user, index) => (
          <UserVideoComponent key={index} streamManager={user.subscriber} />
        ))}
      </div>
      <div className="DebateRoom-right-side">
        {rightUsers.map((user, index) => (
          <UserVideoComponent key={index} streamManager={user.subscriber} />
        ))}
      </div>
      <OpenviduFinal sessionId="roomNumber" userName="User1" onUpdateUsers={handleUpdateUsers} />
    </div>
  );
};

export default DebateRoom;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};
