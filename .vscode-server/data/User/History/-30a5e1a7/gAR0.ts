import { Filter } from 'openvidu-browser/lib/OpenVidu/Filter';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
export declare abstract class Event {
    /**
     * Whether the event has a default behavior that may be prevented by calling {@link Event.preventDefault}
     */
    cancelable: boolean;
    /**
     * The object that dispatched the event
     */
    target: Session | StreamManager | Filter;
    /**
     * The type of event. This is the same string you pass as first parameter when calling method `on()` of any object implementing {@link EventDispatcher} interface
     */
    type: string;
    /**
     * @hidden
     */
    hasBeenPrevented: boolean;
    /**
     * @hidden
     */
    constructor(cancelable: boolean, target: Session | StreamManager | Filter, type: string);
    /**
     * Whether the default beahivour of the event has been prevented or not. Call {@link Event.preventDefault} to prevent it
     */
    isDefaultPrevented(): boolean;
    /**
     * Prevents the default behavior of the event. The following events have a default behavior:
     *
     * - `sessionDisconnected`: dispatched by {@link Session} object, automatically unsubscribes the leaving participant from every Subscriber object of the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks)
     * and also deletes any HTML video element associated to each Subscriber (only those created by OpenVidu Browser, either by passing a valid parameter as `targetElement` in method {@link Session.subscribe} or
     * by calling {@link Subscriber.createVideoElement}). For every video removed, each Subscriber object will also dispatch a `videoElementDestroyed` event.
     *
     * - `streamDestroyed`:
     *   - If dispatched by a {@link Publisher} (*you* have unpublished): automatically stops all media tracks and deletes any HTML video element associated to it (only those created by OpenVidu Browser, either by passing a valid parameter as `targetElement`
     * in method {@link OpenVidu.initPublisher} or by calling {@link Publisher.createVideoElement}). For every video removed, the Publisher object will also dispatch a `videoElementDestroyed` event.
     *   - If dispatched by {@link Session} (*other user* has unpublished): automatically unsubscribes the proper Subscriber object from the session (this includes closing the RTCPeerConnection and disposing all MediaStreamTracks)
     * and also deletes any HTML video element associated to that Subscriber (only those created by OpenVidu Browser, either by passing a valid parameter as `targetElement` in method {@link Session.subscribe} or
     * by calling {@link Subscriber.createVideoElement}). For every video removed, the Subscriber object will also dispatch a `videoElementDestroyed` event.
     */
    preventDefault(): void;
    /**
     * @hidden
     */
    abstract callDefaultBehavior(): any;
}
