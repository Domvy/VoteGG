/// <reference types="react" />
import { PickerConfig } from 'emoji-picker-react/dist/config/config';
export { ExportedEmoji as Emoji } from 'emoji-picker-react/dist/components/emoji/ExportedEmoji';
export { EmojiStyle, SkinTones, Theme, Categories, EmojiClickData, SuggestionMode, SkinTonePickerLocation } from 'emoji-picker-react/dist/types/exposedTypes';
export interface PickerProps extends PickerConfig {
}
export default function EmojiPicker(props: PickerProps): JSX.Element;