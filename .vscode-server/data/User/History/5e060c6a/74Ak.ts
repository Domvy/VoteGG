import { StreamEvent } from 'openvidu-browser/lib/OpenViduInternal/Events/StreamEvent';
import { StreamManagerEventMap } from 'openvidu-browser/lib/OpenViduInternal/Events/EventMap/StreamManagerEventMap';
/**
 * Events dispatched by {@link Publisher} object. Manage event listeners with
 * {@link Publisher.on}, {@link Publisher.once} and {@link Publisher.off} methods.
 *
 * Example:
 *
 * ```javascript
 * publisher.on('accessDenied', () => {
 *      console.error('Camera access has been denied!');
 * }
 *
 * publisher.off('accessDenied');
 * ```
 */
export interface PublisherEventMap extends StreamManagerEventMap {
    /**
     * Event dispatched when the {@link Publisher} has been published to the session (see {@link Session.publish}).
     */
    streamCreated: StreamEvent;
    /**
     * Event dispatched when the {@link Publisher} has been unpublished from the session.
     */
    streamDestroyed: StreamEvent;
    /**
     * Event dispatched when a Publisher tries to access some media input device and has the required permissions to do so.
     *
     * This happens when calling {@link OpenVidu.initPublisher} or {@link OpenVidu.initPublisherAsync} and the application
     * has permissions to use the devices. This usually means the user has accepted the permissions dialog that the
     * browser will show when trying to access the camera/microphone/screen.
     */
    accessAllowed: never;
    /**
     * Event dispatched when a Publisher tries to access some media input device and does NOT have the required permissions to do so.
     *
     * This happens when calling {@link OpenVidu.initPublisher} or {@link OpenVidu.initPublisherAsync} and the application
     * lacks the required permissions to use the devices. This usually means the user has NOT accepted the permissions dialog that the
     * browser will show when trying to access the camera/microphone/screen.
     */
    accessDenied: never;
    /**
     * Event dispatched when the pop-up shown by the browser to request permissions for the input media devices is opened.
     *
     * You can use this event to alert the user about granting permissions for your website. Note that this event is artificially
     * generated based only on time intervals when accessing media devices. A heavily overloaded client device that simply takes more
     * than usual to access the media device could produce a false trigger of this event.
     */
    accessDialogOpened: never;
    /**
     * Event dispatched after the user clicks on "Allow" or "Block" in the pop-up shown by the browser to request permissions
     * for the input media devices.
     *
     * This event can only be triggered after an {@link accessDialogOpened} event has been previously triggered.
     */
    accessDialogClosed: never;
}
