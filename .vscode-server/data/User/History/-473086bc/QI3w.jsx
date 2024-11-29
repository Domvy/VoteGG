import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './DebateRoom.css';
import OpenviduFinal from '../../Elements/openvidu/OpenviduFinal.js';

const DebateRoom = () => {
    const { roomNumber } = useParams();

    const [leftUsers, setLeftUsers] = useState([]);
    const [rightUsers, setRightUsers] = useState([]);

    // 토큰에서 사용자 이름 추출
    const token = localStorage.getItem("token");
    const userId = token ? getUsernameFromToken(token) : "Unknown User";

    return (
        <div className="DebateRoom-room">
            <div className="DebateRoom-left-side">
                {leftUsers.map((user, index) => (
                    <div key={index} className="user-container">
                        {/* UserVideoComponent로 사용자 렌더링 */}
                        <UserVideoComponent streamManager={user.subscriber} />
                        <p>{user.clientData}</p>
                    </div>
                ))}
            </div>
            <div className="DebateRoom-right-side">
                {rightUsers.map((user, index) => (
                    <div key={index} className="user-container">
                        <UserVideoComponent streamManager={user.subscriber} />
                        <p>{user.clientData}</p>
                    </div>
                ))}
            </div>
            {/* OpenviduFinal에서 사용자 리스트를 업데이트 */}
            <OpenviduFinal
                sessionId={roomNumber}
                userName={userId}
                onUpdateUsers={({ leftUsers, rightUsers }) => {
                    setLeftUsers(leftUsers);
                    setRightUsers(rightUsers);
                }}
            />
        </div>
    );
};

export default DebateRoom;

const getUsernameFromToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload parsing
        return payload.username; // Extract username
    } catch (error) {
        console.error('Failed to parse token:', error);
        return 'Unknown User';
    }
};
