import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

export const useSocket = () => {
  const { token } = useAuth();
  const { 
    setMessages, 
    setOnlineUsers, 
    setTypingUsers, 
    setUnreadCounts,
    loadConversations,
    activeConversation 
  } = useChat();
  const socketRef = useRef(null);
  const activeConvRef = useRef(activeConversation);

  useEffect(() => {
    activeConvRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    if (!token) return;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : '/');
    const socket = io(backendUrl, {
      auth: { token }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected successfully');
      if (activeConvRef.current?._id) {
        socket.emit('joinConversation', activeConvRef.current._id);
      }
    });

    socket.on('getOnlineUsers', (usersList) => {
      setOnlineUsers(new Set(usersList));
    });

    socket.on('userOnline', (userId) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.add(userId);
        return updated;
      });
    });

    socket.on('userOffline', (userId) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    socket.on('receiveMessage', (message) => {
      const currentActive = activeConvRef.current;
      const convId = (message.conversation?._id || message.conversation || '').toString();
      const activeId = (currentActive?._id || '').toString();

      if (activeId && convId === activeId) {
        setMessages(prev => {
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      } else if (convId) {
        setUnreadCounts(prev => ({
          ...prev,
          [convId]: (prev[convId] || 0) + 1
        }));
      }

      // Refresh conversations list to update last message preview and order
      loadConversations();
    });

    socket.on('messageUpdated', (updatedMessage) => {
      setMessages(prev => prev.map(m => m._id === updatedMessage._id ? updatedMessage : m));
      loadConversations();
    });

    socket.on('messageDeleted', ({ messageId }) => {
      setMessages(prev => prev.map(m => {
        if (m._id === messageId) {
          return { ...m, isDeleted: true, text: 'This message was deleted', attachments: [] };
        }
        return m;
      }));
      loadConversations();
    });

    socket.on('typing', ({ userId, conversationId }) => {
      setTypingUsers(prev => ({
        ...prev,
        [conversationId]: { ...(prev[conversationId] || {}), [userId]: true }
      }));
    });

    socket.on('stopTyping', ({ userId, conversationId }) => {
      setTypingUsers(prev => {
        const newState = { ...prev };
        if (newState[conversationId]) {
          const updatedConv = { ...newState[conversationId] };
          delete updatedConv[userId];
          newState[conversationId] = updatedConv;
        }
        return newState;
      });
    });

    socket.on('messageRead', ({ messageIds }) => {
      if (Array.isArray(messageIds) && messageIds.length > 0) {
        setMessages(prev => prev.map(m => messageIds.includes(m._id) ? { ...m, isRead: true } : m));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, setMessages, setOnlineUsers, setTypingUsers, setUnreadCounts, loadConversations]);

  // Handle joining room when active conversation changes
  useEffect(() => {
    if (activeConversation?._id && socketRef.current?.connected) {
      socketRef.current.emit('joinConversation', activeConversation._id);
    }
  }, [activeConversation?._id]);

  const emitTyping = (conversationId, receiverId) => {
    socketRef.current?.emit('typing', { conversationId, receiverId });
  };

  const emitStopTyping = (conversationId, receiverId) => {
    socketRef.current?.emit('stopTyping', { conversationId, receiverId });
  };

  const joinConversation = (conversationId) => {
    socketRef.current?.emit('joinConversation', conversationId);
  };

  const leaveConversation = (conversationId) => {
    socketRef.current?.emit('leaveConversation', conversationId);
  };

  const markMessageRead = (messageIds, conversationId, senderId) => {
    socketRef.current?.emit('messageRead', { messageIds, conversationId, senderId });
  };

  return {
    socket: socketRef.current,
    emitTyping,
    emitStopTyping,
    joinConversation,
    leaveConversation,
    markMessageRead
  };
};
