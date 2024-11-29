import React, { useState } from 'react';
import './InviteButton.css';

const InviteButton = ({ roomUrl }) => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteId, setInviteId] = useState("");
  // 토큰에서 사용자 이름 추출
  const token = localStorage.getItem("token");
  console.log(token);
  const username = token ? getUsernameFromToken(token) : "Unknown User";

  // 초대 팝업 열기
  const openInvitePopup = () => {
    setShowInvitePopup(true);
  };

  // 초대 팝업 닫기
  const closeInvitePopup = () => {
    setShowInvitePopup(false);
    setInviteId(""); // 입력 초기화
  };

  // 초대 전송
  const sendInvite = () => {
    console.log(`${username}의 초대 전송: ${inviteId}, 링크: ${roomUrl}`);
    alert(`ID: ${inviteId}에게 초대 링크가 전송되었습니다!\n링크: ${roomUrl}`);
    closeInvitePopup();
  };

  return (
    <div>
      <button className="invite-button" onClick={openInvitePopup}>
        초대
      </button>

      {showInvitePopup && (
        <div className="invite-popup">
          <div className="popup-content">
            <h3>사용자 초대</h3>
            <input
              type="text"
              placeholder="초대할 사용자 ID 입력"
              value={inviteId}
              onChange={(e) => setInviteId(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={sendInvite}>전송</button>
              <button onClick={closeInvitePopup}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteButton;
