import React from 'react';
import { useParams } from 'react-router-dom';
import './Observer.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import OpenviduFinal from '../../elements/openvidu/OpenviduFinal'; // OpenviduFinal 가져오기

const Observer = () => {
  const { roomNumber } = useParams();

  return (
    <div className="room">
      <div className="left-side">
        {/* OpenviduFinal 컴포넌트를 통합하여 화상회의 스트리밍 */}
        <OpenviduFinal 
          sessionId={roomNumber} 
          userName="Observer"
          mirrorMode={true} // 미러 모드 활성화
        />
      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} />
      </div>
    </div>
  );
};

export default Observer;
