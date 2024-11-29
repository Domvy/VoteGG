import React, { useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import SessionControls from './SessionControls';
import VideoContainer from '../VideoContainer/VideoContainer';
import { createSession, createToken } from '../../services/openviduService';

const SessionManager = () => {
  const [session, setSession] = useState();
  const [publisher, setPublisher] = useState();
  const [subscribers, setSubscribers] = useState([]);

  const joinSession = async (sessionId, userName) => {
    const OV = new OpenVidu();
    const newSession = OV.initSession();

    newSession.on('streamCreated', (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    });

    newSession.on('streamDestroyed', (event) => {
      setSubscribers((prev) => prev.filter((sub) => sub !== event.stream.streamManager));
    });

    const token = await createToken(sessionId);
    await newSession.connect(token, { clientData: userName });

    const newPublisher = OV.initPublisher();
    newSession.publish(newPublisher);

    setSession(newSession);
    setPublisher(newPublisher);
  };

  const leaveSession = () => {
    session?.disconnect();
    setSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
  };

  return (
    <div>
      <SessionControls joinSession={joinSession} leaveSession={leaveSession} />
      <VideoContainer publisher={publisher} subscribers={subscribers} />
    </div>
  );
};

export default SessionManager;
