import { useState } from 'react';
import { FiCheck, FiCheckCircle, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';

export default function Message({ message, isOwn }) {
  const { deleteMessage, editMessage } = useChat();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = () => {
    if (editText.trim() && editText !== message.text) {
      editMessage(message._id, editText);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this message?')) {
      deleteMessage(message._id);
    }
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800/50 text-gray-500 italic text-sm border border-gray-200 dark:border-gray-700">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group mb-2 animate-fade-in`}>
      <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        
        {/* Reply Preview could go here */}

        <div className={`relative px-4 py-2 shadow-sm ${
          isOwn 
            ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700'
        }`}>
          
          {/* Attachments */}
          {message.attachments?.length > 0 && (
            <div className="mb-2 space-y-1">
              {message.attachments.map((att, i) => {
                const url = typeof att === 'string' ? att : att.url;
                const isImage = typeof att === 'string' ? true : att.mimetype?.startsWith('image/');
                const fullUrl = url?.startsWith('http') ? url : `http://localhost:5000${url}`;
                return isImage ? (
                  <img key={i} src={fullUrl} alt="attachment" className="max-w-full h-auto rounded-lg max-h-60 object-cover cursor-pointer" />
                ) : (
                  <a key={i} href={fullUrl} target="_blank" rel="noopener noreferrer" className="block text-sm underline text-indigo-200 hover:text-white">
                    📎 {att.originalName || 'Download file'}
                  </a>
                );
              })}
            </div>
          )}

          {/* Text */}
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input 
                type="text" 
                value={editText} 
                onChange={e => setEditText(e.target.value)}
                className="text-gray-900 p-1 rounded w-full outline-none"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleEdit()}
              />
              <div className="flex justify-end gap-2 text-xs">
                <button onClick={() => setIsEditing(false)} className="hover:underline">Cancel</button>
                <button onClick={handleEdit} className="font-bold hover:underline">Save</button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
              {message.text}
            </p>
          )}

          {/* Meta data (time, status) */}
          <div className={`flex items-center justify-end gap-1 text-[11px] mt-1 ${isOwn ? 'text-indigo-200' : 'text-gray-500'}`}>
            {message.isEdited && <span>(edited)</span>}
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <span className="ml-1">
                {message.read ? <FiCheckCircle className="w-3.5 h-3.5" /> : <FiCheck className="w-3.5 h-3.5" />}
              </span>
            )}
          </div>

          {/* Context Menu Trigger */}
          {isOwn && !isEditing && (
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="absolute top-2 -left-8 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
            >
              <FiMoreVertical />
            </button>
          )}

          {/* Context Menu */}
          {showMenu && (
            <div className="absolute top-0 -left-32 bg-white dark:bg-gray-800 shadow-xl rounded-lg py-1 border border-gray-200 dark:border-gray-700 z-10 w-28">
              <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => { handleDelete(); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400">
                <FiTrash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
