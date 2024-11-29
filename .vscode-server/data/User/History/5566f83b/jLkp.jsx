import React from 'react';
import './RoomControl.css';
import EndButton from '../Buttons/EndButton/EndButton';
import Timer from '../openvidu/Timer/Timer'


const RoomControl = () => {
  return (
    <div className="roomcontrol">
      <div className='aa'>
        <EndButton />
      </div>
      <div className='bb'>
        <Timer />
      </div>
    </div>
  );
};

export default RoomControl;
