import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Publisher } from 'openvidu-browser/lib/OpenVidu/Publisher';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { Stream } from 'openvidu-browser/lib/OpenVidu/Stream';
import { StreamEventReason } from 'openvidu-browser/lib/OpenViduInternal/Events/Types/Types';
/**
 * Triggered by:
 * - `streamCreated` (available for [Session](/en/stable/api/openvidu-browser/interfaces/SessionEventMap.html#streamCreated) and [Publisher](/en/stable/api/openvidu-browser/interfaces/PublisherEventMap.html#streamCreated) objects)
 * - `streamDestroyed` (available for [Session](/en/stable/api/openvidu-browser/interfaces/SessionEventMap.html#streamDestroyed) and [Publisher](/en/stable/api/openvidu-browser/interfaces/PublisherEventMap.html#streamDestroyed) objects)
 */
export declare class StreamEvent extends Event {
    /**
     * Stream object that was created or destroyed
     */
    stream: Stream;
    /**
     * For 'streamDestroyed' event:
     * - "unpublish": method `Session.unpublish()` has been called
     * - "disconnect": method `Session.disconnect()` has been called
     * - "forceUnpublishByUser": some user has called `Session.forceUnpublish()` over the Stream
     * - "forceDisconnectByUser": some user has called `Session.forceDisconnect()` over the Stream
     * - "forceUnpublishByServer": the user's stream has been unpublished from the Session by the application
     * - "forceDisconnectByServer": the user has been evicted from the Session by the application
     * - "sessionClosedByServer": the Session has been closed by the application
     * - "networkDisconnect": the user's network connection has dropped
     * - "nodeCrashed": a node has crashed in the server side
     *
     * For 'streamCreated' empty string
     */
    reason: StreamEventReason;
    /**
     * @hidden
     */
    constructor(cancelable: boolean, target: Session | Publisher, type: string, stream: Stream, reason: StreamEventReason);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
