const Session = ({ sessionData, onLeave, subscribers, updateSubscribers }) => {
  const { session, mySessionId } = sessionData;

  useEffect(() => {
    const onStreamCreated = (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      updateSubscribers([...subscribers, subscriber]); // 새로운 구독자를 리스트에 추가
    };

    const onStreamDestroyed = (event) => {
      const streamManager = event.stream.streamManager;
      const updatedSubscribers = subscribers.filter((sub) => sub !== streamManager);
      updateSubscribers(updatedSubscribers); // 제거된 구독자 리스트 업데이트
    };

    session.on('streamCreated', onStreamCreated);
    session.on('streamDestroyed', onStreamDestroyed);

    // 기존 스트림 구독
    session.streams.forEach((stream) => {
      const subscriber = session.subscribe(stream, undefined);
      updateSubscribers([...subscribers, subscriber]);
    });

    return () => {
      session.off('streamCreated', onStreamCreated);
      session.off('streamDestroyed', onStreamDestroyed);
    };
  }, [session, subscribers, updateSubscribers]);

  return (
    <div id="session">
      <div id="session-header">
        <h1 id="session-title">{mySessionId}</h1>
        <button className="btn btn-large btn-danger" onClick={onLeave}>
          Leave session
        </button>
      </div>

      <div id="video-container">
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
