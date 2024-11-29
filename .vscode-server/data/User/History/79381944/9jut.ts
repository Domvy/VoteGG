import { StreamOptionsServer } from 'openvidu-browser/lib/OpenViduInternal/Interfaces/Private/StreamOptionsServer';
export interface RemoteConnectionOptions {
    id: string;
    createdAt: number;
    metadata: string;
    streams: StreamOptionsServer[];
}
