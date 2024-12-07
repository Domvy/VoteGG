import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Room.css';
import TestChat from '../../Elements/TestChat/TestChat.jsx';
import RoomControl from '../../Elements/RoomControl/RoomControl.jsx';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';
import useSocket from "../../useSocket";

const Room = () => {
  const { roomNumber } = useParams();
  const location = useLocation();
  const socket = useSocket("/timer", roomNumber);

  // 토큰에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  const userId = token ? getUsernameFromToken(token) : "Unknown User";

  // 방 제목 상태 관리
  const [roomname, setRoomname] = useState('');
  const [isOpenviduActive, setIsOpenviduActive] = useState(false); // Openvidu 실행 여부 관리
  const [timerMinutes, setTimerMinutes] = useState(0); // 타이머 분 상태 관리
  const [timerSeconds, setTimerSeconds] = useState(0); // 타이머 초 상태 관리
  const [createdBy, setCreatedBy] = useState(''); // 방 생성자 ID
  const [timerDuration, setTimerDuration1] = useState(0); // 타이머 지속 시간

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const roomId = (pathParts[1] === 'room' || pathParts[1] === 'observer')
      ? decodeURIComponent(pathParts[2])
      : null;

    if (roomId) {
      fetch(`/api/room/rooms/${roomId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('방 정보를 가져오는 데 실패했습니다.');
          }
          return response.json();
        })
        .then(data => {
          setRoomname(data.roomname || roomId);
          setCreatedBy(data.createdby); // 방 생성자 설정
        })
        .catch(error => {
          console.error('방 정보 가져오기 오류:', error);
        });
    }
  }, [location.pathname]);

  // OpenviduFinal을 활성화하는 버튼 핸들러
  const handleStartOpenvidu = () => {
    setIsOpenviduActive(true);
  };

  // 타이머 시작 버튼 핸들러
  const handleStartTimer = () => {
    const totalSeconds = timerMinutes * 60 + timerSeconds;
    if (totalSeconds > 0) {
      socket.emit('start_timer', { roomId: roomNumber, duration: totalSeconds });
    }
  };

  // 타이머 시간을 설정하는 핸들러
  const handleSetTimerDuration = (duration) => {
    if (socket) {
      socket.emit('set_timer_duration', { roomId:roomNumber, duration });
      if (setTimerDuration1) {
        setTimerDuration1(duration); // 상위 컴포넌트로 전달
      }
    }
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
          <OpenviduFinal sessionId={roomNumber} userName={userId} />
        )}
          <RoomControl setTimerDuration={timerDuration} />
        {userId === createdBy && (
            <button onClick={handleStartOpenvidu} className="start-openvidu-button">
              Start Openvidu Session
            </button>
        )}
      </div>
      <div className="right-side">
        <TestChat roomId={roomNumber} isObserver={false} />
        <div className="timer-buttons">
          <button onClick={() => handleSetTimerDuration(5 * 60)}>5분</button>
          <button onClick={() => handleSetTimerDuration(10 * 60)}>10분</button>
          <button onClick={() => handleSetTimerDuration(15 * 60)}>15분</button>
          <button onClick={() => handleSetTimerDuration(30 * 60)}>30분</button>
        </div>
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
