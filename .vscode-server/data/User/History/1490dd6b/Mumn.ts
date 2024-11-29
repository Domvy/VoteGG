import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
/**
 * Triggered by {@link SessionEventMap.networkQualityLevelChanged}
 */
export declare class NetworkQualityLevelChangedEvent extends Event {
    /**
     * New value of the network quality level
     */
    newValue: number;
    /**
     * Old value of the network quality level
     */
    oldValue: number;
    /**
     * Connection for whom the network quality level changed
     */
    connection: Connection;
    /**
     * @hidden
     */
    constructor(target: Session, newValue: number, oldValue: number, connection: Connection);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
