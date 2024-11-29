import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [], // 방 목록
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// 서버에서 방 목록을 불러오는 Thunk
export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  const response = await axios.get("https://whirae3433.shop:8443/api/room/rooms");
  return response.data; // 서버로부터 방 목록을 반환
});

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    updateMemberCount: (state, action) => {
      const { roomId, count } = action.payload;
      const room = state.rooms.find((room) => room.id === roomId);
      if (room) {
        room.memberCount = count;
      }
    },
  },
});

export const { updateMemberCount } = roomSlice.actions;
export default roomSlice.reducer;
