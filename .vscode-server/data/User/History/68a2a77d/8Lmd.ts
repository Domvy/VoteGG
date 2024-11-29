import { Filter } from 'openvidu-browser/lib/OpenVidu/Filter';
import { TypeOfVideo } from 'openvidu-browser/lib/OpenViduInternal/Enums/TypeOfVideo';
export interface StreamOptionsServer {
    id: string;
    createdAt: number;
    hasAudio: boolean;
    hasVideo: boolean;
    audioActive: boolean;
    videoActive: boolean;
    typeOfVideo: TypeOfVideo;
    frameRate: number;
    videoDimensions: string;
    filter: Filter;
}
