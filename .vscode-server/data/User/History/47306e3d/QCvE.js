// src/components/MessageInput.js
import React, { useState } from 'react';

function MessageInput({ sendMessage }) {
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (messageInput.trim() !== '') {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div>
      <textarea
        placeholder="메시지 입력"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <br />
      <button onClick={handleSend}>전송</button>
    </div>
  );
}

export default MessageInput;
