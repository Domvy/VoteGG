// ./routes/socketHandlers.js
export default function initializeSocketHandlers(io) {
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
          socket.emit(
            'message',
            'Welcome to the room as a debater! Prepare your media streams.'
          );
        }
      });
    });
  }
  