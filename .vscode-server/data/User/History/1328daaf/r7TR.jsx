import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './TestChat.css';

const TestChat = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (!roomId) {
      console.error('Room ID가 없습니다.');
      return;
    }

    // 소켓 연결 생성 (네임스페이스 추가)
    const newSocket = io('https://3.38.211.217/chat', {
      path: '/socket.io/', // 서버의 소켓 path
      transports: ['websocket'], // WebSocket 사용
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

  const sendMessage = () => {
    if (message !== '' && socket) {
      const messageData = {
        roomId: roomId,
        author: '사용자 이름', // 사용자 이름 설정
        message: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setMessage('');
    }
  };

  return (
    <div className=
      <div className="chat-header">
        <p>실시간 채팅</p>
      </div>
      <div className="chat-body">
        {messageList.map((msgContent, index) => (
          <div key={index} className={`message ${msgContent.author === '사용자 이름' ? 'you' : 'other'}`}>
            <p>{msgContent.message}</p>
            <span>{msgContent.time} - {msgContent.author}</span>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default TestChat;
