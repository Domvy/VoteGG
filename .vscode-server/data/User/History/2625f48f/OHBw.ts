import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { Stream } from 'openvidu-browser/lib/OpenVidu/Stream';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
import { StreamPropertyChangedEventReason, ChangedPropertyType } from 'openvidu-browser/lib/OpenViduInternal/Events/Types/Types';
/**
 * Triggered by `streamPropertyChanged` (available for [Session](/en/stable/api/openvidu-browser/interfaces/SessionEventMap.html#streamPropertyChanged) and [StreamManager](/en/stable/api/openvidu-browser/interfaces/StreamManagerEventMap.html#streamPropertyChanged) objects)
 */
export declare class StreamPropertyChangedEvent extends Event {
    /**
     * The Stream whose property has changed. You can always identify the user publishing the changed stream by consulting property {@link Stream.connection}
     */
    stream: Stream;
    /**
     * The property of the stream that changed. This value is either `"videoActive"`, `"audioActive"`, `"videoTrack"`, `"audioTrack"`, `"videoDimensions"` or `"filter"`
     */
    changedProperty: ChangedPropertyType;
    /**
     * Cause of the change on the stream's property:
     * - For `videoActive`: `"publishVideo"`
     * - For `audioActive`: `"publishAudio"`
     * - For `videoTrack`: `"trackReplaced"`
     * - For `audioTrack`: `"trackReplaced"`
     * - For `videoDimensions`: `"deviceRotated"`, `"screenResized"` or `"trackReplaced"`
     * - For `filter`: `"applyFilter"`, `"execFilterMethod"` or `"removeFilter"`
     */
    reason: StreamPropertyChangedEventReason;
    /**
     * New value of the property (after change, current value)
     */
    newValue: Object;
    /**
     * Previous value of the property (before change)
     */
    oldValue: Object;
    /**
     * @hidden
     */
    constructor(target: Session | StreamManager, stream: Stream, changedProperty: ChangedPropertyType, newValue: Object, oldValue: Object, reason: StreamPropertyChangedEventReason);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
