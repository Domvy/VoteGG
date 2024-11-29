const express = require('express');
const router = express.Router();
const Room = require("../schemas/room");

function chatSocketHandler(io) {
  // Namespace 혹은 Path 설정
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log(`Chat 사용자 연결됨: ${socket.id}`);

    // 여기에 소켓 이벤트 처리 로직을 추가하세요.

    socket.on('disconnect', () => {
      console.log(`사용자 연결 해제됨: ${socket.id}`);
    });
  });
}

module.exports = { router, chatSocketHandler };
