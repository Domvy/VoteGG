import React from 'react';
import { useNavigate } from 'react-router-dom';
import OpenviduFinal from '../openvidu/OpenviduFinal';
import './Live.css';

const Live = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const handleClick = () => {
    navigate('/observer/1'); // 특정 경로로 이동
  };

  return (
    <div className="live" onClick={handleClick}>
      {' '}
      {/* 클릭 이벤트 추가 */}
      <div className="live-image-container">
        {/* YouTube embed iframe */}
        {/* <iframe
          className="live-video"
          src="https://www.youtube.com/embed/9LQsLPsKRq8?autoplay=1&mute=1" // 유튜브 링크의 VIDEO_ID 입력
          title="Live Agora Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe> */}

        <div className="room-video">
          {/* OpenviduFinal 컴포넌트로 스트림 표시 */}
          <OpenviduFinal
            sessionId={room.roomNumber} // 방 번호를 세션 ID로 사용
            userName={`Observer-${room.roomNumber}`} // 기본 이름 설정
            isObserver={true} // Observer 모드 활성화
          />
        </div>
        {/* <img
          src="/live.png" // 이미지 경로
          alt="Live Agora"
          className="live-image"
        /> */}
        <div className="gradient-overlay"></div>
      </div>
      <div className="live-text">
        <div className="live-count">
          <img
            src="/liveIcon.png" // 이미지 경로
            alt="Live Agora"
            className="live-icon"
          />
          <p>23 명</p>
        </div>
        <h1>Welcome to Agora</h1>
        <p>Join discussions and connect with others.</p>
      </div>
    </div>
  );
};

export default Live;
