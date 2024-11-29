// src/components/Elements/openvidu/OpenViduVideoComponent.js

import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        const { streamManager } = this.props;
        if (streamManager && this.videoRef.current) {
            streamManager.addVideoElement(this.videoRef.current);
            console.log(`Added video element for streamManager: ${streamManager.connection.connectionId}`);
        }
    }

    componentDidUpdate(prevProps) {
        const { streamManager } = this.props;
        const { streamManager: prevStreamManager } = prevProps;

        if (streamManager !== prevStreamManager) {
            if (prevStreamManager && typeof prevStreamManager.removeVideoElement === 'function') {
                prevStreamManager.removeVideoElement(this.videoRef.current);
                console.log(`Removed video element for prevStreamManager: ${prevStreamManager.connection.connectionId}`);
            } else if (prevStreamManager) {
                console.warn(`prevStreamManager does not have removeVideoElement method:`, prevStreamManager);
            }

            if (streamManager && this.videoRef.current) {
                streamManager.addVideoElement(this.videoRef.current);
                console.log(`Added video element for new streamManager: ${streamManager.connection.connectionId}`);
            }
        }
    }

    componentWillUnmount() {
        const { streamManager } = this.props;
        if (streamManager && typeof streamManager.removeVideoElement === 'function' && this.videoRef.current) {
            streamManager.removeVideoElement(this.videoRef.current);
            console.log(`Removed video element on unmount for streamManager: ${streamManager.connection.connectionId}`);
        } else if (streamManager) {
            console.warn(`streamManager does not have removeVideoElement method on unmount:`, streamManager);
        }
    }

    render() {
        const { muted } = this.props; // muted prop 추가

        return (
            <video
                autoPlay
                playsInline
                ref={this.videoRef}
                muted={muted} // muted prop 전달
                style={{ width: '100%', height: '100%' }}
            />
        );
    }

}
