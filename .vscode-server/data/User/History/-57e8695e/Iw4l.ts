import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
/**
 * **This feature is part of OpenVidu
 * <a href="https://docs.openvidu.io/en/stable/openvidu-pro/" style="display: inline-block; background-color: rgb(0, 136, 170); color: white; font-weight: bold; padding: 0px 5px; margin: 0 2px 0 2px; border-radius: 3px; font-size: 13px; line-height:21px; text-decoration: none; font-family: Montserrat, sans-serif">PRO</a>
 * and
 * <a href="https://docs.openvidu.io/en/stable/openvidu-enterprise/" style="display: inline-block; background-color: rgb(156, 39, 176); color: white; font-weight: bold; padding: 0px 5px; margin: 0 2px 0 2px; border-radius: 3px; font-size: 13px; line-height:21px; text-decoration: none; font-family: Montserrat, sans-serif">ENTERPRISE</a>
 * editions**
 *
 * Triggered by {@link SessionEventMap.connectionPropertyChanged}
 */
export declare class ConnectionPropertyChangedEvent extends Event {
    /**
     * The Connection whose property has changed
     */
    connection: Connection;
    /**
     * The property of the stream that changed. This value is either `"role"` or `"record"`
     */
    changedProperty: string;
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
    constructor(target: Session, connection: Connection, changedProperty: string, newValue: Object, oldValue: Object);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
