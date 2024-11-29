/// <reference types="node" />
import { OpenVidu } from 'openvidu-browser/lib/OpenVidu/OpenVidu';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
import { PublisherProperties } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/PublisherProperties';
import { PublisherEventMap } from 'openvidu-browser/lib/OpenViduInternal/Events/EventMap/PublisherEventMap';
/**
 * Packs local media streams. Participants can publish it to a session. Initialized with {@link OpenVidu.initPublisher} method.
 *
 * See available event listeners at {@link PublisherEventMap}.
 */
export declare class Publisher extends StreamManager {
    /**
     * Whether the Publisher has been granted access to the requested input devices or not
     */
    accessAllowed: boolean;
    /**
     * Whether you have called {@link Publisher.subscribeToRemote} with value `true` or `false` (*false* by default)
     */
    isSubscribedToRemote: boolean;
    /**
     * The {@link Session} to which the Publisher belongs
     */
    session: Session;
    private accessDenied;
    protected properties: PublisherProperties;
    private permissionDialogTimeout;
    /**
     * @hidden
     */
    openvidu: OpenVidu;
    /**
     * @hidden
     */
    videoReference: HTMLVideoElement;
    /**
     * @hidden
     */
    screenShareResizeInterval: NodeJS.Timer;
    /**
     * @hidden
     */
    constructor(targEl: string | HTMLElement | undefined, properties: PublisherProperties, openvidu: OpenVidu);
    /**
     * Publish or unpublish the audio stream (if available). Calling this method twice in a row passing same `enabled` value will have no effect
     *
     * #### Events dispatched
     *
     * > _Only if `Session.publish(Publisher)` has been called for this Publisher_
     *
     * The {@link Session} object of the local participant will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"audioActive"` and `reason` set to `"publishAudio"`
     * The {@link Publisher} object of the local participant will also dispatch the exact same event
     *
     * The {@link Session} object of every other participant connected to the session will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"audioActive"` and `reason` set to `"publishAudio"`
     * The respective {@link Subscriber} object of every other participant receiving this Publisher's stream will also dispatch the exact same event
     *
     * See {@link StreamPropertyChangedEvent} to learn more.
     *
     * @param enabled `true` to publish the audio stream, `false` to unpublish it
     */
    publishAudio(enabled: boolean): void;
    /**
     * Publish or unpublish the video stream (if available). Calling this method twice in a row passing same `enabled` value will have no effect
     *
     * #### Events dispatched
     *
     * > _Only if `Session.publish(Publisher)` has been called for this Publisher_
     *
     * The {@link Session} object of the local participant will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"videoActive"` and `reason` set to `"publishVideo"`
     * The {@link Publisher} object of the local participant will also dispatch the exact same event
     *
     * The {@link Session} object of every other participant connected to the session will dispatch a `streamPropertyChanged` event with `changedProperty` set to `"videoActive"` and `reason` set to `"publishVideo"`
     * The respective {@link Subscriber} object of every other participant receiving this Publisher's stream will also dispatch the exact same event
     *
     * See {@link StreamPropertyChangedEvent} to learn more.
     *
     * @param enabled `true` to publish the video stream, `false` to unpublish it
     * @param resource
     * - If parameter **`enabled`** is `false`, this optional parameter is of type boolean. It can be set to `true` to forcibly free the hardware resource associated to the video track, or can be set to `false` to keep the access to the hardware resource.
     * Not freeing the resource makes the operation much more efficient, but depending on the platform two side-effects can be introduced: the video device may not be accessible by other applications and the access light of
     * webcams may remain on. This is platform-dependent: some browsers will not present the side-effects even when not freeing the resource.</li>
     * - If parameter **`enabled`** is `true`, this optional parameter is of type [MediaStreamTrack](https://developer.mozilla.org/docs/Web/API/MediaStreamTrack). It can be set to force the restoration of the video track with a custom track. This may be
     * useful if the Publisher was unpublished freeing the hardware resource, and openvidu-browser is not able to successfully re-create the video track as it was before unpublishing. In this way previous track settings will be ignored and this MediaStreamTrack
     * will be used instead.
     */
    publishVideo<T extends boolean>(enabled: T, resource?: T extends false ? boolean : MediaStreamTrack): Promise<void>;
    /**
     * Call this method before {@link Session.publish} if you prefer to subscribe to your Publisher's remote stream instead of using the local stream, as any other user would do.
     */
    subscribeToRemote(value?: boolean): void;
    /**
     * See {@link EventDispatcher.on}
     */
    on<K extends keyof PublisherEventMap>(type: K, handler: (event: PublisherEventMap[K]) => void): this;
    /**
     * See {@link EventDispatcher.once}
     */
    once<K extends keyof PublisherEventMap>(type: K, handler: (event: PublisherEventMap[K]) => void): this;
    /**
     * See {@link EventDispatcher.off}
     */
    off<K extends keyof PublisherEventMap>(type: K, handler?: (event: PublisherEventMap[K]) => void): this;
    /**
     * Replaces the current video or audio track with a different one. This allows you to replace an ongoing track with a different one
     * without having to renegotiate the whole WebRTC connection (that is, initializing a new Publisher, unpublishing the previous one
     * and publishing the new one).
     *
     * You can get this new MediaStreamTrack by using the native Web API or simply with {@link OpenVidu.getUserMedia} method.
     *
     * **WARNING: this method has been proven to work in the majority of cases, but there may be some combinations of published/replaced tracks that may be incompatible
     * between them and break the connection in OpenVidu Server. A complete renegotiation may be the only solution in this case.
     * Visit [RTCRtpSender.replaceTrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack) documentation for further details.**
     *
     * @param track The [MediaStreamTrack](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) object to replace the current one.
     * If it is an audio track, the current audio track will be the replaced one. If it is a video track, the current video track will be the replaced one.
     *
     * @returns A Promise (to which you can optionally subscribe to) that is resolved if the track was successfully replaced and rejected with an Error object in other case
     */
    replaceTrack(track: MediaStreamTrack): Promise<void>;
    /**
     * @hidden
     */
    initialize(): Promise<void>;
    /**
     * @hidden
     */
    replaceTrackAux(track: MediaStreamTrack, updateLastConstraints: boolean): Promise<void>;
    /**
     * @hidden
     *
     * To obtain the videoDimensions we wait for the video reference to have enough metadata
     * and then try to use MediaStreamTrack.getSettingsMethod(). If not available, then we
     * use the HTMLVideoElement properties videoWidth and videoHeight
     */
    getVideoDimensions(): Promise<{
        width: number;
        height: number;
    }>;
    /**
     * @hidden
     */
    reestablishStreamPlayingEvent(): void;
    /**
     * @hidden
     */
    initializeVideoReference(mediaStream: MediaStream): void;
    /**
     * @hidden
     */
    replaceTrackInMediaStream(track: MediaStreamTrack, updateLastConstraints: boolean): void;
    private setPermissionDialogTimer;
    private clearPermissionDialogTimer;
    private replaceTrackInRtcRtpSender;
}