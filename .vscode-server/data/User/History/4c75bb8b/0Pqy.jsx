import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const TestChat = () => {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null); // 소켓 상태 관리
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    // 소켓 연결 생성
    const newSocket = io('https://3.38.211.217', {
      path: '/socket.io/',
      transports: ['websocket'],
    });
    setSocket(newSocket);

    // 소켓 이벤트 등록
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      if (roomId) {
        newSocket.emit('join_room', roomId);
      }
    });

    newSocket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    // 컴포넌트 언마운트 시 소켓 해제
    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message !== '' && socket) {
      const messageData = {
        roomId: roomId,
        author: '사용자 이름', // 사용자 정보 추가
        message: message,
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', messageData);
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
