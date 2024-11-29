import React, { useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import { getToken } from '../../services/openviduService';
import './JoinSession.css';

const JoinSession = ({ sessionId, userName, onJoin }) => {
    const [mySessionId, setMySessionId] = useState(sessionId);
    const [myUserName, setMyUserName] = useState(userName);

    const handleJoinSession = async (e) => {
        e.preventDefault();

        const OV = new OpenVidu();
        const session = OV.initSession();

        try {
            const token = await getToken(mySessionId);
            await session.connect(token, { clientData: myUserName });
            onJoin(session, myUserName, mySessionId);
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };

    return (
        <div id="join-dialog" className="jumbotron vertical-center">
            <h1>방을 생성합니다</h1>
            <form className="form-group" onSubmit={handleJoinSession}>
                <p>
                    <label>Participant: </label>
                    <input
                        className="form-control"
                        type="text"
                        value={myUserName}
                        onChange={(e) => setMyUserName(e.target.value)}
                        required
                    />
                </p>
                <p>
                    <label>Session: </label>
                    <input
                        className="form-control"
                        type="text"
                        value={mySessionId}
                        onChange={(e) => setMySessionId(e.target.value)}
                        required
                    />
                </p>
                <p className="text-center">
                    <button className="btn btn-lg btn-success" type="submit">
                        생성하기
                    </button>
                </p>
            </form>
        </div>
    );
};

export default JoinSession;
