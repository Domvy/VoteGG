// sessionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  session: undefined,
  mySessionId: 'TestRoom123',
  myUserName: `Participant${Math.floor(Math.random() * 100)}`,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    joinSession(state, action) {
      state.session = action.payload.session;
      state.mySessionId = action.payload.mySessionId;
      state.myUserName = action.payload.myUserName;
    },
    leaveSession(state) {
      state.session = undefined;
      state.mySessionId = 'SessionA';
      state.myUserName = `Participant${Math.floor(Math.random() * 100)}`;
    },
  },
});

export const { joinSession, leaveSession } = sessionSlice.actions;
export default sessionSlice.reducer;
