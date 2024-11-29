import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { ConnectionEventReason } from 'openvidu-browser/lib/OpenViduInternal/Events/Types/Types';
/**
 * Triggered by {@link SessionEventMap.sessionDisconnected}
 */
export declare class SessionDisconnectedEvent extends Event {
    /**
     * - "disconnect": you have called `Session.disconnect()`
     * - "forceDisconnectByUser": you have been evicted from the Session by other user calling `Session.forceDisconnect()`
     * - "forceDisconnectByServer": you have been evicted from the Session by the application
     * - "sessionClosedByServer": the Session has been closed by the application
     * - "networkDisconnect": your network connection has dropped. Before a SessionDisconnectedEvent with this reason is triggered,
     *      Session object will always have previously dispatched a `reconnecting` event. If the reconnection process succeeds,
     *      Session object will dispatch a `reconnected` event. If it fails, Session object will dispatch a SessionDisconnectedEvent
     *      with reason "networkDisconnect"
     * - "nodeCrashed": a node has crashed in the server side. You can use this reason to ask your application's backend to reconnect
     * to a new session to replace the crashed one
     */
    reason: ConnectionEventReason;
    /**
     * @hidden
     */
    constructor(target: Session, reason: ConnectionEventReason);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
