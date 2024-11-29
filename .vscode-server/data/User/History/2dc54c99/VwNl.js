import React, { useState } from 'react';
// import './MessageInput.css';

function MessageInput({ sendMessage }) {
  const [messageInput, setMessageInput] = useState('');

  const handleSend = () => {
    if (messageInput.trim() !== '') {
      sendMessage(messageInput);
      setMessageInput('');
    } else {
      alert('메시지를 입력하세요.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈 방지
      handleSend();
    }
  };

  return (
    <div className="message-input-container">
      <textarea
        className="message-input"
        placeholder="메시지 입력"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={handleKeyPress} // 엔터 키 처리
      />
      <button className="send-button" onClick={handleSend}>
        전송
      </button>
    </div>
  );
}

export default MessageInput;
