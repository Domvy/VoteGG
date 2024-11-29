import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom'; // React Router 사용
import './TestChat.css';

const TestChat = () => {
  const { rooomNumber } = useParams(); // URL의 :id 부분 추출
  const roomId = rooomNumber; // roomId로 사용
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      console.error('Room ID가 없습니다.');
      return;
    }

    // 소켓 연결 생성
    const newSocket = io('https://43.203.233.187/chat', {
      path: '/socket.io/',
      transports: ['websocket'],
    });
    setSocket(newSocket);

    // 소켓 이벤트 등록
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('join_room', roomId);
    });

    newSocket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    // 메시지 목록이 업데이트될 때마다 자동 스크롤
    scrollToBottom();
  }, [messageList]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      const messageData = {
        roomId: roomId,
        author: '사용자 이름', // 사용자 이름 설정 (필요시 동적 처리)
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
        <div ref={messagesEndRef} /> {/* 스크롤 끝 참조 요소 */}
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
