import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    debate: debateReducer,
  },
});

export default store;
