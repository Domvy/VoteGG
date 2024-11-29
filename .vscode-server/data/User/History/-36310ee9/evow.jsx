import React, { useEffect } from 'react';

const Timer = ({ isMicOn, timeLeft, setTimeLeft, onTimeEnd }) => {
  useEffect(() => {
    let timer;
    if (isMicOn && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }

    if (timeLeft === 0 && isMicOn) {
      onTimeEnd(); // 시간이 끝나면 마이크 끄기 콜백
    }

    return () => clearInterval(timer); // 클린업
  }, [isMicOn, timeLeft, setTimeLeft, onTimeEnd]);

  return (
    <div style={{ marginTop: '20px', fontSize: '24px' }}>
      남은 시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초
    </div>
  );
};

export default Timer;
