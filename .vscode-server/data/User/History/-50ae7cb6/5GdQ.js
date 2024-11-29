// routes/timer.js
const express = require('express');
const router = express.Router();
const rooms = {}; // 방별 타이머 정보를 저장할 객체

function timerSocketHandler(io) {
  // Namespace 혹은 Path 설정
  const timerNamespace = io.of('/timer');

  timerNamespace.on('connection', (socket) => {
    console.log(`타이머 네임스페이스에 새로운 클라이언트 연결: ${socket.id}`);

    // 방에 조인하는 이벤트 처리
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`클라이언트 ${socket.id}가 방 ${roomId}에 참여했습니다.`);

      // 해당 방의 타이머가 없으면 생성
      if (!rooms[roomId]) {
        // 타이머 초기 설정
        rooms[roomId] = {
          duration: 180, // 총 시간 (초)
          startTime: null,
          interval: null,
          timeLeft: 180,
          isRunning: false,
        };
      }

      // 현재 타이머 상태를 클라이언트에게 전송
      socket.emit('timerUpdate', rooms[roomId].timeLeft, rooms[roomId].isRunning);
    });

    // 타이머 시작 이벤트 처리
    socket.on('start_timer', (roomId) => {
      const room = rooms[roomId];
      if (room && !room.isRunning) {
        room.isRunning = true;
        room.startTime = Date.now();

        // 1초마다 타이머 업데이트
        room.interval = setInterval(() => {
          const elapsed = Math.floor((Date.now() - room.startTime) / 1000);
          room.timeLeft = Math.max(room.duration - elapsed, 0);

          // 타이머가 끝나면 인터벌 클리어
          if (room.timeLeft <= 0) {
            clearInterval(room.interval);
            room.interval = null;
            room.isRunning = false;
          }

          // 방에 있는 모든 클라이언트에게 타이머 업데이트 전송
          timerNamespace.to(roomId).emit('timerUpdate', room.timeLeft, room.isRunning);
        }, 1000);
      }
    });

    // 타이머 초기화 이벤트 처리
    socket.on('reset_timer', (roomId) => {
      const room = rooms[roomId];
      if (room) {
        // 타이머 정지
        if (room.interval) {
          clearInterval(room.interval);
          room.interval = null;
        }
        room.timeLeft = room.duration;
        room.isRunning = false;

        // 방에 있는 모든 클라이언트에게 타이머 업데이트 전송
        timerNamespace.to(roomId).emit('timerUpdate', room.timeLeft, room.isRunning);
      }
    });

    // 클라이언트 연결 해제 시 처리
    socket.on('disconnect', () => {
      console.log('클라이언트 연결 해제:', socket.id);

      // 사용자가 속한 방들에 대해 처리
      const roomsJoined = socket.rooms;
      roomsJoined.forEach((roomId) => {
        // 기본 방(ID)이 소켓 ID인 경우 스킵
        if (roomId === socket.id) return;

        // 방에서 나가기
        socket.leave(roomId);

        // 방의 사용자 수 확인
        const room = timerNamespace.adapter.rooms.get(roomId);
        const numUsers = room ? room.size : 0;

        if (numUsers === 0) {
          // 방에 사용자가 없으므로 타이머 정리
          if (rooms[roomId]) {
            if (rooms[roomId].interval) {
              clearInterval(rooms[roomId].interval);
            }
            delete rooms[roomId];
            console.log(`방 ${roomId}의 타이머가 정리되었습니다.`);
          }
        }
      });
    });
  });
}

module.exports = { router, timerSocketHandler };
