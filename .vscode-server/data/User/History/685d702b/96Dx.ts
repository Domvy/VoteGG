import { Connection } from 'openvidu-browser/lib/OpenVidu/Connection';
import { Filter } from 'openvidu-browser/lib/OpenVidu/Filter';
import { TypeOfVideo } from 'openvidu-browser/lib/OpenViduInternal/Enums/TypeOfVideo';
export interface InboundStreamOptions {
    id: string;
    createdAt: number;
    connection: Connection;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: TypeOfVideo;
    frameRate: number;
    videoDimensions: {
        width: number;
        height: number;
    };
    filter?: Filter;
}
