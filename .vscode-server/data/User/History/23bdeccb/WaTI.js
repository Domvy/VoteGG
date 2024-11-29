// ./routes/chat.js
export default function initializeChatNamespace(io) {
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
}
