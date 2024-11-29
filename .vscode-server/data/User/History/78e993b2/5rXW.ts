import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
/**
 * Triggered by {@link SessionEventMap.signal}
 */
export declare class SignalEvent extends Event {
    /**
     * The type of signal. It is string `"signal"` for those signals sent with no {@link SignalOptions.type} property, and `"signal:type"` if was sent with a
     * valid {@link SignalOptions.type} property.
     *
     * The client must be specifically subscribed to `Session.on('signal:type', function(signalEvent) {...})` to trigger that type of signal.
     *
     * Subscribing to `Session.on('signal', function(signalEvent) {...})` will trigger all signals, no matter their type.
     */
    type: string;
    /**
     * The message of the signal (can be empty)
     */
    data?: string;
    /**
     * The client that sent the signal. This property is undefined if the signal
     * was directly generated by the application server (not by other client)
     */
    from?: Connection;
    /**
     * @hidden
     */
    constructor(target: Session, type?: string, data?: string, from?: Connection);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}
