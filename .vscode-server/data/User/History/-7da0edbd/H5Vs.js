const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const chatRouter = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

// // 라우터 설정
// app.use('/chat', chatRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`사용자 연결됨: ${socket.id}`);
  
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

server.listen(3000, () => {
  console.log('서버가 포트 3000에서 실행 중입니다.');
});
