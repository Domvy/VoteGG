import React from 'react';

const CameraSwitch = ({ session, currentVideoDevice, setCurrentVideoDevice }) => {
  const switchCamera = async () => {
    const devices = await session.getDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    const newDevice = videoDevices.find((device) => device.deviceId !== currentVideoDevice.deviceId);

    if (newDevice) {
      const newPublisher = session.initPublisher(undefined, {
        videoSource: newDevice.deviceId,
      });
      session.unpublish(session.publisher);
      session.publish(newPublisher);
      setCurrentVideoDevice(newDevice);
    }
  };

  return <button onClick={switchCamera}>Switch Camera</button>;
};

export default CameraSwitch;
