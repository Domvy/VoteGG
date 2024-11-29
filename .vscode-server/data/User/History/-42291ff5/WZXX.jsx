import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeftButton = ({ roomNumber }) => { // roomNumber를 props로 전달받음
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(`/room/${roomNumber}`)}>왼쪽</button>
      <button onClick={() => navigate(`/observer/${roomNumber}`)}>오른쪽</button>
    </div>
  );
};

export default LeftButton;