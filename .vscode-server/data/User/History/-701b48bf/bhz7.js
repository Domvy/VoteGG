import React, { useEffect, useState } from 'react';
import UserVideoComponent from './UserVideoComponent.js';

const Session = ({ sessionData, onLeave }) => {
  const { session, mySessionId } = sessionData;
  const [subscribers, setSubscribers] = useState([]); // 다른 참가자 스트림 리스트
  const [mainStreamManager, setMainStreamManager] = useState(null); // 메인 비디오
  const [publisher, setPublisher] = useState(null); // 자신의 퍼블리셔

  useEffect(() => {
    const onStreamCreated = (event) => {
      console.log('Stream created:', event.stream);
      const subscriber = session.subscribe(event.stream, undefined); // 새 스트림 구독
      setSubscribers((prev) => [...prev, subscriber]); // 구독자 리스트에 추가
    };

    const onStreamDestroyed = (event) => {
      console.log('Stream destroyed:', event.stream);
      const streamManager = event.stream.streamManager;
      setSubscribers((prev) => prev.filter((sub) => sub !== streamManager)); // 구독자 리스트에서 제거
    };

    // 기존 스트림 구독
    const subscribeToExistingStreams = () => {
      session.streams.forEach((stream) => {
        console.log('Subscribing to existing stream:', stream);
        const subscriber = session.subscribe(stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });
    };

    session.on('streamCreated', onStreamCreated);
    session.on('streamDestroyed', onStreamDestroyed);

    // 이미 존재하는 스트림 구독
    subscribeToExistingStreams();

    return () => {
      session.off('streamCreated', onStreamCreated);
      session.off('streamDestroyed', onStreamDestroyed);
    };
  }, [session]);

  useEffect(() => {
    const initPublisher = async () => {
      try {
        const OV = session.openvidu;
        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined, // 기본 마이크
          videoSource: undefined, // 기본 웹캠
          publishAudio: true, // 오디오 활성화
          publishVideo: true, // 비디오 활성화
          resolution: '640x480', // 비디오 해상도
          frameRate: 30, // 프레임 레이트
          mirror: false, // 비디오 미러링
        });
        console.log('Publisher initialized:', publisher);

        session.publish(publisher); // 세션에 퍼블리셔 추가
        setPublisher(publisher); // 퍼블리셔 설정
        setMainStreamManager(publisher); // 메인 비디오 설정
      } catch (error) {
        console.error('Error initializing publisher:', error);
      }
    };

    initPublisher();
  }, [session]);

  const leaveSession = () => {
    session.disconnect(); // 세션 종료
    onLeave(); // 상위 컴포넌트에 종료 알림
  };

  return (
    <div id="session">
      <div id="session-header">
        <h1 id="session-title">{mySessionId}</h1>
        <button className="btn btn-large btn-danger" onClick={leaveSession}>
          Leave session
        </button>
      </div>

      {/* 메인 비디오 */}
      {mainStreamManager && (
        <div id="main-video">
          <UserVideoComponent streamManager={mainStreamManager} />
        </div>
      )}

      {/* 다른 참가자 비디오 */}
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
