import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [], // 방 목록
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

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
