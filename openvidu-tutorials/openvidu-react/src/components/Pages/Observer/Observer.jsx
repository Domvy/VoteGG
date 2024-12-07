// Observer Component
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Observer.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';

const Observer = () => {
  const { roomNumber } = useParams();
  const [isOpenviduActive, setIsOpenviduActive] = useState(false); // Openvidu 실행 여부 관리

  // OpenviduFinal을 활성화하는 버튼 핸들러
  const handleStartOpenvidu = () => {
    setIsOpenviduActive(true);
  };

  return (
    <div className="room">
      <div
        className="home-background"
        style={{
          backgroundImage: 'url("/eggbackground.jpg")', // 경로 문제 해결된 상태에서 이 방식을 사용
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100vw',
          height: '80vh',
          zIndex: -1,
          minHeight: '790px',
          maxHeight: '790px',
          // opacity: '60%',
        }}
      ></div>
      <div className='home-background2' />
      <div className='home-background3' />
      <div className="left-side">
        {isOpenviduActive && (
          <OpenviduFinal
            sessionId={roomNumber}
            userName="Observer"
            isObserver={true}
            subs={false}
          />
        )}
        {isOpenviduActive && (
          <RoomControl isObserver={true} />
        )}
        <button onClick={handleStartOpenvidu} className="start-openvidu-button">
          Start Observing Openvidu Session
        </button>
        <div className='emptyspace'>.</div>
        

      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} isObserver={true} />
      </div>
    </div>
  );
};

export default Observer;
