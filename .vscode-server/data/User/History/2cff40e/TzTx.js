import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice.js';
import inviteReducer from './inviteSlice.js';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    invite: inviteReducer, //(초대링크)
  },
});

export default store;
