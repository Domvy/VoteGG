import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Observer.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js'; // OpenviduFinal 가져오기

const Observer = () => {
  const { roomNumber } = useParams();
  const [key, setKey] = useState(0); // 리렌더링 트리거용 상태

  // 특정 조건에서 리렌더링 트리거
  useEffect(() => {
    const interval = setInterval(() => {
      setKey((prevKey) => prevKey + 1); // key 값 업데이트
    }, 10000); // 10초마다 리렌더링 트리거

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div className="room">
      <div className="left-side">
        <OpenviduFinal
          key={key} // key를 사용하여 컴포넌트 재생성
          sessionId={roomNumber}
          userName="Observer"
          isObserver={true} // 관전자 모드 활성화
        />
      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} />
      </div>
    </div>
  );
};

export default Observer;
