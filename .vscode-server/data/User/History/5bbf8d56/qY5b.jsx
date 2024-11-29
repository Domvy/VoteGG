import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSocket from "../../../useSocket"; // 커스텀 훅 가져오기
import "./Timer.css";

const Timer = () => {
  const { roomNumber } = useParams(); // URL의 :id 부분 추출
  const roomId = roomNumber;
  const socket = useSocket("/timer", roomId); // 소켓 연결 가져오기
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('initial'); // phase 상태 추가

  useEffect(() => {
    if (!socket) return;

    // 타이머 업데이트 받기
    const handleTimerUpdate = (newTimeLeft, running, newPhase) => {
      console.log("타이머 업데이트:", newTimeLeft, running, newPhase);
      setTimeLeft(newTimeLeft);
      setIsRunning(running);
      setPhase(newPhase); // phase 업데이트
    };

    socket.on('timerUpdate', handleTimerUpdate);

    // 클린업
    return () => {
      socket.off('timerUpdate', handleTimerUpdate);
    };
  }, [socket]);

  // 타이머 시작 버튼 클릭 핸들러
  const handleStart = () => {
    if (socket) {
      socket.emit('start_timer', roomId);
    }
  };

  // 타이머 초기화 버튼 클릭 핸들러
  const handleReset = () => {
    if (socket) {
      socket.emit('reset_timer', roomId);
    }
  };

  // 로딩 상태 처리
  if (timeLeft === null) {
    return <div>로딩 중...</div>;
  }

  // 시간을 "분:초" 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}분 ${sec < 10 ? '0' : ''}${sec}초`;
  };

  return (
    <div>
      <h1>{phase === 'initial' ? '남은 시간' : '추가 시간'}: {formatTime(timeLeft)}</h1>
      <button onClick={handleStart} disabled={isRunning || timeLeft <= 0}>
        타이머 시작
      </button>
      <button onClick={handleReset}>
        타이머 초기화
      </button>
    </div>
  );
};

export default Timer;
