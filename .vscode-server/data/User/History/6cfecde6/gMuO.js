import { createSlice } from '@reduxjs/toolkit';

const inviteSlice = createSlice({
  name: 'invite',
  initialState: {
    inviteLink: '', // 초대 링크 상태
    invitees: [],
  },
  reducers: {
    setInviteLink: (state, action) => {
      state.inviteLink = action.payload; // 초대 링크 저장
    },
    setInvitees: (state, action) => {
      state.invitees = action.payload; // 초대받은 사용자 목록 저장
    },
    clearInviteLink: (state) => {
      state.inviteLink = ''; // 초대 링크 초기화
    },
  },
});

export const { setInviteLink, clearInviteLink } = inviteSlice.actions;
export default inviteSlice.reducer;
