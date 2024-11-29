const express = require('express');
const router = express.Router();

function chatSocketHandler(io) {
  // Namespace 혹은 Path 설정
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log(`Chat 사용자 연결됨: ${socket.id}`);

    // 방 참가
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`사용자 ${socket.id}가 방 ${roomId}에 참가했습니다.`);
    });

    // 메시지 전송
    socket.on('send_message', (data) => {
      console.log(`방 ${data.roomId}에 메시지 전송: ${data.message}`);
      socket.to(data.roomId).emit('receive_message', data);
    });

    // 연결 해제
    socket.on('disconnect', () => {
      console.log(`사용자 연결 해제됨: ${socket.id}`);
    });
  });
}

module.exports = { router, chatSocketHandler };
