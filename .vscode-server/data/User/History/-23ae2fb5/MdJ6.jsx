import React, { useState } from 'react';
import './InviteButton.css';

const InviteButton = () => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  // 초대 팝업 열기
  const openInvitePopup = () => {
    setShowInvitePopup(true);
  };

  // 초대 팝업 닫기
  const closeInvitePopup = () => {
    setShowInvitePopup(false);
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
            <input type="text" placeholder="초대할 사용자 ID 입력" />
            <div className="popup-buttons">
              <button onClick={closeInvitePopup}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteButton;
