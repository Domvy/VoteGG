import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {
    getConnectionInfo() {
        const { streamManager } = this.props;
        if (streamManager) {
            const connectionData = streamManager.stream.connection;
            console.log('Connection data:', connectionData.data);
            let data = connectionData.data;
            
    
            // data가 JSON 문자열인지 확인하고 파싱
            try {
                data = JSON.parse(data);
            } catch (e) {
                console.error('연결 데이터 파싱 오류:', e);
                data = {};
            }
    
            return {
                connectionId: connectionData.connectionId, // 연결 ID
                clientData: data.clientData || 'Unknown', // 사용자 이름 추출
            };
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
                            {/* <p>Connection ID: {connectionId || 'N/A'}</p> */}
                            <p>User: {clientData || 'No Data'}</p>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
