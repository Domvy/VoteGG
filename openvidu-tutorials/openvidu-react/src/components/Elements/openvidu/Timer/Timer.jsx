import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSocket from "../../../useSocket";
import "./Timer.css";
import VoteStatistic from "../../../Modals/VoteResultModal/VoteStatistic.jsx";
import VoteStatistichard from "../../../Modals/VoteResultModal/VoteStatistichard.jsx";
import { useRecoilState } from 'recoil';
import { resetTimerState } from '../../../../stores/TimerAtom'; // 수정된 경로
import { registerSetResetTimerFunc } from '../../../../stores/setTimerState'; // 수정된 경로

const Timer = ({ isObserver, setTimerDuration }) => {
  const { roomNumber } = useParams();
  const roomId = roomNumber;
  const socket = useSocket("/timer", roomId);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(4);
  const [timerFinished, setTimerFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null); // 추가된 상태
  const [resultData, setResultData] = useState(null);
  const [resetTimer, setResetTimer] = useRecoilState(resetTimerState);
  const [showVoteStatistic, setShowVoteStatistic] = useState(false); // 상태로 관리
  
  // setResetTimer 함수를 헬퍼 함수에 등록
  useEffect(() => {
    registerSetResetTimerFunc(setResetTimer);
  }, [setResetTimer]);

  // resetTimer 상태 변경 감지
  useEffect(() => {
    if (resetTimer) {
      handleReset();
      setResetTimer(false);
    }
  }, [resetTimer]);

  useEffect(() => {
    if (!socket) return;

    // 타이머 업데이트 받기
    const handleTimerUpdate = (data) => {
      const { timeLeft, isRunning, currentCycle, totalCycles, currentIndex } = data;
      console.log("타이머 업데이트:", data);
      setTimeLeft(timeLeft);
      setIsRunning(isRunning);
      setCurrentCycle(currentCycle);
      setTotalCycles(totalCycles);
      setCurrentIndex(currentIndex); // 업데이트
    };

    // 타이머 종료 이벤트 받기
    const handleTimerFinished = (data) => {
      console.log("타이머가 완료되었습니다.");
      setIsRunning(false);
      setTimerFinished(true);
      setResultData(data);
    };

    socket.on('timerUpdate', handleTimerUpdate);
    socket.on('timerFinished', handleTimerFinished);

    // 클린업
    return () => {
      socket.off('timerUpdate', handleTimerUpdate);
      socket.off('timerFinished', handleTimerFinished);
    };
  }, [socket]);

  // 타이머 시작 버튼 클릭 핸들러
  const handleStart = () => {
    if (socket) {
      socket.emit('start_timer', roomId);
      setTimerFinished(false);
    }
  };

  // 타이머 초기화 버튼 클릭 핸들러
  const handleReset = () => {
    if (socket) {
      socket.emit('reset_timer', roomId);
      setTimerFinished(false);
    }
  };

  // 타이머 종료 버튼 클릭 핸들러
  const handleStop = () => {
    if (socket) {
      socket.emit('stop_timer', roomId);
      setIsRunning(false);
      setTimeLeft(0); // 타이머 시간을 강제로 0초로 설정
    }
  };

  // 타이머 시간을 설정하는 핸들러
  const handleSetTimerDuration = (duration) => {
    if (socket) {
      socket.emit('set_timer_duration', { roomId, duration });
      if (setTimerDuration) {
        setTimerDuration(duration); // 상위 컴포넌트로 전달
      }
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
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`.trim();
  };

  return (
    <div>
      <div className="timer-wrapper">
        <div className="status-and-button">
          <span className={`current-status`}>{!isRunning && !timerFinished ? "토론 중" : timerFinished ? "토론 끝" : "진행 중"}</span>
          {!isObserver && (
            <div>
              <button className="start-button" onClick={handleStart} disabled={isRunning || timeLeft <= 0 || currentCycle >= totalCycles}>토론 시작</button>
              <button className="stop-button" onClick={handleStop} disabled={!isRunning}>타이머 종료</button>
              <button className="reset-button" onClick={handleReset}>타이머 초기화</button>
              <div className="set-timer-buttons">
                <button onClick={() => handleSetTimerDuration(5 * 60)}>5분</button>
                <button onClick={() => handleSetTimerDuration(10 * 60)}>10분</button>
                <button onClick={() => handleSetTimerDuration(15 * 60)}>15분</button>
                <button onClick={() => handleSetTimerDuration(30 * 60)}>30분</button>
              </div>
            </div>
          )}
        </div>
        <div className="timer-container">
          <div className="timer-text">
            <span>{formatTime(timeLeft).split(":")[0]}</span> {/* 분 */}
            <span>:</span>
            <span>{formatTime(timeLeft).split(":")[1]}</span> {/* 초 */}
          </div>
        </div>
      </div>

      {/* 타이머가 끝나면 모달을 띄움 */}
      {timerFinished && <VoteStatistic roomNumber={roomId} resultData={resultData} onClose={() => setTimerFinished(false)} />}
    </div>
  );
};

export default Timer;