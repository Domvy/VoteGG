import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeftButton = () => {
  const navigate = useNavigate();

  return (

    <div>
      <button onClick={() => navigate(`/room/${room.roomNumber}`)}></button>
      <button onClick={() => navigate(`/room/${room.roomNumber}`)}></button>
    </div>
  )
}

export default LeftButton;