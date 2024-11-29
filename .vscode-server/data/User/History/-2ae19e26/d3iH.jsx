import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000/invite'); // /invite 네임스페이스 연결

const InviteSystem = () => {
  const [username, setUsername] = useState('');
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    // 사용자 등록
    if (username) {
      socket.emit('register_user', username);
    }

    // 초대 수신
    socket.on('receive_invite', (data) => {
      setInvites((prev) => [...prev, data]);
    });

    // 초대 응답 수신
    socket.on('invite_response', (data) => {
      console.log('초대 응답:', data);
    });

    return () => {
      socket.off('receive_invite');
      socket.off('invite_response');
    };
  }, [username]);

  const sendInvite = (recipient, roomId) => {
    socket.emit('send_invite', { sender: username, recipient, roomId });
  };

  return (
    <div>
      <h1>실시간 초대 시스템</h1>
      <input
        type="text"
        placeholder="Your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={() => sendInvite('recipientUser', 'room123')}>초대 보내기</button>
      <div>
        <h2>Received Invites:</h2>
        {invites.map((invite, index) => (
          <p key={index}>
            {invite.sender}님이 {invite.roomId}로 초대했습니다.
          </p>
        ))}
      </div>
    </div>
  );
};

export default InviteSystem;
