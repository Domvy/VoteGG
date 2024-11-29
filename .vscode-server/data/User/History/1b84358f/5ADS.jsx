import React, { useState } from 'react';
import './CreateRoomButton.css';

const CreateRoomButton = ({ onCreateRoom, currentUserId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateRoom = (title) => {
    const newRoom = {
      id: Date.now().toString(),
      name: title,
      creator: currentUserId,
      memberCount: 1,
    };
    onCreateRoom(newRoom);
    closeModal();
  };

  return (
    <div className="create-room-container">
      <button onClick={openModal} className="create-room-button">
        {/* 이모티콘 추가 */}
        <img
          src="/11.png" // PNG 파일 경로
          alt="Create Room"
          className="create-room-icon"
        />
      </button>
      {isModalOpen && (
        <RoomModal onClose={closeModal} onCreateRoom={handleCreateRoom} />
      )}
    </div>
  );
};

export default CreateRoomButton;
