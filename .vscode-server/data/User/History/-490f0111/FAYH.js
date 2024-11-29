import express from "express";
import Message from "../schemas/chat.js"; // schemas 폴더에서 Message 모델 가져오기

const router = express.Router();

const chatRoutes = (io) => {
  // '/chat' 네임스페이스를 설정합니다.
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log('A user connected to chat namespace:', socket.id);

    // 각 소켓이 가입한 룸 목록을 저장
    const joinedRooms = new Set();

    // 방 입장 처리 및 이전 메시지 전송
    socket.on('join_room', async (room) => {
      if (room && !joinedRooms.has(room)) {
        socket.join(room);
        joinedRooms.add(room);
        console.log(`User ${socket.id} joined room: ${room}`);

        try {
          // 이전 메시지 가져와 전송
          const previousMessages = await Message.find({ room });
          socket.emit('previousMessages', previousMessages);
        } catch (error) {
          console.error('Error fetching previous messages:', error);
        }
      }
    });

    // 방 퇴장 처리
    socket.on('leave_room', (room) => {
      if (room && joinedRooms.has(room)) {
        socket.leave(room);
        joinedRooms.delete(room);
        console.log(`User ${socket.id} left room: ${room}`);
      }
    });

    // 메시지 수신 및 저장
    socket.on('message', async (data) => {
      const { room, message, sender } = data;

      if (room && joinedRooms.has(room)) {
        const newMessage = new Message({ content: message, sender, room });
        try {
          await newMessage.save();
          // 룸의 모든 사용자에게 메시지를 전송합니다.
          chatNamespace.to(room).emit('message', { sender, message });
        } catch (error) {
          console.error('Error saving message:', error);
        }
      }
    });

    // 소켓 연결 종료 처리
    socket.on('disconnect', async () => {
      console.log('User disconnected from chat namespace:', socket.id);

      // 가입한 모든 룸을 확인하면서 0명이 된 룸의 데이터를 삭제
      for (const room of joinedRooms) {
        const roomSize = chatNamespace.adapter.rooms.get(room)?.size || 0;
        if (roomSize === 0) {
          console.log(`Room ${room} has no users left. Deleting messages...`);
          try {
            await Message.deleteMany({ room });
          } catch (error) {
            console.error('Error deleting messages:', error);
          }
        }
      }
    });
  });

  return router;
};

export default chatRoutes;
