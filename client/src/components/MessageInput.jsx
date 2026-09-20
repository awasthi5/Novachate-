import { useState, useRef, useEffect } from 'react';
import { FiSend, FiPaperclip, FiSmile, FiX } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../hooks/useSocket';
import EmojiPickerWrapper from './EmojiPicker';

export default function MessageInput({ conversationId, receiverId }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const { sendMessage } = useChat();
  const { emitTyping, emitStopTyping } = useSocket();
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // Auto-grow textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

    // Emit typing indicator
    if (e.target.value) {
      emitTyping(conversationId, receiverId);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping(conversationId, receiverId);
      }, 2000);
    } else {
      emitStopTyping(conversationId, receiverId);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !file) return;

    const messageData = file ? new FormData() : {};
    
    if (file) {
      messageData.append('attachments', file);
      messageData.append('conversationId', conversationId);
      messageData.append('receiverId', receiverId);
      if (text.trim()) messageData.append('text', text.trim());
    } else {
      messageData.conversationId = conversationId;
      messageData.receiverId = receiverId;
      messageData.text = text.trim();
    }

    // Optimistic reset
    setText('');
    setFile(null);
    setFilePreview('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    emitStopTyping(conversationId, receiverId);

    try {
      await sendMessage(messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could handle error state here
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview('file_icon');
      }
    }
  };

  const onEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

  return (
    <div className="relative">
      {/* File Preview */}
      {file && (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3">
          {filePreview !== 'file_icon' ? (
            <img src={filePreview} alt="preview" className="h-16 w-16 object-cover rounded-lg" />
          ) : (
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-center p-1 break-words">
              {file.name}
            </div>
          )}
          <button onClick={() => { setFile(null); setFilePreview(''); }} className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <FiX className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <EmojiPickerWrapper onEmojiClick={onEmojiClick} />
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-end gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl border border-transparent focus-within:border-indigo-300 dark:focus-within:border-indigo-700 transition-colors">
        
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <FiSmile className="w-5 h-5" />
        </button>

        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <FiPaperclip className="w-5 h-5" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

        <textarea
          ref={inputRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none outline-none resize-none max-h-[120px] py-2.5 text-gray-900 dark:text-white placeholder-gray-500 custom-scrollbar"
          rows="1"
        />

        <button 
          type="submit" 
          disabled={!text.trim() && !file}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md"
        >
          <FiSend className="w-5 h-5 ml-0.5" />
        </button>
      </form>
    </div>
  );
}
