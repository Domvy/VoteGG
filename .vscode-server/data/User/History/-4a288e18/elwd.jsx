import React from 'react';
import { useParams } from 'react-router-dom';
import './Observer.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';

const Observer = () => {
  const { roomNumber } = useParams();
  const userId = `user_${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="room">
      <div className="left-side">
        <OpenviduFinal sessionId={roomNumber} userName={userId} />
      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} />
      </div>
    </div>
  );
};

export default Observer;


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