// src/components/Elements/openvidu/Timer/Timer.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSocket from "../../../useSocket";
import { triggerHandleTurnChange } from '../../../../stores/setTimerState'; // 경로를 프로젝트 구조에 맞게 조정하세요.
// 다른 필요한 import 문이 있다면 추가하세요.

const Timer = () => {
  const { roomNumber } = useParams();
  const roomId = roomNumber;
  const socket = useSocket("/timer", roomId);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(4);
  const [timerFinished, setTimerFinished] = useState(false);

  // `resetTimerState` 관련 코드를 제거했습니다.

  useEffect(() => {
    if (!socket) return;

    // 타이머 업데이트 받기
    const handleTimerUpdate = (data) => {
      setTimeLeft(data.timeLeft);
      setIsRunning(data.isRunning);
      setCurrentCycle(data.currentCycle);
      setTotalCycles(data.totalCycles);
    };

    // 타이머 종료 이벤트 받기
    const handleTimerFinished = () => {
      setIsRunning(false);
      setTimerFinished(true);
    };

    // 사이클이 넘어갔을 때 처리
    const handleCycleAdvanced = () => {
      // OpenviduFinal.js의 handleTurnChange 함수 호출
      triggerHandleTurnChange();
    };

    socket.on('timerUpdate', handleTimerUpdate);
    socket.on('timerFinished', handleTimerFinished);
    socket.on('cycleAdvanced', handleCycleAdvanced);

    // 클린업
    return () => {
      socket.off('timerUpdate', handleTimerUpdate);
      socket.off('timerFinished', handleTimerFinished);
      socket.off('cycleAdvanced', handleCycleAdvanced);
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

  // 시간을 "분:초" 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // 로딩 상태 처리
  if (timeLeft === null) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="timer-container">
        <div className="timer-text">
          <span>{formatTime(timeLeft).split(":")[0]}</span>
          <span>:</span>
          <span>{formatTime(timeLeft).split(":")[1]}</span>
        </div>
      </div>
      <p>현재 사이클: {currentCycle} / {totalCycles}</p>
      {timerFinished && <p>타이머가 완료되었습니다.</p>}

      <button onClick={handleStart} disabled={isRunning || timeLeft <= 0 || currentCycle >= totalCycles}>
        타이머 시작
      </button>
      <button onClick={handleReset}>
        타이머 초기화
      </button>

      {/* 타이머가 완료되면 추가 작업을 수행할 수 있습니다. */}
    </div>
  );
};

export default Timer;