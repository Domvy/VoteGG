// src/components/ChatRoom.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { chatSocket } from '../../utils/socket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function ChatRoom({ yourID }) {
  const { roomID } = useParams();
  const [messages, setMessages] = useState([]);

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
      <h3>현재 방: {roomID}</h3>
      <MessageList messages={messages} yourID={yourID} />
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
}

export default ChatRoom;
