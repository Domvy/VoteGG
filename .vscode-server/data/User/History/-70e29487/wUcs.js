// src/components/Elements/openvidu/OpenviduFinal.js

import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import './OpenviduFinal.css';
import { triggerResetTimer } from '../../../stores/setTimerState';

const APPLICATION_SERVER_URL = process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";

class OpenviduFinal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: undefined,
            publisher: undefined,
            mainStreamManager: undefined,
            subscribers: [],
            isSharingScreen: false,
            leftUserList: [],
            rightUserList: [],
            userName: this.props.userName || 'Unknown', // 사용자 이름 설정
            currentPhase: 1,
            currentTurn: 'left',
        };

        this.joinSession = this.joinSession.bind(this);
        this.joinListenerSession = this.joinListenerSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.startScreenShare = this.startScreenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.leaveSession);

        // 역할에 따라 적합한 세션에 참여
        if (this.props.isObserver) {
            this.joinListenerSession(); // 청취자
        } else {
            this.joinSession(); // 발언자
        }

        // Timer에서 phaseChange 이벤트 처리
        window.handlePhaseChange = (newPhase, newTurn) => {
            console.log("Phase change triggered:", newPhase, newTurn);

            this.setState({
                currentPhase: newPhase,
                currentTurn: newTurn,
            }, () => {
                this.updateAudioStatus();
            });

            // 타이머 초기화 트리거
            triggerResetTimer();
        };
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.leaveSession);
        window.handlePhaseChange = null;
        this.leaveSession();
    }

    async joinSession() {
        const OV = new OpenVidu();
        const session = OV.initSession();

        session.on("signal:phaseChange", (event) => {
            const data = JSON.parse(event.data);

            this.setState({
                currentPhase: data.currentPhase,
                currentTurn: data.currentTurn,
            }, () => {
                this.updateAudioStatus();
            });
        });

        session.on('signal:userList', (event) => {
            const data = JSON.parse(event.data);

            this.setState((prevState) => {
                const mergedLeftUserList = mergeUserLists(prevState.leftUserList, data.leftUserList || []);
                const mergedRightUserList = mergeUserLists(prevState.rightUserList, data.rightUserList || []);

                return {
                    leftUserList: mergedLeftUserList,
                    rightUserList: mergedRightUserList,
                };
            });
        });

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);

            let data = event.stream.connection.data;
            let userName = 'Unknown';

            const parsedData = JSON.parse(data);
            userName = parsedData.clientData || 'Unknown';

            const newSubscriber = {
                subscriber: subscriber,
                userName: userName,
                connectionId: event.stream.connection.connectionId,
            };

            this.setState((prevState) => ({
                subscribers: [...prevState.subscribers, newSubscriber],
            }));
        });

        session.on('streamDestroyed', (event) => {
            const connectionId = event.stream.connection.connectionId;

            this.setState((prevState) => {
                const subscribers = prevState.subscribers.filter(
                    (sub) => sub.connectionId !== connectionId
                );

                const leftUserList = prevState.leftUserList.filter(
                    (user) => user.connectionId !== connectionId
                );
                const rightUserList = prevState.rightUserList.filter(
                    (user) => user.connectionId !== connectionId
                );

                session.signal({
                    data: JSON.stringify({ leftUserList, rightUserList }),
                    type: 'userList',
                });

                return {
                    subscribers,
                    leftUserList,
                    rightUserList,
                };
            });
        });

        const token = await this.getToken(this.props.sessionId);
        await session.connect(token, { clientData: this.state.userName });

        let publisher = await OV.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            mirror: false,
            audioProcessing: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            }
        });

        session.publish(publisher);

        this.setState({
            session: session,
            publisher: publisher,
            mainStreamManager: publisher,
        });
    }

    async joinListenerSession() {
        const OV = new OpenVidu();
        const session = OV.initSession();

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);

            this.setState((prevState) => ({
                subscribers: [...prevState.subscribers, subscriber],
            }));
        });

        session.on('streamDestroyed', (event) => {
            this.setState((prevState) => ({
                subscribers: prevState.subscribers.filter(
                    (sub) => sub !== event.stream.streamManager
                ),
            }));
        });

        const token = await this.getToken(this.props.sessionId);
        await session.connect(token, { clientData: this.state.userName });

        this.setState({ session });
    }

    leaveSession() {
        const { session } = this.state;
        if (session) {
            session.disconnect();
        }
        this.setState({
            session: undefined,
            publisher: undefined,
            mainStreamManager: undefined,
            subscribers: [],
            leftUserList: [],
            rightUserList: [],
        });
    }

    async getToken(sessionId) {
        const session = await this.createSession(sessionId);
        return await this.createToken(session);
    }

    async createSession(sessionId) {
        const response = await axios.post(
            `${APPLICATION_SERVER_URL}api/sessions`,
            { customSessionId: sessionId },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    }

    async createToken(sessionId) {
        const response = await axios.post(
            `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
            {},
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data;
    }

    render() {
        const { mainStreamManager, subscribers, isSharingScreen, leftUserList, rightUserList, currentPhase, currentTurn } = this.state;

        const allStreamManagers = [];
        const localConnectionId = this.state.session?.connection?.connectionId;

        if (mainStreamManager && localConnectionId) {
            allStreamManagers.push({
                connectionId: localConnectionId,
                streamManager: mainStreamManager,
                userName: this.state.userName,
            });
        }

        subscribers.forEach((sub) => {
            allStreamManagers.push({
                connectionId: sub.connectionId,
                streamManager: sub.subscriber,
                userName: sub.userName,
            });
        });

        const leftStreamManagers = leftUserList.map((user) => {
            const manager = allStreamManagers.find((manager) => manager.connectionId === user.connectionId);
            return manager;
        }).filter(Boolean);

        const rightStreamManagers = rightUserList.map((user) => {
            const manager = allStreamManagers.find((manager) => manager.connectionId === user.connectionId);
            return manager;
        }).filter(Boolean);

        const currentLeftUser = leftStreamManagers[currentPhase - 1];
        const currentRightUser = rightStreamManagers[currentPhase - 1];

        return (
            <div className="openvidu-final">
                <div className="video-container">
                    {/* 왼쪽 참가자 */}
                    <div className={`left-video ${currentTurn === 'left' && currentLeftUser ? 'active-speaker' : ''}`}>
                        {currentLeftUser ? (
                            <div className="user-video">
                                <UserVideoComponent streamManager={currentLeftUser.streamManager} />
                                <p className="user-name">{currentLeftUser.userName}</p>
                            </div>
                        ) : (
                            <p className="empty-slot">대기 중</p>
                        )}
                    </div>

                    {/* 오른쪽 참가자 */}
                    <div className={`right-video ${currentTurn === 'right' && currentRightUser ? 'active-speaker' : ''}`}>
                        {currentRightUser ? (
                            <div className="user-video">
                                <UserVideoComponent streamManager={currentRightUser.streamManager} />
                                <p className="user-name">{currentRightUser.userName}</p>
                            </div>
                        ) : (
                            <p className="empty-slot">대기 중</p>
                        )}
                    </div>
                </div>
            </div>
        );
