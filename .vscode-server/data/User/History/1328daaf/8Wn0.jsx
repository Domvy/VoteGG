import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './TestChat.css';

const TestChat = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (!roomId) {
      console.error('Room ID가 없습니다.');
      return;
    }

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'quick' });
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
            className={`message ${msgContent.author === '사용자 이름' ? 'you' : 'other'
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
        <div ref={messagesEndRef} /> {/* 스크롤 끝 참조 요소 */}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          placeholder="메시지 입력"
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default TestChat;
