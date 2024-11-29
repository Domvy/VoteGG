import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { ConnectionEventReason } from 'openvidu-browser/lib/OpenViduInternal/Events/Types/Types';
/**
 * Triggered by:
 * - {@link SessionEventMap.connectionCreated}
 * - {@link SessionEventMap.connectionDestroyed}
 */
export declare class ConnectionEvent extends Event {
    /**
     * Connection object that was created or destroyed
     */
    connection: Connection;
    /**
     * For `connectionDestroyed` event:
     * - "disconnect": the remote user has called `Session.disconnect()`
     * - "forceDisconnectByUser": the remote user has been evicted from the Session by other user calling `Session.forceDisconnect()`
     * - "forceDisconnectByServer": the remote user has been evicted from the Session by the application
     * - "sessionClosedByServer": the Session has been closed by the application
     * - "networkDisconnect": the remote user network connection has dropped
     * - "nodeCrashed": a node has crashed in the server side
     *
     * For `connectionCreated` event an empty string
     */
    reason: ConnectionEventReason;
    /**
     * @hidden
     */
    constructor(cancelable: boolean, target: Session, type: string, connection: Connection, reason: ConnectionEventReason);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}