import React from 'react';
import UserVideoComponent from './UserVideoComponent';

const VideoContainer = ({ publisher, subscribers }) => {
  return (
    <div>
      {publisher && <UserVideoComponent streamManager={publisher} />}
      {subscribers.map((sub, index) => (
        <UserVideoComponent key={index} streamManager={sub} />
      ))}
    </div>
  );
};

export default VideoContainer;
