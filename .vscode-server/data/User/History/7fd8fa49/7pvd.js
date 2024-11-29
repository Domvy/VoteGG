// src/components/MessageList.js
import React from 'react';

function MessageList({ messages, yourID }) {
  return (
    <div>
      <h3>메시지:</h3>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.from === yourID ? '나' : msg.from}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}

export default MessageList;
