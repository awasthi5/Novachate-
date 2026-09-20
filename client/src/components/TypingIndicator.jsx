import { FiUser } from 'react-icons/fi';

export default function TypingIndicator({ avatar }) {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="flex items-end gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {avatar ? (
            <img src={avatar.startsWith('http') ? avatar : `http://localhost:5000${avatar}`} alt="typing" className="w-full h-full object-cover" />
          ) : (
            <FiUser className="w-full h-full p-1 text-gray-500" />
          )}
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1 w-16 h-10">
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
