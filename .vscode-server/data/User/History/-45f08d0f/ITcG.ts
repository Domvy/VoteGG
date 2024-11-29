import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Filter } from 'openvidu-browser/lib/OpenVidu/Filter';
/**
 * Defines every event dispatched by audio/video stream filters. You can subscribe to filter events by calling {@link Filter.addEventListener}
 */
export declare class FilterEvent extends Event {
    /**
     * Data of the event
     */
    data: Object;
    /**
     * @hidden
     */
    constructor(target: Filter, eventType: string, data: Object);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
