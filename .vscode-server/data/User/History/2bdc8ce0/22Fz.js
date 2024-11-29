import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {
    getConnectionInfo() {
        const { streamManager, localConnectionId } = this.props;
        if (streamManager) {
            const connectionData = streamManager.stream.connection;
            return {
                connectionId: connectionData.connectionId, // 연결 ID
                clientData: JSON.parse(connectionData.data)?.clientData || 'Unknown', // 사용자 정의 데이터
            };
        }
        return {};
    }

    render() {
        const { connectionId, clientData } = this.getConnectionInfo();
        const { localConnectionId } = this.props;

        const isLocalStream = connectionId === localConnectionId;

        return (
            <div>
                {this.props.streamManager ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent
                            streamManager={this.props.streamManager}
                            muted={isLocalStream} />
                        {/* <div className="connection-info">
                            <p>User: {clientData || 'No Data'}</p>
                        </div> */}
                    </div>
                ) : null}
            </div>
        );
    }
}
