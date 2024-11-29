import React from 'react';
import { useParams } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';

const Room = ({ role }) => {
  const { roomNumber } = useParams(); // URL에서 :id 추출
  const token = localStorage.getItem("token");
  console.log(token);
  const username = token ? getUsernameFromToken(token) : "Unknown User";
  const roomId = roomNumber;


  return (
    <div className="room">
      <div className="left-side">
        <RoomControl />
      </div>
      <div className='right-side'>
        <TestChat roomId={roomId} />
      </div>
    </div>
  );
};

export default Room;


// Utility Function for Token Decoding
const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};