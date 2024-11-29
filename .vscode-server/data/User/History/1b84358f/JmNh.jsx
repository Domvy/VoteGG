import React, { useState } from 'react';
import './CreateRoomButton.css';

const CreateRoomButton = ({ onCreateRoom, currentUserId }) => {

  return (
    <div className="create-room-container">
      <button className="create-room-button">
        {/* 이모티콘 추가 */}
        <img
          src="/11.png" // PNG 파일 경로
          alt="Create Room"
          className="create-room-icon"
        />
      </button>
    </div>
  );
};

export default CreateRoomButton;
