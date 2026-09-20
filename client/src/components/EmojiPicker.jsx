import EmojiPicker from 'emoji-picker-react';
import { useTheme } from '../context/ThemeContext';

export default function EmojiPickerWrapper({ onEmojiClick }) {
  const { isDark } = useTheme();

  return (
    <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <EmojiPicker 
        onEmojiClick={onEmojiClick}
        theme={isDark ? 'dark' : 'light'}
        lazyLoadEmojis={true}
        searchDisabled={false}
        skinTonesDisabled={true}
      />
    </div>
  );
}
