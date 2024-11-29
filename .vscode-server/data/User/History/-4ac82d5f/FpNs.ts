import { PublisherProperties } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Public/PublisherProperties';
export interface OutboundStreamOptions {
    publisherProperties: PublisherProperties;
    mediaConstraints: MediaStreamConstraints;
}
