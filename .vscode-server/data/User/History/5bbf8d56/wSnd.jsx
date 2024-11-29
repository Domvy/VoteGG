// Timer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSocket from "../../../useSocket";
import "./Timer.css";

const Timer = () => {
  const { roomNumber } = useParams();
  const roomId = roomNumber;
  const socket = useSocket("/timer", roomId);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(4);
  const [timerFinished, setTimerFinished] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleTimerUpdate = (data) => {
      const { timeLeft, isRunning, currentCycle, totalCycles } = data;
      console.log("타이머 업데이트:", data);
      setTimeLeft(timeLeft);
      setIsRunning(isRunning);
      setCurrentCycle(currentCycle);
      setTotalCycles(totalCycles);
    };

    const handleTimerFinished = () => {
      console.log("타이머가 완료되었습니다.");
      setIsRunning(false);
      setTimerFinished(true);
    };

    socket.on('timerUpdate', handleTimerUpdate);
    socket.on('timerFinished', handleTimerFinished);

    return () => {
      socket.off('timerUpdate', handleTimerUpdate);
      socket.off('timerFinished', handleTimerFinished);
    };
  }, [socket]);

  const handleStart = () => {
    if (socket) {
      socket.emit('start_timer', roomId);
      setTimerFinished(false);
    }
  };

  const handleReset = () => {
    if (socket) {
      socket.emit('reset_timer', roomId);
      setTimerFinished(false);
    }
  };

  if (timeLeft === null) {
    return <div>로딩 중...</div>;
  }

  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
      return '0분 00초';
    }
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}분 ${sec < 10 ? '0' : ''}${sec}초`;
  };

  return (
    <div>
      <h1>남은 시간: {formatTime(timeLeft)}</h1>
      <p>현재 사이클: {currentCycle} / {totalCycles}</p>
      {timerFinished && <p>타이머가 완료되었습니다.</p>}
      <button onClick={handleStart} disabled={isRunning || timeLeft <= 0 || currentCycle >= totalCycles}>
        타이머 시작
      </button>
      <button onClick={handleReset}>
        타이머 초기화
      </button>
    </div>
  );
};

export default Timer;
