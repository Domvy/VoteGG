import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';

const Room = () => {
  const { roomNumber } = useParams();

  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteId, setInviteId] = useState("");

  const token = localStorage.getItem("token");
  const userId = token ? getUsernameFromToken(token) : "Unknown User";

  // 초대 팝업 열기
  const openInvitePopup = () => {
    setShowInvitePopup(true);
  };

  // 초대 팝업 닫기
  const closeInvitePopup = () => {
    setShowInvitePopup(false);
    setInviteId(""); // 입력 초기화
  };

  // 초대 전송
  const sendInvite = () => {
    const inviteLink = `${window.location.href}`;
    console.log(`초대 전송: ${inviteId}, 링크: ${inviteLink}`);
    alert(`ID: ${inviteId}에게 초대 링크가 전송되었습니다!`);
    closeInvitePopup();
  };


  return (
    <div className="room">
      <div className="left-side">
        <OpenviduFinal sessionId={roomNumber} userName={userId} />
        <RoomControl />
      </div>
      <div className='right-side'>
        <TestChat roomId={roomNumber} />
      </div>
    </div>
  );
};

export default Room;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};