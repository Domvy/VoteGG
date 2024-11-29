import React, { useState } from 'react';
import './RoomModal.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setInviteLink, setInvitees } from '../../inviteSlice.js';

const RoomModal = ({ onClose }) => {
  const [roomTitle, setRoomTitle] = useState('');
  const [invitees, setLocalInvitees] = useState(['', '', '']); // 로컬 초대 상태
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // JWT에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  const username = token ? getUsernameFromToken(token) : "Unknown User";

  const handleInviteeChange = (index, value) => {
    const updatedInvitees = [...invitees];
    updatedInvitees[index] = value;
    setLocalInvitees(updatedInvitees);
  };

  const handleCreateRoom = async () => {
    try {
      // 비어있는 초대 입력 필드는 제외
      const filteredInvitees = invitees.filter((invitee) => invitee.trim() !== '');
      dispatch(setInvitees(filteredInvitees)); // Redux에 초대받은 사용자 저장

      // 서버로 POST 요청
      const response = await axios.post("https://54.180.246.248/api/room/roomCreate", {
        roomname: roomTitle,
        createdby: username,
        invitees: filteredInvitees, // 초대할 사용자 정보 전달
      });

      if (response.status === 201) {
        const { roomNumber, inviteLink } = response.data; // 초대 링크도 서버 응답에 포함
        console.log("방 생성 성공, 방 번호:", roomNumber);

        // Redux에 초대 링크 저장
        dispatch(setInviteLink(inviteLink));

        // 방 번호를 기반으로 페이지 이동
        navigate(`/room/${roomNumber}`);
        onClose();
      }
    } catch (error) {
      console.error("방 생성 실패:", error.message);
      alert("방 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="room-modal-overlay" onClick={onClose}>
      <div className="room-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>방 만들기</h2>
        {/* 방 제목 입력 */}
        <label className="input-label">방 제목</label>
        <input
          type="text"
          value={roomTitle}
          onChange={(e) => setRoomTitle(e.target.value)}
          className="modal-input"
          placeholder="방 제목을 입력하세요"
        />
        {/* 초대할 사람 입력 */}
        {invitees.map((invitee, index) => (
          <div key={index}>
            <label className="input-label">{`초대할 사람 ${index + 1}`}</label>
            <input
              type="text"
              value={invitee}
              onChange={(e) => handleInviteeChange(index, e.target.value)}
              className="modal-input"
              placeholder={`초대할 사람 ${index + 1} 닉네임`}
            />
          </div>
        ))}
        {/* 버튼들 */}
        <div className="modal-buttons">
          <button className="modal-create-button" onClick={handleCreateRoom}>
            방 생성하기
          </button>
          <button className="modal-cancel-button" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;

// Utility Function for Token Decoding
const getUsernameFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.username;
  } catch (error) {
    console.error('Failed to parse token:', error);
    return 'Unknown User';
  }
};
