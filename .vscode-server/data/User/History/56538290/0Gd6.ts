/// <reference types="react" />
import { EmojiStyle } from 'emoji-picker-react/dist/types/exposedTypes';
import { GetEmojiUrl } from 'emoji-picker-react/dist/components/emoji/BaseEmojiProps';
export declare function ExportedEmoji({ unified, size, emojiStyle, lazyLoad, getEmojiUrl, emojiUrl }: {
    unified: string;
    emojiStyle?: EmojiStyle;
    size?: number;
    lazyLoad?: boolean;
    getEmojiUrl?: GetEmojiUrl;
    emojiUrl?: string;
}): JSX.Element | null;
