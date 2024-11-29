import React from 'react';
import { useParams } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';
import InviteButton from '../../Elements/Buttons/InviteButton/InviteButton.jsx';

const socket = io('http://localhost:3000'); // 소켓 서버 주소

const Room = () => {
  const { roomNumber } = useParams();

  // 토큰에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  console.log(token);
  const userId = token ? getUsernameFromToken(token) : "Unknown User";

  const roomUrl = `${window.location.origin}/room/${roomNumber}`; // 현재 방 URL

  const handleInvite = (inviteId) => {
    socket.emit('sendInvite', { inviteId, roomUrl });
    alert(`ID: ${inviteId}에게 초대 링크가 전송되었습니다!`);
  };


  return (
    <div className="room">
      <div className="left-side">
        <OpenviduFinal sessionId={roomNumber} userName={userId} />
        <RoomControl />
        <InviteButton roomUrl={roomUrl} onInvite={handleInvite} />
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