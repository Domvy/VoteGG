import React from 'react';
import { useParams } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';

const Room = () => {
  const { roomNumber } = useParams(); // URL에서 :id 추출

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
        <TestChat roomId={roomNumber} />
      </div>
    </div>
  );
};

export default Room;
