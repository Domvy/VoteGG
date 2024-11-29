import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice.js';
import sessionReducer from './SessionSlice.js';

export const store = configureStore({
  reducer: {
    room: roomReducer,
  },
  reducer: {
    session: sessionReducer,
  },
});

export default store;
