import { Event } from 'openvidu-browser/lib/OpenViduInternal/Events/Event';
import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
import { Session } from 'openvidu-browser/lib/OpenVidu/Session';
import { SpeechToTextEventReason } from 'openvidu-browser/lib/OpenViduInternal/Events/Types/Types';
/**
 * Triggered by {@link SessionEventMap.speechToTextMessage}
 */
export declare class SpeechToTextEvent extends Event {
    /**
     * The {@link Connection} owning the Stream that produced the speech-to-text event.
     * In other words, this is the participant that spoke and produced this transcription event.
     */
    connection: Connection;
    /**
     * The text of the event. This is the transcription for this specific piece of audio stream
     */
    text: string;
    /**
     * All speech-to-text events are generated
     */
    reason: SpeechToTextEventReason;
    /**
     * The original event from the speech to text engine. This can vary depending on the engine
     */
    raw: string;
    /**
     * [BCP-47](https://tools.ietf.org/html/bcp47) language tag (like "en-US" or "es-ES") of the recognized text. This will be the same as the language provided
     * in method {@link Session.subscribeToSpeechToText} method
     */
    lang: string;
    /**
     * @hidden
     */
    constructor(target: Session, connection: Connection, text: string, reason: SpeechToTextEventReason, raw: string, lang: string);
    /**
     * @hidden
     */
    callDefaultBehavior(): void;
}