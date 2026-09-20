import { FiX, FiUser, FiImage, FiFile } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export default function ProfilePanel({ onClose }) {
  const { user } = useAuth();
  const { activeConversation, onlineUsers } = useChat();

  if (!activeConversation) return null;

  const otherUser = activeConversation?.participants?.find(p => (p?._id || p)?.toString() !== (user?._id || user)?.toString()) || {};
  const isOnline = otherUser?._id && onlineUsers.has(otherUser._id.toString());

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 shrink-0">
        <h3 className="font-medium text-gray-900 dark:text-white">Contact Info</h3>
        <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/30 mb-4 border-4 border-white dark:border-gray-800 shadow-lg">
            {otherUser?.avatar ? (
              <img src={otherUser.avatar.startsWith('http') ? otherUser.avatar : `http://localhost:5000${otherUser.avatar}`} alt={otherUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-500">
                {otherUser?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{otherUser?.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">@{otherUser?.username}</p>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
            {isOnline ? 'Active Now' : 'Offline'}
          </span>
        </div>

        {/* About / Bio */}
        {otherUser?.bio && (
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
              {otherUser.bio}
            </p>
          </div>
        )}

        {/* Media & Files - Placeholders for future feature */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Media</h4>
            <button className="text-xs text-indigo-600 hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {/* Mock images */}
            {[1,2,3].map(i => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                <FiImage />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Files</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><FiFile /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">project_brief.pdf</p>
                <p className="text-xs text-gray-500">2.4 MB</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
