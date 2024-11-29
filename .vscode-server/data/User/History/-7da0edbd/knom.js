// server/index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // CORS 허용

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // 모든 도메인에서의 요청 허용 (개발용)
  },
});

// 채팅 네임스페이스 설정
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
  console.log(`채팅 네임스페이스에 새로운 클라이언트 접속: ${socket.id}`);

  socket.on('join room', (roomID) => {
    socket.join(roomID);
    console.log(`클라이언트 ${socket.id}가 채팅 방 ${roomID}에 입장했습니다.`);
  });

  socket.on('send message', ({ message, roomID }) => {
    chatNamespace.to(roomID).emit('receive message', {
      message,
      from: socket.id,
    });
  });

  socket.on('disconnect', () => {
    console.log(`클라이언트 접속 해제: ${socket.id}`);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
