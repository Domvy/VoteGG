import React, { useState } from 'react';
import io from 'socket.io-client';
import './InviteButton.css';

const InviteButton = ({ roomUrl }) => {
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [inviteId, setInviteId] = useState("");

  const openInvitePopup = () => setShowInvitePopup(true);
  const closeInvitePopup = () => {
    setShowInvitePopup(false);
    setInviteId("");
  };

  const newSocket = io(window.location.origin + "/invite", {
    path: '/socket.io/',
    transports: ['websocket'],
    query: { debug: true }
  });

  const sendInvite = () => {
    // 초대 메시지 전송
    newSocket.emit('connect', { inviteId, roomUrl });
    alert(`ID: ${inviteId}에게 초대 링크가 전송되었습니다!`);
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
