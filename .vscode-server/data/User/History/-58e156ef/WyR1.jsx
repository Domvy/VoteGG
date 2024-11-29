import React from 'react';
import './RoomControl.css';
import Avatar from '../Avatar/Avatar';
import Timer from '../Timer/ChatTimer';

const RoomControl = () => {
  return (
    <div className="roomcontrol">
      <div className='aa'>
        <Avatar />
      </div>
      <div className='bb'>
        <ChatTimer />
      </div>
    </div>
  );
};

export default RoomControl;
