import React from 'react';
import { useParams } from 'react-router-dom';
import './Observer.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';

const Observer = () => {
  const { roomNumber } = useParams();


  return (
    <div className="room">
      <div className="left-side">
  
      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} />
      </div>
    </div>
  );
};

export default Observer;
