import { EmojiProperties } from 'emoji-picker-react/dist/dataUtils/DataTypes';
export declare type CustomEmoji = {
    names: string[];
    [EmojiProperties.imgUrl]: string;
    id: string;
};