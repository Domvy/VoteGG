// src/components/TestChat/TestChat.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import './TestChat.css';

const TestChat = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // Socket.io 클라이언트 연결 (Nginx를 통해 프록시)
  const socket = io('/', {
    path: '/socket.io/',
    transports: ['websocket'],
  });

  useEffect(() => {
    // 연결 성공 시
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('join_room', roomId);
    });

    // 연결 에러 시
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // 메시지 수신
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    // 컴포넌트 언마운트 시 소켓 해제
    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [roomId, socket]);

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        roomId: roomId,
        author: '사용자 이름', // 실제 사용자 이름 또는 ID로 대체
        message: message,
        time: new Date().toLocaleTimeString(),
      };

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage('');
    }
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
            className="message"
            id={msgContent.author === '사용자 이름' ? 'you' : 'other'}
          >
            <div>
              <div className="message-content">
                <p>{msgContent.message}</p>
              </div>
              <div className="message-meta">
                <p id="time">{msgContent.time}</p>
                <p id="author">{msgContent.author}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          placeholder="메시지를 입력하세요..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default TestChat;
