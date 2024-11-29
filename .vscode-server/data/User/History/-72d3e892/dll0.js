import React, { useState } from 'react';
import './App.css';
import JoinSession from './components/openvidu/JoinSession';
import Session from './components/openvidu/Session';

function App() {
    const [sessionData, setSessionData] = useState({
        session: undefined,
        mySessionId: 'SessionA',
        myUserName: `Participant${Math.floor(Math.random() * 100)}`,
    });

    const handleJoinSession = (session, userName, sessionId) => {
        setSessionData({
            session,
            mySessionId: sessionId,
            myUserName: userName,
        });
    };

    const handleLeaveSession = () => {
        setSessionData({
            session: undefined,
            mySessionId: 'SessionA',
            myUserName: `Participant${Math.floor(Math.random() * 100)}`,
        });
    };

    return (
        <div className="container">
            {sessionData.session === undefined ? (
                <JoinSession
                    sessionId={sessionData.mySessionId}
                    userName={sessionData.myUserName}
                    onJoin={handleJoinSession}
                />
            ) : (
                <Session
                    sessionData={sessionData}
                    onLeave={handleLeaveSession}
                />
            )}
        </div>
    );
}

export default App;
