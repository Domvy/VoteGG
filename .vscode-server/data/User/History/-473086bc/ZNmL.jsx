import React from 'react';
import { useParams } from 'react-router-dom';
import './DebateRoom.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';
import Timer from '../../Elements/openvidu/Timer/Timer';


import { isStartState, leftCardListState, rightCardListState, leftUserListState, rightUserListState, readyUserListState, phaseNumberState, phaseDetailState, voteLeftResultState, voteRightResultState, timerState, counterState, firstCardFileState, secondCardFileState, lastRoomState, isRoomState } from "stores/DebateStates";





const DebateRoom = () => {
  const { roomNumber } = useParams();

  // 토큰에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  const userId = token ? getUsernameFromToken(token) : "Unknown User";

  return (
    <div className="room">
      <div className="left-side">
        <OpenviduFinal sessionId={roomNumber} userName={userId} />
        {/* <RoomControl /> */}
      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} isObserver={false} /> {/* 참가자 페이지는 isObserver=false */}
      </div>
      <div>
        <Timer roomId={roomNumber} />
      </div>
    </div>
  );
};

export default DebateRoom;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};
