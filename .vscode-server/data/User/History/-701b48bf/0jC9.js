import React, { useEffect, useState } from 'react';
import './Session.css'; // CSS 파일 추가
import UserVideoComponent from './UserVideoComponent.js';

const Session = ({ sessionData, onLeave }) => {
  const { session, mySessionId } = sessionData;
  const [subscribers, setSubscribers] = useState([]);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);

  useEffect(() => {
    const onStreamCreated = (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    };

    const onStreamDestroyed = (event) => {
      const streamManager = event.stream.streamManager;
      setSubscribers((prev) => prev.filter((sub) => sub !== streamManager));
    };

    const subscribeToExistingStreams = () => {
      session.streams.forEach((stream) => {
        const subscriber = session.subscribe(stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });
    };

    session.on('streamCreated', onStreamCreated);
    session.on('streamDestroyed', onStreamDestroyed);

    return () => {
      session.off('streamCreated', onStreamCreated);
      session.off('streamDestroyed', onStreamDestroyed);
    };
  }, [session]);
  
  subscribeToExistingStreams();

  useEffect(() => {
    const initPublisher = async () => {
      const OV = session.openvidu;
      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        mirror: false,
      });
      session.publish(publisher);
      setPublisher(publisher);
      setMainStreamManager(publisher);
    };

    initPublisher();
  }, [session]);

  const leaveSession = () => {
    session.disconnect();
    onLeave();
  };

  return (
    <div id="session">
      <div id="session-header">
        <h1 id="session-title">{mySessionId}</h1>
        <button className="btn btn-large btn-danger" onClick={leaveSession}>
          Leave session
        </button>
      </div>

      {mainStreamManager && (
        <div id="main-video">
          <UserVideoComponent streamManager={mainStreamManager} />
        </div>
      )}
      <div id="video-container">
        {publisher && (
          <div className="stream-container">
            <UserVideoComponent streamManager={publisher} />
          </div>
        )}
        {subscribers.map((sub, i) => (
          <div key={i} className="stream-container">
            <UserVideoComponent streamManager={sub} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Session;
