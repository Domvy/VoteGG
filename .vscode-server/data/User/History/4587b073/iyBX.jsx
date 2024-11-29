import React from 'react';
import './VideoGrid.css';

const VideoGrid = () => {
  // YouTube 영상 ID 배열
  const videos = [
    'dQw4w9WgXcQ', // 첫 번째 영상
    '3JZ_D3ELwOQ', // 두 번째 영상
    '2Vv-BfVoq4g', // 세 번째 영상
    'CevxZvSJLk8', // 네 번째 영상
  ];

  return (
    <div className="video-grid">
      {videos.map((videoId, index) => (
        <div key={index} className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
            title={`Video ${index + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
