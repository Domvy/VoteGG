import { createSlice } from '@reduxjs/toolkit';

const inviteSlice = createSlice({
  name: 'invite',
  initialState: {
    inviteLink: '', // 초대 링크 상태
  },
  reducers: {
    setInviteLink: (state, action) => {
      state.inviteLink = action.payload; // 초대 링크 저장
    },
    clearInviteLink: (state) => {
      state.inviteLink = ''; // 초대 링크 초기화
    },
  },
});

export const { setInviteLink, clearInviteLink } = inviteSlice.actions;
export default inviteSlice.reducer;
