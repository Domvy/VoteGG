const express = require('express');
const router = express.Router();

function inviteSocketHandler(io) {
  const inviteNamespace = io.of('/invite'); // /invite 네임스페이스 사용

  // 사용자 소켓 ID와 사용자 정보를 매핑
  const userSocketMap = {};

  inviteNamespace.on('connection', (socket) => {
    console.log(`Invite 사용자 연결됨: ${socket.id}`);

    // 사용자 등록
    socket.on('register_user', (username) => {
      userSocketMap[username] = socket.id;
      console.log(`사용자 등록됨: ${username} -> ${socket.id}`);
    });

    // 초대 요청
    socket.on('send_invite', (data) => {
      const { sender, recipient, roomId } = data;
      console.log(`초대 요청: ${sender} -> ${recipient}, Room ID: ${roomId}`);

      // 수신자가 등록되어 있는 경우 초대 전송
      const recipientSocketId = userSocketMap[recipient];
      if (recipientSocketId) {
        inviteNamespace.to(recipientSocketId).emit('receive_invite', {
          sender,
          roomId,
        });
        console.log(`초대 전송 완료: ${recipient} (${recipientSocketId})`);
      } else {
        console.log(`수신자 ${recipient}가 연결되지 않았습니다.`);
        socket.emit('invite_error', { message: `사용자 ${recipient}를 찾을 수 없습니다.` });
      }
    });

    // 초대 응답 처리 (수락/거절)
    socket.on('respond_invite', (data) => {
      const { sender, recipient, roomId, response } = data;
      console.log(`초대 응답: ${recipient} -> ${sender}, 응답: ${response}, Room ID: ${roomId}`);

      // 발신자에게 응답 전달
      const senderSocketId = userSocketMap[sender];
      if (senderSocketId) {
        inviteNamespace.to(senderSocketId).emit('invite_response', {
          recipient,
          roomId,
          response,
        });
        console.log(`응답 전송 완료: ${sender} (${senderSocketId})`);
      } else {
        console.log(`발신자 ${sender}가 연결되지 않았습니다.`);
        socket.emit('invite_error', { message: `발신자 ${sender}를 찾을 수 없습니다.` });
      }
    });

    // 연결 해제 처리
    socket.on('disconnect', () => {
      const disconnectedUser = Object.keys(userSocketMap).find(
        (username) => userSocketMap[username] === socket.id
      );
      if (disconnectedUser) {
        delete userSocketMap[disconnectedUser];
        console.log(`사용자 연결 해제됨: ${disconnectedUser}`);
      } else {
        console.log(`알 수 없는 사용자 연결 해제됨: ${socket.id}`);
      }
    });
  });
}

module.exports = { router, inviteSocketHandler };
