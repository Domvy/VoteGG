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
const Loginrouter = require('./routes/login');
const app = express();
app.use(cors());
app.use(express.json());


///////////////////////////

// MongoDB 연결
const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 10000, // 서버 선택 타임아웃 10초
  socketTimeoutMS: 45000, // 소켓 타임아웃 45초
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB Cluster');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

//////////////////////////////////////////

// HTTP 라우터 추가
app.use('/chat', chatRouter);
app.use('/login', router);
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
