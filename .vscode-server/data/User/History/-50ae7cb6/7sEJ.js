const express = require('express');
const router = express.Router();
// const Room = require("../schemas/room");
const userRooms = {}; // 사용자별 방 목록 저장

function timerSocketHandler(io) {
  // Namespace 혹은 Path 설정
  const timerNamespace = io.of('/timer');

  timerNamespace.on('connection', (socket) => {
    console.log(`사용자 연결됨: ${socket.id}`);

  // 방에 조인하는 이벤트 처리
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`클라이언트 ${socket.id}가 방 ${roomId}에 참여했습니다.`);

    // 해당 방의 타이머가 없으면 생성
    if (!rooms[roomId]) {
      // 타이머 초기 설정
      rooms[roomId] = {
        duration: 180, // 총 시간 (초)
        startTime: Date.now(),
        interval: null,
        timeLeft: 180,
      };

      // 1초마다 타이머 업데이트
      rooms[roomId].interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - rooms[roomId].startTime) / 1000);
        rooms[roomId].timeLeft = Math.max(rooms[roomId].duration - elapsed, 0);

        // 타이머가 끝나면 인터벌 클리어
        if (rooms[roomId].timeLeft <= 0) {
          clearInterval(rooms[roomId].interval);
          rooms[roomId].interval = null;
        }

        // 방에 있는 모든 클라이언트에게 타이머 업데이트 전송
        io.to(roomId).emit('timerUpdate', rooms[roomId].timeLeft);
      }, 1000);
    } else {
      // 기존 타이머의 남은 시간을 전송
      const elapsed = Math.floor((Date.now() - rooms[roomId].startTime) / 1000);
      rooms[roomId].timeLeft = Math.max(rooms[roomId].duration - elapsed, 0);

      socket.emit('timerUpdate', rooms[roomId].timeLeft);
    }
  });

  // 클라이언트 연결 해제 시 처리
  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제:', socket.id);
    // 추가로 필요하면 클라이언트의 방 정보를 정리할 수 있습니다.
  });
});
    
    socket.on('disconnect', async () => {
      console.log(`사용자 연결 해제됨: ${socket.id}`);
    });
    
  });
}

module.exports = { router, timerSocketHandler };


