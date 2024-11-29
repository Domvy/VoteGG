import React, { useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { getToken } from '../../../services/openviduService';
import './JoinSession.css'; // 스타일 파일 추가

const JoinSession = ({ sessionId, userName, onJoin }) => {
    const [mySessionId, setMySessionId] = useState(sessionId);
    const [myUserName, setMyUserName] = useState(userName);
      // 토큰에서 사용자 이름 추출
    const token = localStorage.getItem("token");
    console.log(token);
    const username = token ? getUsernameFromToken(token) : "Unknown User";

    const handleJoinSession = async (e) => {
        e.preventDefault();

        const OV = new OpenVidu();
        const session = OV.initSession();

        try {
            const token = await getToken(mySessionId);
            await session.connect(token, { clientData: username });
            onJoin(session, username, mySessionId);
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };

    return (
        <div className="join-session-container">
            <h1 className="join-session-title">방을 생성합니다</h1>
            <form className="join-session-form" onSubmit={handleJoinSession}>
                <div className="form-group">
                </div>
                <div className="form-group">
                    <label htmlFor="session-id">세션 ID</label>
                    <input
                        id="session-id"
                        className="form-input"
                        type="text"
                        value={mySessionId}
                        onChange={(e) => setMySessionId(e.target.value)}
                        placeholder="세션 ID를 입력하세요"
                        required
                    />
                </div>
                <button className="join-button" type="submit">
                    CAM On
                </button>
            </form>
        </div>
    );
};

export default JoinSession;


// Utility Function for Token Decoding
const getUsernameFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
      return payload.username; // Extract username
    } catch (error) {
      console.error('Failed to parse token:', error);
      return 'Unknown User';
    }
  };
