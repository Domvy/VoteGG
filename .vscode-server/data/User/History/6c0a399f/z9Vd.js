const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// 여기부터 추가//////////////////////////////
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // 사용자 모델 추가
///////////////////////////////////////////////
const { router: chatRouter, chatSocketHandler } = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

///////////////////////////
// MongoDB 연결 설정
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('MongoDB 연결 성공');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

//////////////////////////////////////////

// HTTP 라우터 추가
app.use('/chat', chatRouter);
app.use('/login' )
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
