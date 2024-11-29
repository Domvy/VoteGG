const express = require('express');
const router = express.Router();
const Room = require("../schemas/room");
const userRooms = {}; // 사용자별 방 목록 저장

function chatSocketHandler(io) {
  // Namespace 혹은 Path 설정
  const chatNamespace = io.of('/chat');

  chatNamespace.on('connection', (socket) => {
    console.log(`Chat 사용자 연결됨: ${socket.id}`);

    // 사용자별 고유 ID 등록
    socket.on('register_user', (userId) => {
      socket.userId = userId; // 소켓에 사용자 ID 연결
      console.log(`사용자 ${userId}가 소켓 ${socket.id}에 등록되었습니다.`);
    });

    // 방 참가
    socket.on('join_room', async (roomId) => {
      try {
        socket.join(roomId);

        // 사용자별 방 목록 저장
        if (!userRooms[socket.id]) {
          userRooms[socket.id] = new Set();
        }
        userRooms[socket.id].add(roomId);

        console.log(`사용자 ${socket.id}가 방 ${roomId}에 참가했습니다.`);
        await Room.findOneAndUpdate(
          { roomNumber: roomId },
          { $inc: { memberCount: 1 } },
          { new: true }
        );
        console.log(`방 ${roomId}의 memberCount가 증가했습니다.`);
      } catch (error) {
        console.error(`방 참가 중 에러 발생: ${error.message}`);
      }
    });

    // 초대 메시지 전송
    socket.on('send_invite', (data) => {
      const { inviteId, roomId, roomUrl } = data;
      console.log(`사용자 ${inviteId}에게 방 ${roomId} 초대 전송: ${roomUrl}`);

      // 특정 사용자에게 초대 메시지 전달
      chatNamespace.to(inviteId).emit('receive_invite', { roomId, roomUrl });
    });

    // 메시지 전송
    socket.on('send_message', (data) => {
      console.log(`방 ${data.roomId}에 메시지 전송: ${data.message}`);
      socket.to(data.roomId).emit('receive_message', data);
    });

    // 연결 해제
    socket.on('disconnect', async () => {
      console.log(`사용자 연결 해제됨: ${socket.id}`);

      const rooms = userRooms[socket.id] ? Array.from(userRooms[socket.id]) : [];
      console.log(`사용자 ${socket.id}가 참가한 방 목록:`, rooms);

      try {
        for (const roomId of rooms) {
          // HTTP 요청 또는 데이터베이스 업데이트 처리
          const updatedRoom = await Room.findOneAndUpdate(
            { roomNumber: roomId, memberCount: { $gt: 0 } },
            { $inc: { memberCount: -1 } },
            { new: true }
          );
          console.log(`방 ${roomId}의 memberCount 감소`);

          if (updatedRoom && updatedRoom.memberCount === 0) {
            await Room.deleteOne({ roomNumber: roomId });
            console.log(`방 ${roomId}가 삭제되었습니다.`);
          }
        }

        // 방 목록에서 사용자 제거
        delete userRooms[socket.id];
      } catch (error) {
        console.error(`연결 해제 처리 중 에러 발생: ${error.message}`);
      }
    });
  });
}

module.exports = { router, chatSocketHandler };
