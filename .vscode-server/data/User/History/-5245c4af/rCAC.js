// chat2.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { chatSocket } from './utils/socket';
import JoinRoom from './components/JoinRoom';
import ChatRoom from './components/ChatRoom';

function Chat2() {
  const [yourID, setYourID] = useState('');

  useEffect(() => {
    if (chatSocket) {
      const handleConnect = () => {
        setYourID(chatSocket.id);
      };

      chatSocket.on('connect', handleConnect);

      return () => {
        chatSocket.off('connect', handleConnect);
      };
    }
  }, []);

  return (
    <div>
      <h2>실시간 채팅 애플리케이션</h2>
      <Routes>
        <Route path="/" element={<JoinRoom />} />
        <Route path="/:roomID" element={<ChatRoom yourID={yourID} />} />
      </Routes>
    </div>
  );
}

export default Chat2;