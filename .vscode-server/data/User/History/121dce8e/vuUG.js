import { configureStore } from '@reduxjs/toolkit';
import debateReducer from './debateSlice';

export const store = configureStore({
  reducer: {
    debate: debateReducer,
  },
});

export default store;
