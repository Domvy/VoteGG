import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './TestChat.css';

const TestChat = () => {
  const { id } = useParams(); // URL의 :id 부분 추출
  const roomId = id; // roomId로 사용
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  if (!roomId) {
    console.error('roomId가 올바르게 설정되지 않았습니다!');
    return <div>Invalid Room ID</div>;
  }

  console.log('Extracted Room ID:', roomId);

  useEffect(() => {
    const newSocket = io('https://3.38.211.217/chat', {
      path: '/socket.io/',
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        roomId: roomId,
        author: '사용자 이름',
        message: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>실시간 채팅</p>
      </div>
      <div className="chat-body">
        {messageList.map((msgContent, index) => (
          <div
            key={index}
            className={`message ${
              msgContent.author === '사용자 이름' ? 'you' : 'other'
            }`}
          >
            <div className="message-avatar"></div>
            <div>
              <div className="message-content">{msgContent.message}</div>
              <div className="message-meta">
                {msgContent.time} - {msgContent.author}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-footer">
        <div className="input-wrapper">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
            placeholder="채팅 입력"
          />
          <button className="room-send-button" onClick={sendMessage}>
            <img src="/send.png" alt="Send" className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestChat;
