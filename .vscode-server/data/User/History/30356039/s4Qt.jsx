import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoomList.css";
import DebateRoom from '../../Pages/DebateRoom/DebateRoom';

const RoomList = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  // 데이터베이스에서 방 정보 가져오기
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(window.location.origin + "/api/room/roomList");
        setRooms(response.data); // 서버에서 받은 데이터로 상태 업데이트
      } catch (error) {
        console.error("방 목록 가져오기 실패:", error.message);
      }
    };

    fetchRooms();
  }, []);

  // 방 참가 요청 함수
  const joinRoom = async (roomNumber) => {
    try {
      const token = localStorage.getItem("token"); // 사용자 인증 토큰 가져오기
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 참가자 추가 API 호출
      await axios.post(window.location.origin + "/api/room/participant", {
        roomNumber,
        token,
      });

      // 방으로 이동
      navigate(`/room/${roomNumber}`);
    } catch (error) {
      console.error("방 참가 실패:", error.message);
      alert("방 참가 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h1 className="room-list-title">LIVE 토론</h1>
      </div>
      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.roomNumber} className="room-card">
            <div className="room-image">
              <img
                src="./sample.jpeg"
                alt={`${room.roomname} 이미지`}
                onClick={() => navigate(`/observer/${room.roomNumber}`)}
                className="entry-room"
              />
              <p className="room-member-count">{room.memberCount}명</p>
              <p className="room-live">LIVE</p>
            </div>
            <div className="room-details">
              <h2 className="room-name">{room.roomname}</h2>
              <div className="room-info">
                <p className="room-creator">{room.createdby} 님</p>
              </div>
              <div className="room-buttons">
                <button
                  className="room-spectate-button"
                  onClick={() => navigate(`/observer/${room.roomNumber}`)}
                >
                  참관하기
                </button>
                <button
                  className="room-discuss-button"
                  onClick={() => joinRoom(room.roomNumber)}
                >
                  토론하기
                </button>
                <button
                  className="Debateroom-discuss-button"
                  onClick={() => joinRoom(DebateRoomroom.roomNumber)}
                >
                  테스트 룸
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
