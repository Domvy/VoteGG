import React from 'react';
import './MessageList.css';

function MessageList({ messages, yourID }) {
  return (
    <div className="message-list">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message-item ${
            msg.from === yourID ? 'my-message' : 'other-message'
          }`}
        >
          <span className="message-sender">
            {msg.from === yourID ? '나' : msg.from}:
          </span>
          <span className="message-content">{msg.message}</span>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
