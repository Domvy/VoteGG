import React from 'react';
import { useParams } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';
import Timer from '../../Elements/openvidu/Timer/Timer';
const Room = () => {
  const { roomId } = useParams();
  const nickname = userInfo?.userNickname;
  const [currentSpeakingTeam, setCurrentSpeakingTeam] = useState("");
  const [currentSpeakingUser, setCurrentSpeakingUser] = useState("");
  const [isAllReady, setIsAllReady] = useState(false)
  const [leftCardList, setLeftCardList] = useRecoilState(leftCardListState);
  const [rightCardList, setRightCardList] = useRecoilState(rightCardListState);
  const [leftUserList, setLeftUserList] = useRecoilState(leftUserListState);
  const [rightUserList, setRightUserList] = useRecoilState(rightUserListState);
  const [readyUserList, setReadyUserList] = useRecoilState(readyUserListState);
  const [master, setMaster] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomToken, setRoomToken] = useState(undefined);
  const [phaseNum, setPhaseNum] = useRecoilState(phaseNumberState);
  const [phaseDetail, setPhaseDetail] = useRecoilState(phaseDetailState);
  const [rightOpinion, setRightOpinion] = useState("");
  const [leftOpinion, setLeftOpinion] = useState("");
  const [timer, setTimer] = useRecoilState(timerState);
  const [counter, setCounter] = useRecoilState(counterState);
  const [isStart, setIsStart] = useRecoilState(isStartState);
  const [watchNum, setWatchNum] = useState(0);
  const [voteLeftResult, setVoteLeftResult] = useRecoilState(voteLeftResultState);
  const [voteRightResult, setVoteRightResult] = useRecoilState(voteRightResultState);
  const [role, setRole] = useRecoilState(debateUserRoleState);





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

export default Room;

const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
    return payload.username; // Extract username
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};
