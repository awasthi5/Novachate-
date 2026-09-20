import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../hooks/useSocket';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ProfilePanel from '../components/ProfilePanel';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('sidebar'); // 'sidebar' | 'chat'
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const { loadConversations, activeConversation } = useChat();
  
  // Initialize socket hook here so listeners are active
  useSocket();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Handle responsive view changes
  useEffect(() => {
    if (activeConversation) {
      setActiveView('chat');
    } else {
      setActiveView('sidebar');
    }
  }, [activeConversation]);

  const handleBackToSidebar = () => {
    setActiveView('sidebar');
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Sidebar - hidden on mobile if chat is active */}
      <div className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 ${activeView === 'chat' ? 'hidden md:block' : 'block'}`}>
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${activeView === 'sidebar' ? 'hidden md:flex' : 'flex'}`}>
        <ChatWindow 
          onBack={handleBackToSidebar} 
          onToggleProfile={() => setShowProfilePanel(!showProfilePanel)} 
        />
      </div>

      {/* Right Profile Panel - only shows when toggled */}
      {showProfilePanel && activeConversation && (
        <div className="w-full md:w-80 flex-shrink-0 border-l border-gray-200 dark:border-gray-800 absolute md:relative inset-y-0 right-0 bg-white dark:bg-gray-900 z-10 slide-in">
          <ProfilePanel onClose={() => setShowProfilePanel(false)} />
        </div>
      )}
    </div>
  );
}
