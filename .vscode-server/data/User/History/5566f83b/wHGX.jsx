import React from 'react';
import './RoomControl.css';
import endButton from '../Buttons/endButton/endButton';
// import ChatTimer from '../Timer/Timer';

const RoomControl = () => {
  return (
    <div className="roomcontrol">
      <div className='aa'>
        <endButton />
      </div>
      <div className='bb'>
        {/* <ChatTimer /> */}
      </div>
    </div>
  );
};

export default RoomControl;
