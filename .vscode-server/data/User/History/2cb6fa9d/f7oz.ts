import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { StreamManager } from 'openvidu-browser/lib/OpenVidu/StreamManager';
/**
 * Triggered by:
 * - {@link StreamManagerEventMap.streamPlaying}
 * - {@link StreamManagerEventMap.streamAudioVolumeChange}
 */
export declare class StreamManagerEvent extends Event {
    /**
     * For `streamAudioVolumeChange` event:
     * - `{newValue: number, oldValue: number}`: new and old audio volume values. These values are between -100 (silence) and 0 (loudest possible volume).
     * They are not exact and depend on how the browser is managing the audio track, but -100 and 0 can be taken as limit values.
     *
     * For `streamPlaying` event undefined
     */
    value: Object | undefined;
    /**
     * @hidden
     */
    constructor(target: StreamManager, type: string, value: Object | undefined);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}