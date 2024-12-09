import React, { useEffect, useState } from 'react';
import './RoomControl.css';
import Timer from '../openvidu/Timer/Timer';
import { useParams, useLocation } from 'react-router-dom';
import useTranscriptionStore from '../../../stores/transcriptionStore';

const RoomControl = ({ isObserver }) => {
  const location = useLocation();
  const { roomNumber } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomname, setRoomname] = useState('');
  const [roomData, setRoomData] = useState({
    roomname: "",
    memberCount: 0,
    createdby: "",
    creatorProfileImage: "/default-profile.png",
    tags: [],
  });
  
  const transcriptionHistory = useTranscriptionStore((state) => state.transcriptionHistory);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch(`/api/room/rooms/${roomNumber}`);
        if (!response.ok) {
          throw new Error("방 정보를 가져오는 데 실패했습니다.");
        }
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error("방 정보 가져오기 오류:", error);
        setRoomData({
          roomname: "Unknown Room",
          memberCount: 0,
          createdby: "Unknown Creator",
          creatorProfileImage: "/default-profile.png",
          tags: [],
        });
      }
    };

    fetchRoomData();
  }, [roomNumber]);

  return (
    <div className='roomcontrol-container'>
      <div className='control-wrap'>
        <h1 className="room-title">{roomname || "untitled"}</h1>
        <div className="room-info__details">
          <div className="room-info__tags">
            {roomData.tags.length > 0 ? (
              roomData.tags.map((tag, index) => (
                <span key={index} className="room-info__tag">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="room-info__tag--none">태그 없음</span>
            )}
          </div>
          <p className="room-info__count">{roomData.memberCount}명이 시청중</p>
        </div>

      </div>
      <Timer roomId={roomNumber} isObserver={isObserver} className='room-timer'/>
      <button onClick={toggleModal} className="transcript-button">
          대화 기록 보기
        </button>
      {/* 모달 컴포넌트 */}
      {isModalOpen && (
        <>
          <div 
            className={`modal-overlay ${isModalOpen ? 'open' : ''}`} 
            onClick={toggleModal}
          />
          <div className={`transcript-modal ${isModalOpen ? 'open' : ''}`}>
            <div className="modal-content">
              <button onClick={toggleModal} className="close-button">×</button>
              <h2>대화 기록</h2>
              <div className="transcript-container">
                {transcriptionHistory.map((item, index) => (
                  <div key={index} className="transcription-item">
                    <span className="speaker">{item.speaker}:</span>
                    <span className="text">{item.text}</span>
                    <span className="timestamp">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomControl;