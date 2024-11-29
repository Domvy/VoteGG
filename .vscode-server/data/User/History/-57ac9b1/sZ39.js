import React, { useState } from 'react';
import JoinSession from './JoinSession';
import Session from './Session';

function OpenviduFinal() {
  const [sessionData, setSessionData] = useState({
    session: undefined,
    mySessionId: 'TestRoom123',
    myUserName: `Participant${Math.floor(Math.random() * 100)}`,
  });
  const [subscribers, setSubscribers] = useState([]); // 다른 참가자 스트림 저장

  const handleJoinSession = (session, userName, sessionId) => {
    setSessionData({
      session,
      mySessionId: sessionId,
      myUserName: userName,
    });
  };

  const handleLeaveSession = () => {
    sessionData.session?.disconnect();
    setSessionData({
      session: undefined,
      mySessionId: 'SessionA',
      myUserName: `Participant${Math.floor(Math.random() * 100)}`,
    });
    setSubscribers([]); // 세션 종료 시 참가자 정보 초기화
  };

  const updateSubscribers = (newSubscribers) => {
    setSubscribers(newSubscribers); // 구독자 정보 업데이트
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
          subscribers={subscribers}
          updateSubscribers={updateSubscribers}
          onLeave={handleLeaveSession}
        />
      )}
    </div>
  );
}

export default OpenviduFinal;
