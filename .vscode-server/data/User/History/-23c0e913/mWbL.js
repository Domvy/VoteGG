// src/components/Elements/openvidu/OpenViduVideoComponent.js

import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.streamManager && this.videoRef.current) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.streamManager !== prevProps.streamManager) {
            if (prevProps.streamManager) {
                prevProps.streamManager.removeVideoElement(this.videoRef.current);
            }
            if (this.props.streamManager && this.videoRef.current) {
                this.props.streamManager.addVideoElement(this.videoRef.current);
            }
        }
    }

    componentWillUnmount() {
        if (this.props.streamManager && this.videoRef.current) {
            this.props.streamManager.removeVideoElement(this.videoRef.current);
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
