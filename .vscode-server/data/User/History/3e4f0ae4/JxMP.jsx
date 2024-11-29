import React from 'react';
import { useParams } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';

const Room = () => {
  const { roomNumber } = useParams();

  // 토큰에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  console.log(token);
  const userId = token ? getUsernameFromToken(token) : "Unknown User";


  return (
    <div className="room">
      <div className="left-side">
        <OpenviduFinal sessionId={roomNumber} userName={userId} />
        <RoomControl />
      </div>
      <div className='right-side'>
        <TestChat roomId={roomId} />
      </div>
    </div>
  );
};

export default Room;
