import React from 'react';
import { OpenVidu } from 'openvidu-browser';
import { getToken } from '../../../services/openviduService';
import { useParams } from 'react-router-dom'; // React Router 사용
import { useDispatch, useSelector } from 'react-redux';
import { joinSession } from '../../../SessionSlice'; // Redux 액션
import './JoinSession.css'; // 스타일 파일 추가

const JoinSession = () => {
    const dispatch = useDispatch();
    const { roomNumber } = useParams();

    const sessionData = useSelector((state) => state.session);
    const token = localStorage.getItem("token");
    const username = token ? getUsernameFromToken(token) : "Unknown User";

    const handleJoinSession = async (e) => {
        e.preventDefault();

        const OV = new OpenVidu();
        const session = OV.initSession();

        try {
            const token = await getToken(roomNumber); // OpenVidu 토큰 생성
            await session.connect(token, { clientData: username }); // 세션 연결
            dispatch(joinSession({ session, myUserName: username, mySessionId: roomNumber })); // Redux 액션 호출
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };

    return (
        <div className="join-session-container">
            <h1 className="join-session-title">방을 생성합니다</h1>
            <form className="join-session-form" onSubmit={handleJoinSession}>
                <div className="form-group">
                    <label>Room ID: {roomNumber}</label>
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
