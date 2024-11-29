// 수정된 server.js 파일

import express from 'express';
import http from 'httpolyglot';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // CORS 패키지 추가

// ESM 방식에서 __dirname 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

// 라우트 파일들 불러오기
import userRoutes from './routes/user.js';
import uploadRoutes from './routes/upload.js';
import mediasoupRoutes from './routes/mediasoup.js'; // mediasoup 라우터
import chatRoutes from './routes/chat.js'; // chat 라우터

// Express 앱 생성
const app = express();

// CORS 미들웨어 설정 추가
app.use(cors()); // 모든 도메인에 대해 CORS 허용

// JSON 파싱을 위한 미들웨어 설정
app.use(express.json());

// // HTTPS 인증서 설정
// const options = {
//   key: fs.readFileSync('/home/ubuntu/Project-Agora/server/private.key', 'utf-8'),
//   cert: fs.readFileSync('/home/ubuntu/Project-Agora/server/cert.pem', 'utf-8'),
// };

// HTTPS 서버 생성 및 포트 설정
const port = process.env.PORT || 3000;
const httpServer = http.createServer(options, app);
httpServer.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

// Socket.IO 서버 설정
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 모든 도메인 허용 (필요에 따라 도메인 제한 가능)
    methods: ['GET', 'POST']
  }
});

// Express 서버에서 Socket.IO 클라이언트를 서빙하도록 설정 추가
app.use('/socket.io', express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')));

// Mediasoup 및 Chat 네임스페이스 설정 및 초기화
const mediasoupRouter = mediasoupRoutes(io); // io를 전달하여 mediasoup 네임스페이스를 내부에서 설정하도록 변경
const chatRouter = chatRoutes(io); // 동일하게 io 전달

// Express 라우트 추가
app.use('/mediasoup', mediasoupRouter);
app.use('/chat', chatRouter);
app.use('/user', userRoutes);
app.use('/upload', uploadRoutes);

// 여기서 roomRoutes는 제거되었음을 확인
// app.use('/room', roomRoutes); -> 필요 없음

// Socket.IO 연결 설정 - 공통 네임스페이스가 필요한 경우 사용 가능
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 클라이언트와의 연결 해제 시 처리
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  // 미디어 및 채팅 관련 이벤트 통합 관리
  socket.on('joinRoom', ({ roomName, role }) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName} as ${role}`);

    // 역할에 따라 처리 분기
    if (role === 'participant') {
      socket.emit('message', 'Welcome to the room as a participant!');
    } else if (role === 'debater') {
      socket.emit('message', 'Welcome to the room as a debater! Prepare your media streams.');
    }
  });
});
