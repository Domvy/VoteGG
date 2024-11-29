import React, { useState } from 'react';

const SessionControls = ({ joinSession, leaveSession }) => {
  const [sessionId, setSessionId] = useState('SessionA');
  const [userName, setUserName] = useState('Participant' + Math.floor(Math.random() * 100));

  return (
    <div>
      <input
        type="text"
        placeholder="Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <input
        type="text"
        placeholder="User Name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={() => joinSession(sessionId, userName)}>Join Session</button>
      <button onClick={leaveSession}>Leave Session</button>
    </div>
  );
};

export default SessionControls;
