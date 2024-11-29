import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
/**
 * Triggered by:
 * - {@link StreamManagerEventMap.videoElementCreated}
 * - {@link StreamManagerEventMap.videoElementDestroyed}
 */
export declare class VideoElementEvent extends Event {
    /**
     * Video element that was created or destroyed
     */
    element: HTMLVideoElement;
    /**
     * @hidden
     */
    constructor(element: HTMLVideoElement, target: StreamManager, type: string);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}