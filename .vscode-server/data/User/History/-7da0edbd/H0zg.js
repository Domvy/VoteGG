// server.js
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
mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 10000, // 서버 선택 타임아웃 10초
    socketTimeoutMS: 45000, // 소켓 타임아웃 45초
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
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

// Express 앱 생성
const app = express();

// CORS 미들웨어 설정 추가
app.use(cors()); // 모든 도메인에 대해 CORS 허용

// JSON 파싱을 위한 미들웨어 설정
app.use(express.json());

// HTTPS 서버 생성 및 포트 설정
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

// Socket.IO 서버 설정
const io = new Server(httpServer, {
  cors: {
    origin: '*', // 모든 도메인 허용 (필요에 따라 도메인 제한 가능)
    methods: ['GET', 'POST'],
  },
});

// Express 서버에서 Socket.IO 클라이언트를 서빙하도록 설정 추가
app.use(
  '/socket.io',
  express.static(path.join(__dirname, 'node_modules/socket.io/client-dist'))
);

// Socket.IO 네임스페이스 초기화
import initializeChatNamespace from './routes/chat.js';
import initializeMediasoupNamespace from './routes/mediasoup.js';
import initializeSocketHandlers from './routes/socketHandlers.js';

// 각 네임스페이스 초기화 함수 호출
initializeChatNamespace(io);
initializeMediasoupNamespace(io);
initializeSocketHandlers(io); // 공통 네임스페이스 이벤트 핸들러

// Express 라우트 추가
app.use('/user', userRoutes);
app.use('/upload', uploadRoutes);

// 필요하지 않은 라우트는 제거
// app.use('/room', roomRoutes); // 필요 없으면 제거
