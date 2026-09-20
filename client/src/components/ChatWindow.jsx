import { useEffect, useRef } from 'react';
import { FiArrowLeft, FiInfo, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

export default function ChatWindow({ onBack, onToggleProfile }) {
  const { user } = useAuth();
  const { activeConversation, messages, onlineUsers, typingUsers, loadMessages, markAsRead } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation._id);
      markAsRead(activeConversation._id);
    }
  }, [activeConversation, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
          <FiMessageCircle className="w-10 h-10 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Welcome to Novachate</h2>
        <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  const otherUser = activeConversation?.participants?.find(p => (p?._id || p)?.toString() !== (user?._id || user)?.toString()) || {};
  const isOnline = otherUser?._id && onlineUsers.has(otherUser._id.toString());
  const isTyping = otherUser?._id && typingUsers[activeConversation._id]?.[otherUser._id];

  // Group messages by date could be added here

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] dark:bg-[#111b21] relative">
      {/* Header */}
      <div className="h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer" onClick={onToggleProfile}>
            {otherUser?.avatar ? (
              <img src={otherUser.avatar.startsWith('http') ? otherUser.avatar : `http://localhost:5000${otherUser.avatar}`} alt={otherUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {otherUser?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="cursor-pointer" onClick={onToggleProfile}>
            <h2 className="font-semibold text-gray-900 dark:text-white leading-tight">{otherUser?.name}</h2>
            <p className={`text-xs ${isOnline ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div>
          <button onClick={onToggleProfile} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <FiInfo className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} isOwn={msg.sender._id === user._id || msg.sender === user._id} />
        ))}
        {isTyping && <TypingIndicator avatar={otherUser?.avatar} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <MessageInput conversationId={activeConversation._id} receiverId={otherUser?._id} />
      </div>
    </div>
  );
}
