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