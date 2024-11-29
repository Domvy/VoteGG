// src/components/ChatRoom.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { chatSocket, mediaSocket } from '../../utils/socket.js';
import MessageList from './MessageList.js';
import MessageInput from './MessageInput.js';

function ChatRoom({ yourID }) {
  const { roomID } = useParams();
  const [messages, setMessages] = useState([]);


  const navigate = useNavigate();

  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: '토론방 1',
      creator: 'user1',
      memberCount: 5,
      image: '/1.png',
    },
    {
      id: '2',
      name: '토론방 2',
      creator: 'user2',
      memberCount: 8,
      image: '/2.jpg',
    },
    {
      id: '3',
      name: '토론방 3',
      creator: 'user3',
      memberCount: 3,
      image: '/3.jpeg',
    },
    {
      id: '4',
      name: '토론방 4',
      creator: 'user1',
      memberCount: 6,
      image: '/4.png',
    },
    {
      id: '5',
      name: '토론방 5',
      creator: 'user2',
      memberCount: 7,
      image: '/5.png',
    },
    {
      id: '6',
      name: '토론방 6',
      creator: 'user3',
      memberCount: 2,
      image: '/6.jpeg',
    },
    {
      id: '7',
      name: '토론방 7',
      creator: 'user1',
      memberCount: 9,
      image: '/7.jpeg',
    },
    {
      id: '8',
      name: '토론방 8',
      creator: 'user2',
      memberCount: 4,
      image: '/8.jpeg',
    },
    {
      id: '9',
      name: '토론방 9',
      creator: 'user3',
      memberCount: 5,
      image: '/9.jpeg',
    },
  ]);






  useEffect(() => {
    if (chatSocket && roomID) {
      // 방 입장
      chatSocket.emit('join room', roomID);

      // 메시지 수신 이벤트 등록
      const handleReceiveMessage = (data) => {
        setMessages((prev) => [...prev, data]);
      };

      chatSocket.on('receive message', handleReceiveMessage);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 방 나가기
      return () => {
        chatSocket.off('receive message', handleReceiveMessage);
        chatSocket.emit('leave room', roomID); // 필요한 경우 방 나가기 이벤트 추가
      };
    }
  }, [roomID]);

  const sendMessage = (message) => {
    if (chatSocket && message && roomID) {
      chatSocket.emit('send message', {
        message,
        roomID,
      });
    }
  };

  return (
    <div>
      <h3>현재 방: ${room:id}</h3>
      <MessageList messages={messages} yourID={yourID} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}

export default ChatRoom;
