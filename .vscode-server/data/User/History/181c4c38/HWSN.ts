import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
import { OpenVidu } from 'openvidu-browser/lib/OpenVidu/OpenVidu';
import { Publisher } from 'openvidu-browser/lib/OpenVidu/Publisher';
import { Stream } from 'openvidu-browser/lib/OpenVidu/Stream';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
import { Subscriber } from 'openvidu-browser/lib/OpenVidu/Subscriber';
import { Capabilities } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/Capabilities';
import { EventDispatcher } from 'openvidu-browser/lib/OpenVidu/EventDispatcher';
import { SignalOptions } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/SignalOptions';
import { SubscriberProperties } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/SubscriberProperties';
import { RemoteConnectionOptions } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Private/RemoteConnectionOptions';
import { SessionOptions } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Private/SessionOptions';
import { SessionEventMap } from 'openvidu-browser/lib/OpenViduInternal/Events/EventMap/SessionEventMap';
import { OpenViduError } from 'openvidu-browser/lib/OpenViduInternal/Enums/OpenViduError';
import { StreamPropertyChangedEventReason, ChangedPropertyType, RecordingEventReason, ConnectionEventReason, StreamEventReason } from 'openvidu-browser/lib/OpenViduInternal/Events/Types/Types';
/**
 * Represents a video call. It can also be seen as a videoconference room where multiple users can connect.
 * Participants who publish their videos to a session can be seen by the rest of users connected to that specific session.
 * Initialized with {@link OpenVidu.initSession} method.
 *
 * See available event listeners at {@link SessionEventMap}.
 */
