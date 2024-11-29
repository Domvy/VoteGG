import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeftButton = ({ roomNumber, onLeftClick }) => {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => {
          
          onLeftClick();
          navigate(`/room/${roomNumber}`);
        }}
      >
        왼쪽
      </button>
      <button onClick={() => navigate(`/room/${roomNumber}`)}>오른쪽</button>
    </div>
  )
}

export default LeftButton;