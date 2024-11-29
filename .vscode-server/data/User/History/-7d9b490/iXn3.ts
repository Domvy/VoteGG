import { CustomEmoji } from 'emoji-picker-react/dist/config/customEmojiConfig';
import { DataEmoji } from 'emoji-picker-react/dist/dataUtils/DataTypes';
import { EmojiStyle } from 'emoji-picker-react/dist/types/exposedTypes';
export declare type BaseEmojiProps = {
    emoji?: DataEmoji | CustomEmoji;
    emojiStyle: EmojiStyle;
    unified: string;
    size?: number;
    lazyLoad?: boolean;
    getEmojiUrl?: GetEmojiUrl;
    className?: string;
};
export declare type GetEmojiUrl = (unified: string, style: EmojiStyle) => string;