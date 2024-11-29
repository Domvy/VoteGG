const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { router: chatRouter, chatSocketHandler } = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

// HTTP 라우터 추가
app.use('/chat', chatRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// 소켓 핸들러 추가
chatSocketHandler(io);

server.listen(3000, () => {
  console.log('서버가 포트 3000에서 실행 중입니다.');
});
