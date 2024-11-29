// src/components/RightSidebar/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { chatSocket as socket } from '../../../utils/socket.js';
import './ChatWindow.css';

const ChatWindow = ({ roomId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // 스크롤을 메시지 리스트의 끝으로 자동 이동
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 소켓 이벤트 핸들러 설정
  useEffect(() => {
    if (roomId) {
      console.log("Joining chat room:", roomId);
      socket.emit('join_room', roomId);

      const handlePreviousMessages = (previousMessages) => {
        console.log("Received previous messages:", previousMessages);
        setMessages(previousMessages.map(msg => ({ sender: msg.sender, content: msg.content })));
        scrollToBottom();
      };

      const handleMessage = (data) => {
        console.log("New message received:", data);
        setMessages(prevMessages => [...prevMessages, { sender: data.sender, content: data.message }]);
        scrollToBottom();
      };

      socket.on('previousMessages', handlePreviousMessages);
      socket.on('message', handleMessage);

      return () => {
        socket.emit('leave_room', roomId);
        socket.off('previousMessages', handlePreviousMessages);
        socket.off('message', handleMessage);
      };
    }
  }, [roomId]);

  // 메시지 전송 로직
  const handleSend = () => {
    const trimmedInput = input.trim();

    if (trimmedInput && roomId && userId) {
      const messageData = { room: roomId, message: trimmedInput, sender: userId };
      console.log("Sending message:", messageData);
      setMessages((prevMessages) => [...prevMessages, { sender: userId, content: trimmedInput }]);
      socket.emit('message', messageData);
      setInput('');
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === userId ? 'my-message' : 'other-message'}`}>
            <strong>{msg.sender}: </strong>{msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {input && !input.trim() && <p style={{ color: 'red' }}>Enter a valid message.</p>}
    </div>
  );
};

export default ChatWindow;