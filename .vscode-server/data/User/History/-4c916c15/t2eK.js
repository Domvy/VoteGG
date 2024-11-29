import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { leaveSession } from '../../../redux/sessionSlice';
import UserVideoComponent from './UserVideoComponent';
import './Session.css';

const Session = () => {
  const dispatch = useDispatch();
  const { session, mySessionId } = useSelector((state) => state.session);

  const [subscribers, setSubscribers] = useState([]);
  const [mainStreamManager, setMainStreamManager] = useState(null);
  const [publisher, setPublisher] = useState(null);

  useEffect(() => {
    if (!session) return;

    const onStreamCreated = (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      setSubscribers((prev) => [...prev, subscriber]);
    };

    const onStreamDestroyed = (event) => {
      const streamManager = event.stream.streamManager;
      setSubscribers((prev) => prev.filter((sub) => sub !== streamManager));
    };

    session.on('streamCreated', onStreamCreated);
    session.on('streamDestroyed', onStreamDestroyed);

    return () => {
      session.off('streamCreated', onStreamCreated);
      session.off('streamDestroyed', onStreamDestroyed);
    };
  }, [session]);

  useEffect(() => {
    if (!session) return;

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
        audioProcessing: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      session.publish(publisher);
      setPublisher(publisher);
      setMainStreamManager(publisher);
    };

    initPublisher();
  }, [session]);

  const leaveSessionHandler = () => {
    if (session) {
      session.disconnect();
      dispatch(leaveSession());
    }
  };

  return (
    <div id="session">
      <div id="session-header">
        <h1 id="session-title">{mySessionId}</h1>
        <button className="btn btn-large btn-danger" onClick={leaveSessionHandler}>
          방 나가기
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
