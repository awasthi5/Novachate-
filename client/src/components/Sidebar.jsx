import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiSettings, FiLogOut, FiSearch, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import UserSearch from './UserSearch';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { conversations, activeConversation, setActiveConversation, onlineUsers, unreadCounts } = useChat();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m`;
    if (diff < 86400000 && date.getDate() === now.getDate()) return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    if (diff < 172800000) return 'Yesterday';
    return date.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants || !user) return {};
    return conv.participants.find(p => (p?._id || p)?.toString() !== (user?._id || user)?.toString()) || {};
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer" onClick={() => navigate('/profile')}>
            {user?.avatar ? (
              <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-full h-full p-2 text-gray-500" />
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{user?.name}</h2>
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </div>
        <div className="flex gap-2 text-gray-500 dark:text-gray-400">
          <ThemeToggle />
          <button onClick={() => navigate('/profile')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"><FiSettings className="w-5 h-5" /></button>
          <button onClick={logout} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-red-500"><FiLogOut className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 relative z-20">
        <UserSearch onSelect={(otherUser) => {
          // Find if conversation exists, if not, logic is in UserSearch or create it here
        }} />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center">
            <FiMessageCircle className="w-12 h-12 mb-2 opacity-50" />
            <p>No conversations yet. Search for a user to start chatting!</p>
          </div>
        ) : (
          conversations.map(conv => {
            const otherUser = getOtherParticipant(conv);
            const isActive = activeConversation?._id === conv._id;
            const isOnline = otherUser?._id && onlineUsers.has(otherUser._id.toString());
            const unreadCount = unreadCounts[conv._id] || 0;

            return (
              <div 
                key={conv._id}
                onClick={() => setActiveConversation(conv)}
                className={`flex items-center gap-3 p-3 mx-2 my-1 rounded-xl cursor-pointer transition-colors ${
                  isActive ? 'bg-indigo-50 dark:bg-indigo-900/40' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {otherUser?.avatar ? (
                      <img src={otherUser.avatar.startsWith('http') ? otherUser.avatar : `http://localhost:5000${otherUser.avatar}`} alt={otherUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="w-full h-full p-2.5 text-gray-500" />
                    )}
                  </div>
                  {isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{otherUser?.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {formatTime(conv.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                      {conv.lastMessage?.text || (conv.lastMessage?.attachments?.length ? 'Sent an attachment' : 'New conversation')}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-2 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
