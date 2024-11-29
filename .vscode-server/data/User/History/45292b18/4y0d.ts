import { Stream } from 'openvidu-browser/lib/OpenVidu/Stream';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
import { SubscriberProperties } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/SubscriberProperties';
/**
 * Packs remote media streams. Participants automatically receive them when others publish their streams. Initialized with {@link Session.subscribe} method
 *
 * See available event listeners at {@link StreamManagerEventMap}.
 */
export declare class Subscriber extends StreamManager {
    /**
     * @hidden
     */
    properties: SubscriberProperties;
    /**
     * @hidden
     */
    constructor(stream: Stream, targEl: string | HTMLElement | undefined, properties: SubscriberProperties);
    /**
     * Subscribe or unsubscribe from the audio stream (if available). Calling this method twice in a row passing same value will have no effect
     * @param value `true` to subscribe to the audio stream, `false` to unsubscribe from it
     */
    subscribeToAudio(value: boolean): Subscriber;
    /**
     * Subscribe or unsubscribe from the video stream (if available). Calling this method twice in a row passing same value will have no effect
     * @param value `true` to subscribe to the video stream, `false` to unsubscribe from it
     */
    subscribeToVideo(value: boolean): Subscriber;
    /**
     * @hidden
     */
    replaceTrackInMediaStream(track: MediaStreamTrack, updateLastConstraints: boolean): void;
}