export declare class Session extends EventDispatcher {
    /**
     * Local connection to the Session. This object is defined only after {@link Session.connect} has been successfully executed, and can be retrieved subscribing to `connectionCreated` event
     */
    connection: Connection;
    /**
     * Unique identifier of the Session
     */
    sessionId: string;
    /**
     * Collection of all StreamManagers of this Session ({@link Publisher} and {@link Subscriber})
     */
    streamManagers: StreamManager[];
    /**
     * Object defining the methods that the client is able to call. These are defined by the {@link Connection.role}.
     * This object is only defined after {@link Session.connect} has been successfully resolved
     */
    capabilities: Capabilities;
    /**
     * @hidden
     */
    remoteStreamsCreated: Map<string, boolean>;
    /**
     * @hidden
     */
    remoteConnections: Map<string, Connection>;
    /**
     * @hidden
     */
    openvidu: OpenVidu;
    /**
     * @hidden
     */
    options: SessionOptions;
    /**
     * @hidden
     */
    token: string;
    /**
     * @hidden
     */
    private videoDataInterval;
    /**
     * @hidden
     */
    private videoDataTimeout;
    /**
     * @hidden
     */
    constructor(openvidu: OpenVidu);
    connect(token: string): Promise<any>;
    connect(token: string, metadata: any): Promise<any>;
    /**
     * Leaves the session, destroying all streams and deleting the user as a participant.
     *
     * #### Events dispatched
     *
     * The {@link Session} object of the local participant will dispatch a `sessionDisconnected` event.
     * This event will automatically unsubscribe the leaving participant from every Subscriber object of the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks)
     * and also deletes any HTML video element associated to each Subscriber (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, each Subscriber object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `sessionDisconnected` to avoid this behavior and take care of disposing and cleaning all the Subscriber objects yourself.
     * See {@link SessionDisconnectedEvent} and {@link VideoElementEvent} to learn more.
     *
     * The {@link Publisher} object of the local participant will dispatch a `streamDestroyed` event if there is a {@link Publisher} object publishing to the session.
     * This event will automatically stop all media tracks and delete any HTML video element associated to it (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Publisher object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` if you want to clean the Publisher object on your own or re-publish it in a different Session (to do so it is a mandatory requirement to call `Session.unpublish()`
     * or/and `Session.disconnect()` in the previous session). See {@link StreamEvent} and {@link VideoElementEvent} to learn more.
     *
     * The {@link Session} object of every other participant connected to the session will dispatch a `streamDestroyed` event if the disconnected participant was publishing.
     * This event will automatically unsubscribe the Subscriber object from the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks)
     * and also deletes any HTML video element associated to that Subscriber (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Subscriber object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` to avoid this default behavior and take care of disposing and cleaning the Subscriber object yourself.
     * See {@link StreamEvent} and {@link VideoElementEvent} to learn more.
     *
     * The {@link Session} object of every other participant connected to the session will dispatch a `connectionDestroyed` event in any case. See {@link ConnectionEvent} to learn more.
     */
    disconnect(): void;
    subscribe(stream: Stream, targetElement: string | HTMLElement | undefined): Subscriber;
    subscribe(stream: Stream, targetElement: string | HTMLElement | undefined, properties: SubscriberProperties): Subscriber;
    subscribe(stream: Stream, targetElement: string | HTMLElement | undefined, completionHandler: (error: Error | undefined) => void): Subscriber;
    subscribe(stream: Stream, targetElement: string | HTMLElement | undefined, properties: SubscriberProperties, completionHandler: (error: Error | undefined) => void): Subscriber;
    /**
     * Promisified version of {@link Session.subscribe}
     */
    subscribeAsync(stream: Stream, targetElement: string | HTMLElement): Promise<Subscriber>;
    subscribeAsync(stream: Stream, targetElement: string | HTMLElement, properties: SubscriberProperties): Promise<Subscriber>;
    /**
     * Unsubscribes from `subscriber`, automatically removing its associated HTML video elements.
     *
     * #### Events dispatched
     *
     * The {@link Subscriber} object will dispatch a `videoElementDestroyed` event for each video associated to it that was removed from DOM.
     * Only videos [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)) will be automatically removed
     *
     * See {@link VideoElementEvent} to learn more
     */
    unsubscribe(subscriber: Subscriber): Promise<void>;
    /**
     * Publishes to the Session the Publisher object
     *
     * #### Events dispatched
     *
     * The local {@link Publisher} object will dispatch a `streamCreated` event upon successful termination of this method. See {@link StreamEvent} to learn more.
     *
     * The local {@link Publisher} object will dispatch a `streamPlaying` once the media stream starts playing. See {@link StreamManagerEvent} to learn more.
     *
     * The {@link Session} object of every other participant connected to the session will dispatch a `streamCreated` event so they can subscribe to it. See {@link StreamEvent} to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved only after the publisher was successfully published and rejected with an Error object if not
     */
    publish(publisher: Publisher): Promise<void>;
    /**
     * Unpublishes from the Session the Publisher object.
     *
     * #### Events dispatched
     *
     * The {@link Publisher} object of the local participant will dispatch a `streamDestroyed` event.
     * This event will automatically stop all media tracks and delete any HTML video element associated to this Publisher
     * (only those videos [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Publisher object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` if you want to clean the Publisher object on your own or re-publish it in a different Session.
     *
     * The {@link Session} object of every other participant connected to the session will dispatch a `streamDestroyed` event.
     * This event will automatically unsubscribe the Subscriber object from the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks) and
     * delete any HTML video element associated to it (only those [created by OpenVidu Browser](/en/stable/cheatsheet/manage-videos/#let-openvidu-take-care-of-the-video-players)).
     * For every video removed, the Subscriber object will dispatch a `videoElementDestroyed` event.
     * Call `event.preventDefault()` upon event `streamDestroyed` to avoid this default behavior and take care of disposing and cleaning the Subscriber object on your own.
     *
     * See {@link StreamEvent} and {@link VideoElementEvent} to learn more.
     */
    unpublish(publisher: Publisher): Promise<void>;
    /**
     * Forces some user to leave the session
     *
     * #### Events dispatched
     *
     * The behavior is the same as when some user calls {@link Session.disconnect}, but `reason` property in all events will be `"forceDisconnectByUser"`.
     *
     * The {@link Session} object of every participant will dispatch a `streamDestroyed` event if the evicted user was publishing a stream, with property `reason` set to `"forceDisconnectByUser"`.
     * The {@link Session} object of every participant except the evicted one will dispatch a `connectionDestroyed` event for the evicted user, with property `reason` set to `"forceDisconnectByUser"`.
     *
     * If any, the {@link Publisher} object of the evicted participant will also dispatch a `streamDestroyed` event with property `reason` set to `"forceDisconnectByUser"`.
     * The {@link Session} object of the evicted participant will dispatch a `sessionDisconnected` event with property `reason` set to `"forceDisconnectByUser"`.
     *
     * See {@link StreamEvent}, {@link ConnectionEvent} and {@link SessionDisconnectedEvent} to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved only after the participant has been successfully evicted from the session and rejected with an Error object if not
     */
    forceDisconnect(connection: Connection): Promise<void>;
    /**
     * Forces some user to unpublish a Stream
     *
     * #### Events dispatched
     *
     * The behavior is the same as when some user calls {@link Session.unpublish}, but `reason` property in all events will be `"forceUnpublishByUser"`
     *
     * The {@link Session} object of every participant will dispatch a `streamDestroyed` event with property `reason` set to `"forceDisconnectByUser"`
     *
     * The {@link Publisher} object of the affected participant will also dispatch a `streamDestroyed` event with property `reason` set to `"forceDisconnectByUser"`
     *
     * See {@link StreamEvent} to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved only after the remote Stream has been successfully unpublished from the session and rejected with an Error object if not
     */
    forceUnpublish(stream: Stream): Promise<void>;
    /**
     * Sends one signal. `signal` object has the following optional properties:
     * ```json
     * {data:string, to:Connection[], type:string}
     * ```
     * All users subscribed to that signal (`session.on('signal:type', ...)` or `session.on('signal', ...)` for all signals) and whose Connection objects are in `to` array will receive it. Their local
     * Session objects will dispatch a `signal` or `signal:type` event. See {@link SignalEvent} to learn more.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the message successfully reached openvidu-server and rejected with an Error object if not. _This doesn't
     * mean that openvidu-server could resend the message to all the listed receivers._
     */
    signal(signal: SignalOptions): Promise<void>;
    /**
     * Subscribe to the Speech-To-Text events for this {@link Stream}. The Session object will emit {@link SpeechToTextEvent} for the Stream
     * when speech is detected in its audio track.
     *
     * @param stream - The Stream for which you want to start receiving {@link SpeechToTextEvent}.
     * @param lang - The language of the Stream's audio track. It must be a valid [BCP-47](https://tools.ietf.org/html/bcp47) language tag like "en-US" or "es-ES".
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the speech-to-text subscription
     * was successful and rejected with an Error object if not.
     */
    subscribeToSpeechToText(stream: Stream, lang: string): Promise<void>;
    /**
     * Unsubscribe from the Speech-To-Text events for this {@link Stream}.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the speech-to-text subscription
     * was successful and rejected with an Error object if not.
     */
    unsubscribeFromSpeechToText(stream: Stream): Promise<void>;
    /**
     * See {@link EventDispatcher.on}
     */
    on<K extends keyof SessionEventMap>(type: K, handler: (event: SessionEventMap[K]) => void): this;
    /**
     * See {@link EventDispatcher.once}
     */
    once<K extends keyof SessionEventMap>(type: K, handler: (event: SessionEventMap[K]) => void): this;
    /**
     * See {@link EventDispatcher.off}
     */
    off<K extends keyof SessionEventMap>(type: K, handler?: (event: SessionEventMap[K]) => void): this;
    /**
     * @hidden
     */
    onParticipantJoined(event: RemoteConnectionOptions): void;
    /**
     * @hidden
     */
    onParticipantLeft(event: {
        connectionId: string;
        reason: ConnectionEventReason;
    }): void;
    /**
     * @hidden
     */
    onParticipantPublished(event: RemoteConnectionOptions): void;
    /**
     * @hidden
     */
    onParticipantUnpublished(event: {
        connectionId: string;
        reason: StreamEventReason;
    }): void;
    /**
     * @hidden
     */
    onParticipantEvicted(event: {
        connectionId: string;
        reason: ConnectionEventReason;
    }): void;
    /**
     * @hidden
     */
    onNewMessage(event: {
        type?: string;
        data?: string;
        from?: string;
    }): void;
    /**
     * @hidden
     */
    onStreamPropertyChanged(event: {
        connectionId: string;
        streamId: string;
        property: ChangedPropertyType;
        newValue: any;
        reason: StreamPropertyChangedEventReason;
    }): void;
    /**
     * @hidden
     */
    onConnectionPropertyChanged(event: {
        property: string;
        newValue: any;
    }): void;
    /**
     * @hidden
     */
    onNetworkQualityLevelChangedChanged(event: {
        connectionId: string;
        newValue: number;
        oldValue: number;
    }): void;
    /**
     * @hidden
     */
    recvIceCandidate(event: {
        senderConnectionId: string;
        endpointName: string;
        sdpMLineIndex: number;
        sdpMid: string;
        candidate: string;
    }): void;
    /**
     * @hidden
     */
    onSessionClosed(msg: any): void;
    /**
     * @hidden
     */
    onLostConnection(reason: ConnectionEventReason): void;
    /**
     * @hidden
     */
    onRecoveredConnection(): void;
    /**
     * @hidden
     */
    onMediaError(event: {
        error: string;
    }): void;
    /**
     * @hidden
     */
    onRecordingStarted(event: {
        id: string;
        name: string;
    }): void;
    /**
     * @hidden
     */
    onRecordingStopped(event: {
        id: string;
        name: string;
        reason: RecordingEventReason;
    }): void;
    /**
     * @hidden
     */
    onFilterEventDispatched(event: {
        connectionId: string;
        streamId: string;
        filterType: string;
        eventType: string;
        data: string;
    }): void;
    /**
     * @hidden
     */
    onForciblyReconnectSubscriber(event: {
        connectionId: string;
        streamId: string;
        sdpOffer: string;
    }): Promise<void>;
    /**
     * @hidden
     */
    reconnectBrokenStreams(): void;
    /**
     * @hidden
     */
    onSpeechToTextMessage(event: {
        timestamp?: Date;
        streamId: string;
        connectionId: string;
        sessionId: string;
        text: string;
        reason: string;
        raw: string;
        lang: string;
    }): Promise<void>;
    /**
     * @hidden
     */
    onSpeechToTextDisconnected(event: {
        message: string;
    }): Promise<void>;
    /**
     * @hidden
     */
    emitEvent(type: string, eventArray: any[]): void;
    /**
     * @hidden
     */
    leave(forced: boolean, reason: ConnectionEventReason): void;
    /**
     * @hidden
     */
    initializeParams(token: string): {
        token: string;
        session: string;
        platform: string;
        sdkVersion: string;
        metadata: string;
        secret: string;
        recorder: boolean;
        stt: boolean;
    };
    /**
     * @hidden
     */
    sendVideoData(streamManager: StreamManager, intervalSeconds?: number, doInterval?: boolean, maxLoops?: number): void;
    /**
     * @hidden
     */
    sessionConnected(): boolean;
    /**
     * @hidden
     */
    notConnectedError(): OpenViduError;
    /**
     * @hidden
     */
    anySpeechEventListenerEnabled(event: string, onlyOnce: boolean, streamManager?: StreamManager): boolean;
    /**
     * @hidden
     */
    getTokenParams(token: string): {
        sessionId: any;
        secret: any;
        recorder: any;
        stt: any;
        webrtcStatsInterval: any;
        sendBrowserLogs: any;
        edition: any;
        wsUri: string;
        httpUri: string;
    };
    private connectAux;
    private stopPublisherStream;
    private stopVideoDataIntervals;
    private stringClientMetadata;
    protected getConnection(connectionId: string, errorMessage: string): Promise<Connection>;
    private getRemoteConnection;
    private processToken;
    private processJoinRoomResponse;
}
