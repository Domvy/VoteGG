// routes/timer.js
const express = require('express');
const router = express.Router();
const rooms = {}; // 방별 타이머 정보를 저장할 객체

function timerSocketHandler(io) {
  const timerNamespace = io.of('/timer');

  timerNamespace.on('connection', (socket) => {
    console.log(`타이머 네임스페이스에 새로운 클라이언트 연결: ${socket.id}`);

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`클라이언트 ${socket.id}가 방 ${roomId}에 참여했습니다.`);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          durations: [180, 20], // 3분과 20초
          cycleCount: 4, // 총 4번 반복
          currentCycle: 0,
          currentIndex: 0,
          startTime: null,
          interval: null,
          timeLeft: null,
          isRunning: false,
        };
      }

      const room = rooms[roomId];

      // timeLeft 계산
      if (room.isRunning && room.startTime) {
        const currentDuration = room.durations[room.currentIndex];
        const elapsed = Math.floor((Date.now() - room.startTime) / 1000);
        room.timeLeft = Math.max(currentDuration - elapsed, 0);
      } else if (room.timeLeft === null || typeof room.timeLeft !== 'number') {
        room.timeLeft = room.durations[room.currentIndex];
      }

      socket.emit('timerUpdate', {
        timeLeft: room.timeLeft,
        isRunning: room.isRunning,
        currentCycle: room.currentCycle,
        totalCycles: room.cycleCount,
      });
    });

    socket.on('start_timer', (roomId) => {
      const room = rooms[roomId];
      if (room && !room.isRunning && room.currentCycle < room.cycleCount) {
        room.isRunning = true;
        startTimer(roomId);
      }
    });

    socket.on('reset_timer', (roomId) => {
      const room = rooms[roomId];
      if (room) {
        if (room.interval) {
          clearInterval(room.interval);
          room.interval = null;
        }
        room.timeLeft = room.durations[0];
        room.currentIndex = 0;
        room.currentCycle = 0;
        room.isRunning = false;
        room.startTime = null;

        timerNamespace.to(roomId).emit('timerUpdate', {
          timeLeft: room.timeLeft,
          isRunning: room.isRunning,
          currentCycle: room.currentCycle,
          totalCycles: room.cycleCount,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('클라이언트 연결 해제:', socket.id);

      const roomsJoined = socket.rooms;
      roomsJoined.forEach((roomId) => {
        if (roomId === socket.id) return;

        socket.leave(roomId);

        const room = timerNamespace.adapter.rooms.get(roomId);
        const numUsers = room ? room.size : 0;

        if (numUsers === 0) {
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

  function startTimer(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    room.startTime = Date.now();
    const currentDuration = room.durations[room.currentIndex];
    room.timeLeft = currentDuration;

    // 타이머 시작 시 즉시 업데이트 전송
    timerNamespace.to(roomId).emit('timerUpdate', {
      timeLeft: room.timeLeft,
      isRunning: room.isRunning,
      currentCycle: room.currentCycle,
      totalCycles: room.cycleCount,
    });

    room.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - room.startTime) / 1000);
      room.timeLeft = Math.max(currentDuration - elapsed, 0);

      // 타이머 업데이트 전송
      timerNamespace.to(roomId).emit('timerUpdate', {
        timeLeft: room.timeLeft,
        isRunning: room.isRunning,
        currentCycle: room.currentCycle,
        totalCycles: room.cycleCount,
      });

      if (room.timeLeft <= 0) {
        clearInterval(room.interval);
        room.interval = null;
        room.isRunning = false;

        room.currentIndex++;

        if (room.currentIndex >= room.durations.length) {
          room.currentIndex = 0;
          room.currentCycle++;

          if (room.currentCycle >= room.cycleCount) {
            timerNamespace.to(roomId).emit('timerFinished');
            return;
          }
        }

        room.isRunning = true;
        startTimer(roomId);
      }
    }, 1000);
  }
}

module.exports = { router, timerSocketHandler };
