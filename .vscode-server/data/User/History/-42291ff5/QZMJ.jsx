import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeftButton = () => {
  const navigate = useNavigate();

  return (

    <div>
      <button onClick={() => navigate(`/room/${room.roomNumber}`)}>왼쪽</button>
      <button onClick={() => navigate(`/room/${room.roomNumber}`)}>오른쪽</button>
    </div>
  )
}

export default LeftButton;