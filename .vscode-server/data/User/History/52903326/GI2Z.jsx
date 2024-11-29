import React from 'react';

const MicControl = ({ isMicOn, onMicToggle }) => {
  return (
    <div>
      <button onClick={onMicToggle} style={{ fontSize: '20px', padding: '10px 20px' }}>
        {isMicOn ? "마이크 끄기" : "마이크 켜기"}
      </button>
    </div>
  );
};

export default MicControl;
