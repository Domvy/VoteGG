// src/components/Elements/openvidu/OpenviduFinal.js

import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import './OpenviduFinal.css';
import { triggerResetTimer } from '../../../stores/setTimerState';
import { useToast } from "../Toast/ToastContext";

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
        this.leaveSession = this.leaveSession.bind(this);
        this.startScreenShare = this.startScreenShare.bind(this);
        this.stopScreenShare = this.stopScreenShare.bind(this);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.leaveSession);

        // Timer에서 phaseChange 이벤트 처리
        window.handlePhaseChange = (newPhase, newTurn) => {
            this.setState(
                {
                    currentPhase: newPhase,
                    currentTurn: newTurn,
                },
                () => {
                    this.updateAudioStatus();
                }
            );
        };

        this.joinSession();
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.leaveSession);
        window.handlePhaseChange = null;
        this.leaveSession();
    }

    async joinSession() {
        const OV = new OpenVidu();
        const session = OV.initSession();


        // Handle phaseChange signal

        window.session = session;


        session.on("signal:phaseChange", (event) => {
            const data = JSON.parse(event.data);

            // 수신한 phase 값을 업데이트
            this.setState({
                currentPhase: data.currentPhase,
                currentTurn: data.currentTurn,
            }, () => {
                this.updateAudioStatus();
            });
        });

        // Handle userList signal
        session.on('signal:userList', (event) => {
            const data = JSON.parse(event.data);

            this.setState((prevState) => {
                const mergedLeftUserList = mergeUserLists(prevState.leftUserList, data.leftUserList || []);
                const mergedRightUserList = mergeUserLists(prevState.rightUserList, data.rightUserList || []);

                console.log('Updated user lists:', { leftUserList: mergedLeftUserList, rightUserList: mergedRightUserList });

                return {
                    leftUserList: mergedLeftUserList,
                    rightUserList: mergedRightUserList,
                };
            });
        });

        // Handle requestUserList signal
        session.on('signal:requestUserList', (event) => {
            // 자신의 사용자 리스트를 요청한 참가자에게 전송
            session.signal({
                data: JSON.stringify({
                    leftUserList: this.state.leftUserList,
                    rightUserList: this.state.rightUserList,
                }),
                to: [event.from],
                type: 'userList',
            });
        });

        // Handle streamCreated event
        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);

            // 연결 데이터에서 clientData 추출
            let data = event.stream.connection.data;
            let userName = 'Unknown';

            try {
                const parsedData = JSON.parse(data);
                userName = parsedData.clientData || 'Unknown';
            } catch (error) {
                console.warn('Error parsing connection data:', error);
            }

            const newSubscriber = {
                subscriber: subscriber,
                userName: userName,
                connectionId: event.stream.connection.connectionId,
            };

            console.log(`New subscriber added: ${userName}, Connection ID: ${newSubscriber.connectionId}`);
            console.log('Subscriber object:', subscriber);

            this.setState((prevState) => ({
                subscribers: [...prevState.subscribers, newSubscriber],
            }));
        });

        // Handle signal:toggleAudio
        session.on('signal:toggleAudio', (event) => {
            const data = JSON.parse(event.data);
            const shouldEnableAudio = data.enableAudio;
            const targetConnectionId = data.connectionId; // 특정 사용자에게만 적용

            console.log(`Received toggleAudio signal for connectionId: ${targetConnectionId}, enableAudio: ${shouldEnableAudio}`);

            // 로컬 사용자의 connectionId와 비교
            if (this.state.session && this.state.session.connection.connectionId === targetConnectionId) {
                if (this.state.publisher) {
                    this.state.publisher.publishAudio(shouldEnableAudio);
                    console.log(`Audio for user ${this.state.userName} set to ${shouldEnableAudio}`);
                }
            }
        });

        // Handle streamDestroyed event
        session.on('streamDestroyed', (event) => {
            const connectionId = event.stream.connection.connectionId;

            console.log(`Stream destroyed for Connection ID: ${connectionId}`);

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

                // 모든 참가자에게 업데이트된 사용자 리스트 전송
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

        // Handle exceptions
        session.on("exception", (exception) => {
            console.warn(exception);
        });

        const sessionId = this.props.sessionId; // 세션 ID
        const userName = this.state.userName; // 사용자 이름

        try {
            const token = await this.getToken(sessionId);
            await session.connect(token, { clientData: userName });
            console.log('Connected to session:', sessionId);
        } catch (error) {
            console.error('Error connecting to session:', error);
            return;
        }

        let publisher = null;

        if (!this.props.isObserver) {
        try {
            // 브라우저 호환성 확인
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                console.error('Media devices API is not supported in this browser.');
                return;
            }

            // 카메라와 마이크 권한 요청
            let cameraStream;
            try {
                cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                console.log('Camera and microphone permissions granted.');
            } catch (error) {
                console.error('Camera and microphone permission denied:', error);
                return;
            }

            // 장치 목록 가져오기
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log('Available video devices:', videoDevices);

            // 비디오 장치 유효성 검증
            if (videoDevices.length === 0) {
                console.error('No video input devices found');
                return;
            }

            const deviceId = videoDevices[0]?.deviceId; // 첫 번째 카메라 사용
            console.log('Using video device:', deviceId);

            // hiddenVideo 설정
            const hiddenVideo = document.createElement('video');
            hiddenVideo.style.position = 'absolute';
            hiddenVideo.style.top = '-9999px';
            hiddenVideo.style.left = '-9999px';
            document.body.appendChild(hiddenVideo);
            hiddenVideo.srcObject = cameraStream;
            hiddenVideo.muted = true; 
            hiddenVideo.playsInline = true;
            try {
                await hiddenVideo.play();
                console.log('hiddenVideo play started');
            } catch (err) {
                console.error('Error playing video:', err);
            }

            console.log('Camera tracks:', cameraStream.getVideoTracks());

            // 비디오가 로드되어 videoWidth, videoHeight를 얻을 수 있을 때까지 대기
            await new Promise((resolve) => {
                if (hiddenVideo.readyState >= hiddenVideo.HAVE_CURRENT_DATA) {
                    resolve();
                } else {
                    hiddenVideo.addEventListener('loadeddata', () => resolve(), { once: true });
                }
            });

            const streamWidth = hiddenVideo.videoWidth;
            const streamHeight = hiddenVideo.videoHeight;
            console.log(`Stream resolution: ${streamWidth}x${streamHeight}`);

            // 오버레이 이미지 위치 상태 (스트리밍 해상도 기준)
            let overlayX = 50;
            let overlayY = 50;
            let isDragging = false;
            let dragOffsetX = 0;
            let dragOffsetY = 0;

            // 오버레이 이미지 로드
            const overlayImage = new Image();
            overlayImage.src = '/resources/images/egg.png'; 
            await overlayImage.decode();

            // 숨겨진 캔버스(hiddenCanvas) 생성: 스트림 생성용
            const hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = streamWidth;
            hiddenCanvas.height = streamHeight;
            const hiddenCtx = hiddenCanvas.getContext('2d');

            function drawFrame() {
                hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    
                // 기존 비디오와 오버레이 이미지 그리기
                if (hiddenVideo.readyState >= hiddenVideo.HAVE_CURRENT_DATA) {
                    hiddenCtx.drawImage(hiddenVideo, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                }

                // 오버레이 이미지 그리기
                if (overlayImage.complete && overlayImage.naturalWidth > 0) {
                    hiddenCtx.drawImage(
                        overlayImage,
                        overlayX,
                        overlayY,
                        overlayImage._drawWidth || overlayImage.naturalWidth,
                        overlayImage._drawHeight || overlayImage.naturalHeight
                    );
                } else {
                    console.warn("Overlay image not ready to draw.");
                }

                requestAnimationFrame(drawFrame);
            }
            requestAnimationFrame(drawFrame);

            // hiddenCanvas로부터 스트림 확보
            const canvasStream = hiddenCanvas.captureStream(30);

            // 이벤트 전용 캔버스(eventCanvas) 생성: 마우스 이벤트만 처리 (투명)
            const eventCanvas = document.createElement('canvas');
            eventCanvas.width = streamWidth;
            eventCanvas.height = streamHeight;
            eventCanvas.style.position = 'absolute';
            eventCanvas.style.top = '0';
            eventCanvas.style.left = '0';
            eventCanvas.style.zIndex = 10000; // 다른 요소 위로
            eventCanvas.style.pointerEvents = 'auto';
            eventCanvas.style.background = 'transparent';

            // 비디오 컨테이너를 찾아 상대 위치 지정
            const videoContainer = document.querySelector('.video-container');
            if (!videoContainer) {
                console.error('No .video-container element found!');
                return;
            }
            videoContainer.style.position = 'relative';
            videoContainer.appendChild(eventCanvas);

            // 좌표 변환 함수: container -> streaming coords
            function toStreamCoords(mouseX, mouseY) {
                const scaleX = streamWidth / eventCanvas.width;
                const scaleY = streamHeight / eventCanvas.height;
                const streamingMouseX = mouseX * scaleX;
                const streamingMouseY = mouseY * scaleY;
                return { streamingMouseX, streamingMouseY };
            }

            // S3 업로드 함수 추가
            async function uploadImageToS3(file) {
                try {
                    // 프리사인드 URL 생성 요청
                    const presignedResponse = await axios.post(`${window.location.origin}/api/generate-presigned-url`, {
                        filename: file.name,
                        contentType: file.type,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
            
                    const { url: presignedUrl, key } = presignedResponse.data;
            
                    // S3로 이미지 업로드
                    const uploadResponse = await axios.put(presignedUrl, file, {
                        headers: { 'Content-Type': file.type },
                    });
            
                    if (uploadResponse.status === 200) {
                        const imageUrl = `https://${process.env.REACT_APP_AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
                        console.log('Image uploaded to S3:', imageUrl);
                        console.log('S3 Key:', key);
                        return imageUrl; // S3에 저장된 이미지 URL 반환
                    }
                } catch (error) {
                    console.error('Error uploading image to S3:', error);
                    throw error;
                }
            }
            
            // 캔버스 드래그 앤 드롭 이벤트 처리
            eventCanvas.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy'; // 드롭 효과 설정
            });
            
            eventCanvas.addEventListener('drop', async (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
            
                if (file && file.type.startsWith('image/')) {
                    console.log('File dropped:', file);
            
                    try {
                        // 이미지 파일을 S3에 업로드
                        const imageUrl = await uploadImageToS3(file);
                        
                        // 업로드된 이미지 URL로 overlayImage를 변경
                        overlayImage.crossOrigin = 'Anonymous'; // 크로스오리진 설정
                        overlayImage.src = `${imageUrl}?t=${Date.now()}`; // 캐싱 방지
                        overlayImage.onload = () => {
                            console.log('Overlay image updated to:', overlayImage.src);
                        
                            // 캔버스 초기화 및 재그리기
                            hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
                            hiddenCtx.drawImage(hiddenVideo, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                            hiddenCtx.drawImage(overlayImage, overlayX, overlayY);
                        
                            // 캔버스 스트림 재설정
                            const newCanvasStream = hiddenCanvas.captureStream(30);
                            publisher.replaceTrack(newCanvasStream.getVideoTracks()[0]).then(() => {
                                console.log('Stream updated with new overlay image.');
                            }).catch((error) => {
                                console.error('Failed to update stream:', error);
                            });
                        };
                        
                        overlayImage.onerror = () => {
                            console.error('Failed to load overlay image:', overlayImage.src);
                        };
                    } catch (error) {
                        console.error('Error handling dropped file:', error);
                    }
                } else {
                    console.warn('Dropped file is not a valid image');
                }
            });

            // 팝업 메뉴 생성
            const contextMenu = document.createElement('div');
            contextMenu.style.position = 'absolute';
            contextMenu.style.display = 'none';
            contextMenu.style.backgroundColor = '#fff';
            contextMenu.style.border = '1px solid #ccc';
            contextMenu.style.padding = '8px';
            contextMenu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
            contextMenu.style.cursor = 'pointer';
            contextMenu.innerText = '삭제';
            contextMenu.style.zIndex = '10000';
            document.body.appendChild(contextMenu);

            // 팝업 메뉴 내용 초기화
            contextMenu.innerHTML = `
            <div style="margin-bottom: 10px;">
                <div style="margin-bottom: 5px;">
                    <label>
                        가로:
                        <input type="number" id="overlayWidth" style="width: 60px;" />
                    </label>
                </div>
                <div style="margin-bottom: 5px;">
                    <label>
                        세로:
                        <input type="number" id="overlayHeight" style="width: 60px;" />
                    </label>
                </div>
                <div style="margin-bottom: 10px;">
                    <button id="resizeButton" style="display: block; width: 100%;">변경하기</button>
                </div>
                <div>
                    <button id="deleteButton" style="display: block; width: 100%; color: red;">삭제하기</button>
                </div>
            </div>
            `;

            // 팝업 메뉴 이벤트 추가
            const resizeButton = document.getElementById('resizeButton');
            const deleteButton = document.getElementById('deleteButton');
            const overlayWidthInput = document.getElementById('overlayWidth');
            const overlayHeightInput = document.getElementById('overlayHeight');

            // 마우스 우클릭 이벤트 처리
            eventCanvas.addEventListener('contextmenu', (e) => {
                // 마우스 좌표를 캔버스 좌표로 변환
                const rect = eventCanvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
            
                // 마우스 위치가 오버레이 이미지 영역 내에 있는지 확인
                const isInsideOverlay =
                    overlayImage.src &&
                    overlayImage.src !== '' &&
                    mouseX >= overlayX &&
                    mouseX <= overlayX + overlayImage.width &&
                    mouseY >= overlayY &&
                    mouseY <= overlayY + overlayImage.height;
            
                if (isInsideOverlay) {
                    e.preventDefault(); // 기본 브라우저 우클릭 메뉴 막기
            
                    console.log('Showing custom context menu');
            
                    // 팝업 메뉴 위치 설정
                    const menuX = e.clientX;
                    const menuY = e.clientY;
            
                    contextMenu.style.top = `${menuY}px`;
                    contextMenu.style.left = `${menuX}px`;
                    contextMenu.style.display = 'block';

                    // 현재 오버레이 크기를 입력 필드에 표시
                    overlayWidthInput.value = overlayImage._drawWidth || overlayImage.naturalWidth;
                    overlayHeightInput.value = overlayImage._drawHeight || overlayImage.naturalHeight;
                } else {
                    console.log('Outside overlay image. Showing default context menu');
                    contextMenu.style.display = 'none'; // 커스텀 팝업 숨기기
                    // 기본 브라우저 우클릭 메뉴 허용 (아무것도 하지 않음)
                }
            });

            // 크기 조절 버튼 클릭 이벤트
            resizeButton.addEventListener('click', () => {
                const newWidth = parseInt(overlayWidthInput.value, 10);
                const newHeight = parseInt(overlayHeightInput.value, 10);

                console.log('Input Values:', { newWidth, newHeight });

                if (!isNaN(newWidth) && newWidth > 0 && !isNaN(newHeight) && newHeight > 0) {
                    overlayImage._drawWidth = newWidth;
                    overlayImage._drawHeight = newHeight;

                    console.log('Overlay dimensions set to:', {
                        width: overlayImage._drawWidth,
                        height: overlayImage._drawHeight,
                    });

                    redrawCanvas();
                } else {
                    console.warn('Invalid size inputs');
                }

                contextMenu.style.display = 'none'; // 팝업 닫기
            });

            // 캔버스 다시 그리기 함수
            function redrawCanvas() {
                // 캔버스 초기화
                hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

                // 비디오 스트림을 먼저 그리기
                if (hiddenVideo.readyState >= hiddenVideo.HAVE_CURRENT_DATA) {
                    hiddenCtx.drawImage(hiddenVideo, 0, 0, hiddenCanvas.width, hiddenCanvas.height);
                }

                // 오버레이 이미지가 있으면 크기와 위치에 맞게 그리기
                if (overlayImage.src && overlayImage.src !== '') {
                    if (!overlayImage._drawWidth || !overlayImage._drawHeight) {
                        overlayImage._drawWidth = overlayImage.naturalWidth;
                        overlayImage._drawHeight = overlayImage.naturalHeight;
                    }

                    console.log('Redrawing overlay image with dimensions:', {
                        width: overlayImage._drawWidth,
                        height: overlayImage._drawHeight,
                        x: overlayX,
                        y: overlayY,
                    });

                    hiddenCtx.drawImage(
                        overlayImage,
                        overlayX,
                        overlayY,
                        overlayImage._drawWidth,
                        overlayImage._drawHeight
                    );

                    // 디버깅용 캔버스 데이터를 출력
                    const imageData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
                    console.log('Canvas imageData after drawImage:', imageData);
                }
            }

            // 삭제 버튼 클릭 이벤트
            deleteButton.addEventListener('click', () => {
                console.log('Removing overlay image');
                overlayImage.src = ''; // 이미지 제거
                overlayX = 0;
                overlayY = 0;

                // 캔버스 초기화
                hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
                hiddenCtx.drawImage(hiddenVideo, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

                contextMenu.style.display = 'none'; // 팝업 닫기
            });

            // 팝업 내부 클릭 시 이벤트 전파 방지
            contextMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // 팝업 외부 클릭 시 닫기
            document.addEventListener('click', (e) => {
                if (!contextMenu.contains(e.target)) {
                    contextMenu.style.display = 'none';
                }
            });

            // 이벤트 핸들러
            eventCanvas.addEventListener('mousedown', (e) => {
                console.log("mousedown!!");
                const rect = eventCanvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // 마우스 좌표를 스트리밍 해상도 좌표로 변환
                const { streamingMouseX, streamingMouseY } = toStreamCoords(mouseX, mouseY);

                if (
                    streamingMouseX >= overlayX && streamingMouseX <= overlayX + overlayImage.width &&
                    streamingMouseY >= overlayY && streamingMouseY <= overlayY + overlayImage.height
                ) {
                    isDragging = true;
                    dragOffsetX = streamingMouseX - overlayX;
                    dragOffsetY = streamingMouseY - overlayY;
                }
            });

            eventCanvas.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const rect = eventCanvas.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    const { streamingMouseX, streamingMouseY } = toStreamCoords(mouseX, mouseY);
                    overlayX = streamingMouseX - dragOffsetX;
                    overlayY = streamingMouseY - dragOffsetY;
                }
            });

            eventCanvas.addEventListener('mouseup', () => {
                console.log("mouseup!!");
                isDragging = false;
            });

            eventCanvas.addEventListener('mouseleave', () => {
                isDragging = false;
            });

            // 퍼블리셔 생성 시 hiddenCanvas 스트림을 비디오 소스로 사용 (원본 해상도 유지)
            publisher = await OV.initPublisherAsync(undefined, {
                audioSource: cameraStream.getAudioTracks()[0],
                videoSource: canvasStream.getVideoTracks()[0],
                publishAudio: true,
                publishVideo: true,
                resolution: `${streamWidth}x${streamHeight}`, 
                frameRate: 30,
                mirror: false,
                audioProcessing: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                }
            });

            // 초기 오디오 비활성화
            publisher.publishAudio(false); 
            session.publish(publisher);
            console.log(`Published composite (camera+overlay) stream for user: ${this.state.userName}`);

        } catch (error) {
            console.error('Error initializing publisher:', error);
        }
    }

        this.setState({
            session: session,
            publisher: publisher,
            mainStreamManager: publisher,
        }, () => {
            const connectionId = session.connection.connectionId;
            const newUser = { connectionId, userName };

            // 다른 참가자들에게 사용자 리스트 요청
            session.signal({
                type: 'requestUserList',
            });

            // 1초 후에 사용자 리스트 확인 및 자신의 정보 추가
            setTimeout(() => {
                this.assignUserToGroup(newUser);
            }, 1000);
        });
    }

    assignUserToGroup(newUser) {
        this.setState((prevState) => {
            let leftUserList = [...prevState.leftUserList];
            let rightUserList = [...prevState.rightUserList];

            // 이미 리스트에 존재하는지 확인
            const existsInLeft = leftUserList.some(user => user.connectionId === newUser.connectionId);
            const existsInRight = rightUserList.some(user => user.connectionId === newUser.connectionId);

            if (existsInLeft || existsInRight) {
                console.log(`User already exists in a group: ${newUser.userName}, Connection ID: ${newUser.connectionId}`);
                return null;
            }

            if (leftUserList.length < 2 && !this.props.isObserver) {
                leftUserList.push(newUser);
                console.log('Added to leftUserList:', newUser);
            } else if (rightUserList.length < 2 && !this.props.isObserver) {
                rightUserList.push(newUser);
                console.log('Added to rightUserList:', newUser);
            } else {
                // alert('Observer');
                // 옵저버로 전환하는 로직 필요 시 추가
                return null;
            }

            // 모든 참가자에게 업데이트된 사용자 리스트 전송
            this.state.session.signal({
                data: JSON.stringify({ leftUserList, rightUserList }),
                type: 'userList',
            });

            return {
                leftUserList,
                rightUserList,
            };
        }, () => {
            // 상태 업데이트 후 마이크 상태 업데이트
            this.updateAudioStatus();
        });
    }

    handleTurnChange = () => {
        const { session, currentPhase, currentTurn } = this.state;
        let newPhase = currentPhase;
        let newTurn = currentTurn;

        if (currentTurn === 'left') {
            newTurn = 'right';
        } else {
            // 양측 참가자들의 발언이 끝나면 다음 phase로 이동
            newTurn = 'left';
            newPhase = currentPhase === 1 ? 2 : 1; // Phase를 1과 2 사이에서 변경
        }

        // 새로운 phase와 turn을 모든 참가자에게 브로드캐스트
        if (session) {
            session.signal({
                type: 'phaseChange',
                data: JSON.stringify({ currentPhase: newPhase, currentTurn: newTurn }),
            });
            console.log(`Broadcasted phaseChange signal: Phase ${newPhase}, Turn ${newTurn}`);
        }

        // 타이머 초기화 등 필요한 작업 수행 (필요한 경우)
        triggerResetTimer();

        // 상태 업데이트
        this.setState({
            currentPhase: newPhase,
            currentTurn: newTurn,
        }, () => {
            this.updateAudioStatus();
        });
    };

    leaveSession() {
        const { session } = this.state;
        if (session) {
            session.disconnect();
            console.log('Disconnected from session');
        }

        // OpenVidu 객체 해제
        if (this.OV) {
            this.OV = null;
        }

        // 상태 초기화
        this.setState({
            session: undefined,
            publisher: undefined,
            mainStreamManager: undefined,
            subscribers: [],
            leftUserList: [],
            rightUserList: [],
        });
    }

    async startScreenShare() {
        const { session, publisher } = this.state;

        if (!session || !publisher) {
            console.error("Session or publisher not initialized");
            return;
        }

        // 기존 퍼블리셔 unpublish
        session.unpublish(publisher);
        console.log('Unpublished existing publisher for screen sharing');

        const OV = new OpenVidu();
        let screenPublisher = null;

        try {
            screenPublisher = await OV.initPublisherAsync(undefined, {
                videoSource: "screen",
                audioSource: undefined,
                publishAudio: false,
                publishVideo: true,
            });
            console.log('Initialized screen publisher');
        } catch (error) {
            console.error('Error initializing screen publisher:', error);
            // 기존 퍼블리셔 복원
            session.publish(publisher);
            console.log('Restored original publisher after screen share initialization failure');
            return;
        }

        try {
            session.publish(screenPublisher);
            this.setState({
                publisher: screenPublisher,
                mainStreamManager: screenPublisher,
                isSharingScreen: true,
            });
            console.log('Published screen share stream');
        } catch (error) {
            console.error('Error publishing screen share:', error);
            // 기존 퍼블리셔 복원
            session.publish(publisher);
            console.log('Restored original publisher after screen share publishing failure');
        }
    }

    stopScreenShare() {
        const { session, publisher } = this.state;

        if (!session || !publisher) {
            console.error("Session or publisher not initialized");
            return;
        }

        // 화면 공유 퍼블리셔 unpublish
        session.unpublish(publisher);
        console.log('Unpublished screen share publisher');

        // 화면 공유 퍼블리셔의 트랙 중지
        publisher.stream.getMediaStream().getTracks().forEach((track) => track.stop());
        console.log('Stopped all tracks of screen share publisher');

        const OV = new OpenVidu();
        let cameraPublisher = null;

        OV.initPublisherAsync(undefined, {
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
        }).then((pub) => {
            cameraPublisher = pub;
            session.publish(cameraPublisher);
            console.log('Published camera stream after stopping screen share');

            this.setState({
                publisher: cameraPublisher,
                mainStreamManager: cameraPublisher,
                isSharingScreen: false,
            });
        }).catch((error) => {
            console.error('Error initializing camera publisher after stopping screen share:', error);
        });
    }

    updateAudioStatus = () => {
        const { currentPhase, currentTurn, leftUserList, rightUserList, session } = this.state;

        if (!session) return;

        const localConnectionId = session.connection.connectionId;
        let shouldEnableAudio = false;

        // 현재 발언자인지 확인
        if (currentTurn === 'left') {
            const currentLeftUser = leftUserList[currentPhase - 1];
            if (currentLeftUser && currentLeftUser.connectionId === localConnectionId) {
                shouldEnableAudio = true;
            }
        } else {
            const currentRightUser = rightUserList[currentPhase - 1];
            if (currentRightUser && currentRightUser.connectionId === localConnectionId) {
                shouldEnableAudio = true;
            }
        }

        // 로컬 사용자의 오디오 상태만 변경
        if (this.state.publisher) {
            this.state.publisher.publishAudio(shouldEnableAudio);
            console.log(`User ${this.state.userName} audio set to ${shouldEnableAudio}`);
        }
    };

    async getToken(sessionId) {
        const session = await this.createSession(sessionId);
        return await this.createToken(sessionId);
    }

    async createSession(sessionId) {
        try {
            const response = await axios.post(
                `${APPLICATION_SERVER_URL}api/sessions`,
                { customSessionId: sessionId },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log('Created session:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }

    async createToken(sessionId) {
        try {
            const response = await axios.post(
                `${APPLICATION_SERVER_URL}api/sessions/${sessionId}/connections`,
                {},
                { headers: { "Content-Type": "application/json" } }
            );
            console.log('Created token:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating token:', error);
            throw error;
        }
    }

    render() {
        const { mainStreamManager, subscribers, isSharingScreen, leftUserList, rightUserList, currentPhase, currentTurn, session } = this.state;

        // 현재 세션의 모든 사용자 (본인 포함)
        const allStreamManagers = [];
        // 본인의 connectionId
        const localConnectionId = session?.connection?.connectionId;

        // 본인의 스트림 매니저 추가
        if (mainStreamManager && localConnectionId) {
            allStreamManagers.push({
                connectionId: localConnectionId,
                streamManager: mainStreamManager,
                userName: this.state.userName,
            });
            console.log(`Added mainStreamManager: ${localConnectionId}`);
        }

        // 구독자 스트림 추가
        subscribers.forEach((sub) => {
            allStreamManagers.push({
                connectionId: sub.connectionId,
                streamManager: sub.subscriber,
                userName: sub.userName,
            });
            console.log(`Added subscriber: ${sub.userName}, Connection ID: ${sub.connectionId}`);
        });

        // 좌측 및 우측 사용자 스트림 매니저 매핑
        const leftStreamManagers = leftUserList.map((user) => {
            const manager = allStreamManagers.find((manager) => manager.connectionId === user.connectionId);
            if (!manager) {
                console.warn(`No streamManager found for Connection ID: ${user.connectionId}`);
            }
            return manager;
        }).filter(Boolean);

        const rightStreamManagers = rightUserList.map((user) => {
            const manager = allStreamManagers.find((manager) => manager.connectionId === user.connectionId);
            if (!manager) {
                console.warn(`No streamManager found for Connection ID: ${user.connectionId}`);
            }
            return manager;
        }).filter(Boolean);

        // 현재 phase의 참가자들
        const currentLeftUser = leftStreamManagers[currentPhase - 1];
        const currentRightUser = rightStreamManagers[currentPhase - 1];

        // 현재 발언자 connectionId 계산
        const currentSpeakerConnectionId = currentTurn === 'left'
            ? currentLeftUser?.connectionId
            : currentRightUser?.connectionId;

        // 현재 사용자가 발언자인지 확인
        const isCurrentUserSpeaker = localConnectionId === currentSpeakerConnectionId;


        return (
            <div>
                <div className="openvidu-final">
                    <div className="video-container">
                        {/* 왼쪽 참가자 */}
                        <div className={`left-video ${currentTurn === 'left' && currentLeftUser ? 'active-speaker' : 'none-active-speaker'}`}>
                            {currentLeftUser ? (
                                <div className="user-video">
                                    <UserVideoComponent
                                        streamManager={currentLeftUser.streamManager}
                                        localConnectionId={localConnectionId} // 로컬 connectionId 전달
                                    />
                                    <p className="user-name">{currentLeftUser.userName} 님</p>
                                    {currentTurn === 'left' && <img className="active-speaker-image" src="/resources/images/radio.png" alt="Active Speaker" />}
                                </div>
                            ) : (
                                <img className="empty-slot" src="/unknown.png" />
                            )}
                        </div>

                        {/* 오른쪽 참가자 */}
                        <div className={`right-video ${currentTurn === 'right' && currentRightUser ? 'active-speaker' : 'none-active-speaker'}`}>
                            {currentRightUser ? (
                                <div className="user-video">
                                    <UserVideoComponent
                                        streamManager={currentRightUser.streamManager}
                                        localConnectionId={localConnectionId} // 로컬 connectionId 전달
                                    />
                                    <p className="user-name">{currentRightUser.userName} 님</p>
                                    {currentTurn === 'right' && <img className="active-speaker-image" src="/resources/images/radio.png" alt="Active Speaker" />}
                                </div>
                            ) : (
                                <img className="empty-slot" src="/unknown.png" />
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    {/* 화면 공유 및 방 나가기 버튼 */}
                    {!this.props.isObserver && (
                        <div className="button-container">
                            <button
                                className="screen-share-button"
                                onClick={isSharingScreen ? this.stopScreenShare : this.startScreenShare}
                                style={{ background: "none", border: "none", padding: 0 }}
                            >
                                <img
                                    src={isSharingScreen ? "/Buttonimg/stopshare.png" : "/Buttonimg/share.png"}
                                    alt={isSharingScreen ? "Stop Screen Sharing" : "Start Screen Sharing"}
                                    style={{ width: "50px", height: "50px" }}
                                />
                            </button>
                            {isCurrentUserSpeaker ? (
                                <div className="phase-controls">
                                    <img
                                        src="/Buttonimg/leaveroom.png" // 발언자일 때 보일 이미지 경로
                                        alt="다음 차례"
                                        onClick={this.handleTurnChange} // 클릭 시 handleTurnChange 호출
                                        className="phase-controls__button phase-controls__button--active" // 스타일 추가
                                    />
                                </div>
                            ) : (
                                <div className="phase-controls">
                                    <img
                                        src="/Buttonimg/leaveroom.png" // 발언자가 아닐 때 보일 이미지 경로
                                        alt="기다리는 중."
                                        className="phase-controls__button phase-controls__button--inactive" // 스타일 추가
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default OpenviduFinal;

// 리스트 병합 함수
function mergeUserLists(list1, list2) {
    const combined = [...list1, ...list2];
    const uniqueUsers = combined.reduce((acc, current) => {
        const x = acc.find(item => item.connectionId === current.connectionId);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);
    return uniqueUsers;
}