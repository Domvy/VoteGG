import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {
    getConnectionInfo() {
        const { streamManager } = this.props;
        if (streamManager) {
            const connectionData = streamManager.stream.connection;
            return {
                connectionId: connectionData.connectionId, // 연결 ID
                clientData: JSON.parse(connectionData.data)?.clientData || 'Unknown', // 사용자 정의 데이터
            };
            console.log('---------------------------------------매니저')
        } else {
            console.log('sssssssssssssssssssssssssssssssssssssss')
        }
        return {};
    }

    render() {
        const { connectionId, clientData } = this.getConnectionInfo();

        return (
            <div>
                {this.props.streamManager ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        <div className="connection-info">
                            <p>Connection ID: {connectionId || 'N/A'}</p>
                            <p>User: {clientData || 'No Data'}</p>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
