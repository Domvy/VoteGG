import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isStart: false,
  leftUserList: [],
  rightUserList: [],
  readyUserList: [],
  phaseNumber: 1,
  phaseDetail: '',
  voteLeftResult: 0,
  voteRightResult: 0,
  timer: 0,
  counter: 0,
  firstCardFile: null,
  secondCardFile: null,
  lastRoom: null,
  isRoom: false,
};

const debateSlice = createSlice({
  name: 'debate',
  initialState,
  reducers: {
    setIsStart: (state, action) => {
      state.isStart = action.payload;
    },
    setLeftCardList: (state, action) => {
      state.leftCardList = action.payload;
    },
    setRightCardList: (state, action) => {
      state.rightCardList = action.payload;
    },
    setPhaseNumber: (state, action) => {
      state.phaseNumber = action.payload;
    },
    // 나머지 상태 업데이트 로직 추가
  },
});

export const {
  setIsStart,
  setLeftCardList,
  setRightCardList,
  setPhaseNumber,
  // 나머지 액션 export
} = debateSlice.actions;

export default debateSlice.reducer;
