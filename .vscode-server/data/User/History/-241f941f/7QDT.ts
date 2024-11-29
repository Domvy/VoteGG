import { Stream } from 'openvidu-browser/lib/OpenVidu/Stream';
import { EventDispatcher } from 'openvidu-browser/lib/OpenVidu/EventDispatcher';
import { StreamManagerVideo } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/StreamManagerVideo';
import { StreamManagerEventMap } from 'openvidu-browser/lib/OpenViduInternal/Events/EventMap/StreamManagerEventMap';
import { VideoInsertMode } from 'openvidu-browser/lib/OpenViduInternal/Enums/VideoInsertMode';
/**
 * Interface in charge of displaying the media streams in the HTML DOM. This wraps any {@link Publisher} and {@link Subscriber} object.
 * You can insert as many video players fo the same Stream as you want by calling {@link StreamManager.addVideoElement} or
 * {@link StreamManager.createVideoElement}.
 * The use of StreamManager wrapper is particularly useful when you don't need to differentiate between Publisher or Subscriber streams or just
 * want to directly manage your own video elements (even more than one video element per Stream). This scenario is pretty common in
 * declarative, MVC frontend frameworks such as Angular, React or Vue.js
 *
 * See available event listeners at {@link StreamManagerEventMap}.
 */
export declare abstract class StreamManager extends EventDispatcher {
    /**
     * The Stream represented in the DOM by the Publisher/Subscriber
     */
    stream: Stream;
    /**
     * All the videos displaying the Stream of this Publisher/Subscriber
     */
    videos: StreamManagerVideo[];
    /**
     * Whether the Stream represented in the DOM is local or remote
     * - `false` for {@link Publisher}
     * - `true` for {@link Subscriber}
     */
    remote: boolean;
    /**
     * The DOM HTMLElement assigned as target element when creating the video for the Publisher/Subscriber. This property is only defined if:
     * - {@link Publisher} has been initialized by calling method {@link OpenVidu.initPublisher} with a valid `targetElement` parameter
     * - {@link Subscriber} has been initialized by calling method {@link Session.subscribe} with a valid `targetElement` parameter
     */
    targetElement: HTMLElement;
    /**
     * `id` attribute of the DOM video element displaying the Publisher/Subscriber's stream. This property is only defined if:
     * - {@link Publisher} has been initialized by calling method {@link OpenVidu.initPublisher} with a valid `targetElement` parameter
     * - {@link Subscriber} has been initialized by calling method {@link Session.subscribe} with a valid `targetElement` parameter
     */
    id: string;
    /**
     * @hidden
     */
    protected firstVideoElement?: StreamManagerVideo;
    /**
     * @hidden
     */
    protected element: HTMLElement;
    /**
     * @hidden
     */
    protected canPlayListener: EventListener;
    /**
     * @hidden
     */
    private streamPlayingEventExceptionTimeout?;
    /**
     * @hidden
     */
    private lazyLaunchVideoElementCreatedEvent;
    /**
     * @hidden
     */
    constructor(stream: Stream, targetElement?: HTMLElement | string);
    /**
     * See {@link EventDispatcher.on}
     */
    on<K extends keyof StreamManagerEventMap>(type: K, handler: (event: StreamManagerEventMap[K]) => void): this;
    /**
     * See {@link EventDispatcher.once}
     */
    once<K extends keyof StreamManagerEventMap>(type: K, handler: (event: StreamManagerEventMap[K]) => void): this;
    /**
     * See {@link EventDispatcher.off}
     */
    off<K extends keyof StreamManagerEventMap>(type: K, handler?: (event: StreamManagerEventMap[K]) => void): this;
    /**
     * Makes `video` element parameter display this {@link stream}. This is useful when you are
     * [managing the video elements on your own](/en/stable/cheatsheet/manage-videos/#you-take-care-of-the-video-players)
     *
     * Calling this method with a video already added to other Publisher/Subscriber will cause the video element to be
     * disassociated from that previous Publisher/Subscriber and to be associated to this one.
     *
     * @returns 1 if the video wasn't associated to any other Publisher/Subscriber and has been successfully added to this one.
     * 0 if the video was already added to this Publisher/Subscriber. -1 if the video was previously associated to any other
     * Publisher/Subscriber and has been successfully disassociated from that one and properly added to this one.
     */
    addVideoElement(video: HTMLVideoElement): number;
    /**
     * Creates a new video element displaying this {@link stream}. This allows you to have multiple video elements displaying the same media stream.
     *
     * #### Events dispatched
     *
     * The Publisher/Subscriber object will dispatch a `videoElementCreated` event once the HTML video element has been added to DOM. See {@link VideoElementEvent}
     *
     * @param targetElement HTML DOM element (or its `id` attribute) in which the video element of the Publisher/Subscriber will be inserted
     * @param insertMode How the video element will be inserted accordingly to `targetElemet`
     *
     * @returns The created HTMLVideoElement
     */
    createVideoElement(targetElement?: string | HTMLElement, insertMode?: VideoInsertMode): HTMLVideoElement;
    /**
     * Updates the current configuration for the {@link PublisherSpeakingEvent} feature and the [StreamManagerEvent.streamAudioVolumeChange](/en/stable/api/openvidu-browser/classes/StreamManagerEvent.html) feature for this specific
     * StreamManager audio stream, overriding the global options set with {@link OpenVidu.setAdvancedConfiguration}. This way you can customize the audio events options
     * for each specific StreamManager and change them dynamically.
     *
     * @param publisherSpeakingEventsOptions New options to be applied to this StreamManager's audio stream. It is an object which includes the following optional properties:
     * - `interval`: (number) how frequently the analyser polls the audio stream to check if speaking has started/stopped or audio volume has changed. Default **100** (ms)
     * - `threshold`: (number) the volume at which _publisherStartSpeaking_, _publisherStopSpeaking_ events will be fired. Default **-50** (dB)
     */
    updatePublisherSpeakingEventsOptions(publisherSpeakingEventsOptions: {
        interval?: number;
        threshold?: number;
    }): void;
    /**
     * @hidden
     */
    initializeVideoProperties(video: HTMLVideoElement): void;
    /**
     * @hidden
     */
    removeAllVideos(): void;
    /**
     * @hidden
     */
    disassociateVideo(video: HTMLVideoElement): boolean;
    /**
     * @hidden
     */
    addPlayEventToFirstVideo(): void;
    /**
     * @hidden
     */
    updateMediaStream(mediaStream: MediaStream): void;
    /**
     * @hidden
     */
    emitEvent(type: string, eventArray: any[]): void;
    /**
     * @hidden
     */
    createVideo(): HTMLVideoElement;
    /**
     * @hidden
     */
    removeSrcObject(streamManagerVideo: StreamManagerVideo): void;
    /**
     * @hidden
     */
    abstract replaceTrackInMediaStream(track: MediaStreamTrack, updateLastConstraints: boolean): void;
    protected pushNewStreamManagerVideo(streamManagerVideo: StreamManagerVideo): void;
    private mirrorVideo;
    private removeMirrorVideo;
    private isMirroredVideo;
    private activateStreamPlayingEventExceptionTimeout;
    private deactivateStreamPlayingEventExceptionTimeout;
}
