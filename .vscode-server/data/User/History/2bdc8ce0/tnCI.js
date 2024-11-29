        import React, { useEffect, useRef } from 'react';

const UserVideoComponent = ({ streamManager }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (streamManager && videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return <video autoPlay={true} ref={videoRef} />;
};

export default UserVideoComponent;