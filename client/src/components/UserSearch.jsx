import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiUser } from 'react-icons/fi';
import { users as usersApi, conversations as convApi } from '../services/api';
import { useChat } from '../context/ChatContext';

export default function UserSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  
  const { conversations, loadConversations, setActiveConversation } = useChat();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await usersApi.searchUsers(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectUser = async (user) => {
    setIsOpen(false);
    setQuery('');
    
    // Check if conversation already exists
    const existingConv = conversations.find(c => 
      c.participants.some(p => p._id === user._id)
    );

    if (existingConv) {
      setActiveConversation(existingConv);
    } else {
      // Create new conversation
      try {
        const { data } = await convApi.createConversation(user._id);
        await loadConversations();
        setActiveConversation(data);
      } catch (error) {
        console.error('Failed to create conversation', error);
      }
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          placeholder="Search users..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900 border rounded-xl text-sm outline-none transition-all dark:text-white"
        />
      </div>

      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            results.map(user => (
              <div 
                key={user._id} 
                onClick={() => handleSelectUser(user)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700/50 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-full h-full p-2 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
