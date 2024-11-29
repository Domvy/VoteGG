import React, { useState } from 'react';
import './TestChat.css';

const TestChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return; // 빈 메시지 방지
    setMessages([...messages, input]); // 메시지 추가
    setInput(''); // 입력 필드 초기화
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(); // Enter 키로 메시지 전송
    }
  };

  return (
    <div className="test-chat-container">
      <div className="test-chat-header">
        <h3>Test Chat</h3>
      </div>
      <div className="test-chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="test-chat-message">
            {msg}
          </div>
        ))}
      </div>
      <div className="test-chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default TestChat;
