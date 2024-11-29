// client/src/socket.js
import { io } from 'socket.io-client';

// 채팅 소켓 연결
export const chatSocket = io('https://43.202.44.182/chat');

// 미디어 소켓 연결
export const mediaSocket = io('/mediasoup');
